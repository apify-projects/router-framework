/* eslint-disable @typescript-eslint/no-explicit-any */
import Apify from 'apify';
import { ApiProxy, CrawlerType, RequestContext, RouterData, RouterHandlerDefaultMethods } from './common/types';
import { HOOK } from './consts';
import DataValidator from './data-validator';
import Hook from './hook';
import Logger from './logger';
import Route from './route';
import Store from './store';
import storesApi from './stores';

export type RouterOptions<Methods = RouterHandlerDefaultMethods> = {
    key?: string,
    inputValidator?: DataValidator,
    routes?: Route<any, any>[],
    hooks?: Hook<any, any>[],
    stores?: Store[],
    crawler?: CrawlerType,
    extendRouteApi?: (context: RequestContext, api: ApiProxy) => Methods,
}
export default class Router<Methods = RouterHandlerDefaultMethods> {
    id: string

    inputValidator: DataValidator;
    routes: { [routeName: string]: Route<any, any> };
    hooks: { [hookName: string]: Hook<any, any> };
    crawler: CrawlerType;
    extendRouteApi: (context: RequestContext, api: ApiProxy) => Methods;

    log: Logger;

    constructor(options: RouterOptions<Methods>) {
        const { key = `router`, inputValidator, routes = [], hooks = [], stores = [], crawler, extendRouteApi = () => null } = options;

        this.id = key;
        this.routes = {};
        this.hooks = {};
        this.crawler = undefined;

        this.setInputValidator(inputValidator);
        this.setRoutes(routes);
        this.setHooks(hooks);
        this.setStores(stores);
        this.setCrawler(crawler);
        this.setExtendRouteApi(extendRouteApi);

        this.log = new Logger(this);
    }

    setInputValidator(validator: DataValidator<any, any>) {
        if (validator) {
            this.inputValidator = validator;
        }
    }

    setExtendRouteApi(extendApi: (context: RequestContext, api: ApiProxy) => Methods) {
        this.extendRouteApi = extendApi;
    }

    setRoute(route: Route<any, any>) {
        this.routes[route.name] = route;
        route.attachRouter(this);
    }

    setRoutes(routes: Route<any, any>[] = []) {
        for (const route of routes) {
            this.setRoute(route);
        }
    }

    setHook(hook: Hook<any, any>) {
        this.hooks[hook.name] = hook;
        hook.attachRouter(this);
    }

    setHooks(hooks: Hook<any, any>[] = []) {
        for (const hook of hooks) {
            this.setHook(hook);
        }
    }

    setStore(store: Store) {
        storesApi.add(store);
    }

    setStores(stores: Store[] = []) {
        for (const store of stores) {
            storesApi.add(store);
        }
    }

    setCrawler(crawler: CrawlerType) {
        this.crawler = crawler;
    }

    async _runHook(hookName: string, context: RequestContext, routerData: RouterData) {
        if (hookName in this.hooks) {
            return this.hooks[hookName].run(context, routerData);
        }
    }

    getRoute(routeName: string) {
        const route = this.routes[routeName];
        if (!route) {
            throw new Error(`Route ${routeName} is not defined.`);
        }
        return route;
    }

    async run(inputRaw: any) {
        await storesApi.init();

        this.log.info(`Raw input is:`, { inputRaw });
        const { data: input, errors, valid } = this.inputValidator.validate(inputRaw || {});
        if (!valid) {
            throw new Error(`Input is not valid. Errors: ${JSON.stringify(errors)}`);
        }
        const routerData = { input };

        const logTrailHistory = (context: RequestContext) => {
            const trailId = context.request?.userData?.trailId;
            if (trailId) {
                storesApi.get().trails.update(`${trailId}.requests`, { [`${context.request.id}`]: context.request });
            }
        };

        const proxyConfiguration = (input as any).proxy ? await Apify.createProxyConfiguration((input as any).proxy) : undefined;

        const preNavigationHooks = [
            async (context: RequestContext) => {
                const trailId = context.request?.userData?.trailId;

                context.request.userData.startedAt = new Date().toISOString();
                context.request.userData.sizeInKb = 0;
                logTrailHistory(context);

                if ('page' in context) {
                    context.page.on('response', async (response) => {
                        try {
                            const additionalSize = Math.floor((await response.body()).length / 1000);
                            context.request.userData.sizeInKb += additionalSize;
                            if (trailId) {
                                storesApi.get().trails.add(`${trailId}.stats.sizeInKb`, additionalSize);
                            }
                        } catch (error) {
                            // Fails on redirect, silently.
                        }
                    });
                };

                if ('$' in context) {
                    try {
                        const additionalSize = Math.floor(context.$.html().length / 1000);
                        context.request.userData.sizeInKb += additionalSize;
                        if (trailId) {
                            storesApi.get().trails.add(`${trailId}.stats.sizeInKb`, additionalSize);
                        }
                    } catch (error) {
                        // Fails on redirect, silently.
                    }
                }
            },
        ];

        const postNavigationHooks = [
            async (context: RequestContext) => {
                const trailId = context.request?.userData?.trailId;
                context.request.userData.endedAt = new Date().toISOString();
                // eslint-disable-next-line max-len
                context.request.userData.aggregatedDurationInMs = (new Date(context.request.userData.endedAt).getTime() - new Date(context.request.userData.startedAt).getTime());

                if (trailId) {
                    storesApi.get().trails.add(`${trailId}.stats.aggregatedDurationInMs`, context.request.userData.aggregatedDurationInMs);
                    storesApi.get().trails.add(`${trailId}.stats.retries`, context.request.retryCount);
                    storesApi.get().trails.set(`${trailId}.stats.endedAt`, new Date().toISOString());
                }

                logTrailHistory(context);
            },
        ];

        const handlePageFunction = async (context: RequestContext) => {
            const { type } = context.request?.userData || {};

            // Before each route Hook can be used for logging, anti-bot detection, catpatcha, etc.
            // eslint-disable-next-line max-len
            await this._runHook(HOOK.ROUTE_STARTED, context, routerData);

            await this.getRoute(type).run(context, routerData);

            // After each route Hook can be used for checking up data this would have been made ready to push to the dataset in KV.
            await this._runHook(HOOK.ROUTE_ENDED, context, routerData);
        };

        const handleFailedRequestFunction = async (context: RequestContext) => {
            const { type } = context.request?.userData || {};

            // Run a general hook
            await this._runHook(HOOK.ROUTE_FAILED, context, routerData);

            // Run the route fail handler
            const route = this.getRoute(type);
            await route.initialize();
            await route.failHandler(context, route.makeApi(context, routerData));
        };

        // Don't get startled by this crawler function
        // I came up with this idea of the user providing its crawler while passing
        // our key params { requestQueue, handlePageFunction, handleFailedRequestFunction }
        // Will need to assess and improve this later.
        const crawler = await Promise.resolve(this.crawler({
            requestQueue: await Apify.openRequestQueue(),
            handlePageFunction,
            handleFailedRequestFunction,
            proxyConfiguration,
            preNavigationHooks,
            postNavigationHooks,
        }));

        // Hook to help with preparing the queue
        // Given a polyfilled requestQueue and the input data
        // User can add to the queue the starting requests to be crawled
        await this._runHook(HOOK.ROUTER_STARTED, undefined, routerData);

        await this._runHook(HOOK.QUEUE_STARTED, undefined, routerData);

        // Run the crawler
        await crawler.run();

        await storesApi.closing();

        // TODO: Provider functionnalities to the end hook
        await this._runHook(HOOK.QUEUE_ENDED, undefined, routerData);

        // TODO: Provider functionnalities to the end hook
        await this._runHook(HOOK.ROUTER_ENDED, undefined, routerData);

        await storesApi.persist();

        // this.log.end('Ended.');
    }
};
