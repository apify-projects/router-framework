"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const apify_1 = (0, tslib_1.__importDefault)(require("apify"));
const consts_1 = require("./consts");
const logger_1 = (0, tslib_1.__importDefault)(require("./logger"));
const stores_1 = (0, tslib_1.__importDefault)(require("./stores"));
class Router {
    id;
    inputValidator;
    routes;
    hooks;
    crawler;
    extendRouteApi;
    log;
    constructor(options) {
        const { key = `router`, inputValidator, routes = [], hooks = [], stores = [], crawler, extendRouteApi } = options;
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
        this.log = new logger_1.default(this);
    }
    setInputValidator(validator) {
        if (validator) {
            this.inputValidator = validator;
        }
    }
    setExtendRouteApi(extendApi) {
        this.extendRouteApi = extendApi;
    }
    setRoute(route) {
        this.routes[route.name] = route;
        route.attachRouter(this);
    }
    setRoutes(routes = []) {
        for (const route of routes) {
            this.setRoute(route);
        }
    }
    setHook(hook) {
        this.hooks[hook.name] = hook;
        hook.attachRouter(this);
    }
    setHooks(hooks = []) {
        for (const hook of hooks) {
            hook.extendApi = (context, api) => ({
                ...this.extendRouteApi(context, api),
                ...(hook.extendApi(context, api) || {}),
            });
            this.setHook(hook);
        }
    }
    setStore(store) {
        stores_1.default.add(store);
    }
    setStores(stores = []) {
        for (const store of stores) {
            stores_1.default.add(store);
        }
    }
    setCrawler(crawler) {
        this.crawler = crawler;
    }
    async _runHook(hookName, context, routerData) {
        if (hookName in this.hooks) {
            return this.hooks[hookName].run(context, routerData);
        }
    }
    getRoute(routeName) {
        const route = this.routes[routeName];
        if (!route) {
            throw new Error(`Route ${routeName} is not defined.`);
        }
        return route;
    }
    async run(inputRaw) {
        this.log.start('Started..');
        await stores_1.default.init();
        this.log.info(`Raw input is:`, { inputRaw });
        const { data: input, errors, valid } = this.inputValidator.validate(inputRaw || {});
        if (!valid) {
            throw new Error(`Input is not valid. Errors: ${JSON.stringify(errors)}`);
        }
        const routerData = { input };
        const logTrailHistory = (context) => {
            const trailId = context.request?.userData?.trailId;
            if (trailId) {
                stores_1.default.get().trails.update(`${trailId}.requests`, { [`${context.request.id}`]: context.request });
            }
        };
        const preNavigationHooks = [
            async (context) => {
                const trailId = context.request?.userData?.trailId;
                context.request.userData.startedAt = new Date().toISOString();
                context.request.userData.sizeInKb = 0;
                logTrailHistory(context);
                context.page.on('response', async (response) => {
                    try {
                        const additionalSize = Math.floor((await response.buffer()).length / 1000);
                        context.request.userData.sizeInKb += additionalSize;
                        if (trailId) {
                            stores_1.default.get().trails.add(`${trailId}.stats.sizeInKb`, additionalSize);
                        }
                    }
                    catch (error) {
                        // Fails on redirect, silently.
                    }
                });
            },
        ];
        const postNavigationHooks = [
            async (context) => {
                const trailId = context.request?.userData?.trailId;
                context.request.userData.endedAt = new Date().toISOString();
                // eslint-disable-next-line max-len
                context.request.userData.durationInMs = (new Date(context.request.userData.endedAt).getTime() - new Date(context.request.userData.startedAt).getTime());
                if (trailId) {
                    stores_1.default.get().trails.add(`${trailId}.stats.durationInMs`, context.request.userData.durationInMs);
                    stores_1.default.get().trails.add(`${trailId}.stats.retries`, context.request.retryCount);
                }
                logTrailHistory(context);
            },
        ];
        const handlePageFunction = async (context) => {
            this.log.start(`Opening page ${context.request.url}`);
            const { type } = context.request?.userData || {};
            // Before each route Hook can be used for logging, anti-bot detection, catpatcha, etc.
            // eslint-disable-next-line max-len
            await this._runHook(consts_1.HOOK.ROUTE_STARTED, context, routerData);
            await this.getRoute(type).run(context, routerData);
            // After each route Hook can be used for checking up data this would have been made ready to push to the dataset in KV.
            await this._runHook(consts_1.HOOK.ROUTE_ENDED, context, routerData);
        };
        const handleFailedRequestFunction = async (context) => {
            const { type } = context.request?.userData || {};
            // Run a general hook
            await this._runHook(consts_1.HOOK.ROUTE_FAILED, context, routerData);
            // Run the route fail handler
            const route = this.getRoute(type);
            await route.failHandler(context, route.makeApi(context, routerData));
        };
        // Don't get startled by this crawler function
        // I came up with this idea of the user providing its crawler while passing
        // our key params { requestQueue, handlePageFunction, handleFailedRequestFunction }
        // Will need to assess and improve this later.
        const crawler = this.crawler({
            // TODO: add a handleFailedRequestFunction
            requestQueue: await apify_1.default.openRequestQueue(),
            handlePageFunction,
            handleFailedRequestFunction,
            preNavigationHooks,
            postNavigationHooks,
        });
        // Hook to help with preparing the queue
        // Given a polyfilled requestQueue and the input data
        // User can add to the queue the starting requests to be crawled
        await this._runHook(consts_1.HOOK.ROUTER_STARTED, undefined, routerData);
        await this._runHook(consts_1.HOOK.QUEUE_STARTED, undefined, routerData);
        // Run the crawler
        await crawler.run();
        await stores_1.default.closing();
        // TODO: Provider functionnalities to the end hook
        await this._runHook(consts_1.HOOK.QUEUE_ENDED, undefined, routerData);
        // TODO: Provider functionnalities to the end hook
        await this._runHook(consts_1.HOOK.ROUTER_ENDED, undefined, routerData);
        await stores_1.default.persist();
        // this.log.end('Ended.');
    }
}
exports.default = Router;
;
//# sourceMappingURL=router.js.map