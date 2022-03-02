/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiProxy, GenericHandlerOptionsHandler, RequestContext, RequestSource, RouteHandlerOptions, RouterData, RouterHandlerDefaultMethods } from './common/types';
import { craftUID, craftUIDKey, extendRequest, resolveUrl } from './common/utils';
import Dataset from './dataset';
import Logger from './logger';
import Queue from './queue';
import Router from './router';
import storesApi, { StoresList } from './stores';

class GenericHandler<Methods = RouterHandlerDefaultMethods, AllowedNames = string> {
    uid!: string;
    name: AllowedNames;
    id!: string;

    handler: GenericHandlerOptionsHandler<Methods>;
    controlHandler: GenericHandlerOptionsHandler<Methods>;
    failHandler: GenericHandlerOptionsHandler<Methods>;
    extendApi: (context: RequestContext, api: Partial<ApiProxy & Methods>) => Partial<Methods>;

    dataset: Dataset;
    queue: Queue;
    router: Router;

    log: Logger;

    constructor(options: RouteHandlerOptions<Methods, AllowedNames>) {
        const { key = 'generic-handler', name, handler, controlHandler, failHandler, extendApi } = options;

        this.uid = craftUID();
        this.name = name;
        this.id = `${key}-${name}`; // -${this.uid}

        this.handler = handler || (async () => undefined);
        this.controlHandler = controlHandler || (async () => undefined);
        this.failHandler = failHandler || (async () => undefined);
        this.extendApi = extendApi || (() => ({} as Partial<Methods>));

        this.dataset = undefined;
        this.queue = undefined;
        this.router = undefined;

        this.log = new Logger(this);
    }

    async initialize() {
        if (!this.dataset) {
            this.dataset = new Dataset();
        }

        if (!this.queue) {
            this.queue = new Queue(this.name as unknown as string);
        }
    }

    attachRouter(router: Router) {
        this.router = router;
    }

    get store(): StoresList {
        return storesApi.get();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    makeApi(context: RequestContext, routerData: RouterData = {}) {
        const getTrailId = () => context?.request?.userData?.trailId;

        let api = {
            // main api
            store: this.store,
            dataset: this.dataset,
            queue: this.queue,
            router: this.router,
            // resource
            resource: {
                uid: this.uid,
                name: this.name as unknown as string,
                id: this.id,
            },
            // accessors
            getInput: () => routerData.input || {},
            // trail
            trail: {
                addToRequest: (request: RequestSource) => extendRequest(request, { trailId: getTrailId() }),
                getId: () => getTrailId(),
                getState: () => this.store.trails.get(getTrailId()) || {},
                setState: (state: any) => this.store.trails.set(getTrailId(), state),
            },
            // utils
            log: this.log.cloneWithSuffix(getTrailId() ? `${getTrailId()}:${context?.request?.id}` : ''),
            absoluteUrl: (path: string) => resolveUrl(path, context.request.loadedUrl !== 'about:blank' ? context.request.loadedUrl : context.request.url),
            // request
            async addEntryRequest(routeName: string, query: any, request: RequestSource, options: { trailId?: string } = {}) {
                let trailId = options?.trailId;

                if (!trailId) {
                    // Store the trail
                    const trailData = { query, requests: {}, stats: { startedAt: new Date().toISOString() } };
                    trailId = craftUIDKey('trail_');
                    this.store.trails.set(trailId, trailData);
                }

                // Pass on data for the control
                return api.queue.addRaw(extendRequest(request, { type: routeName, trailId }));
            },
        };

        // Extends it first with router
        api = {
            ...api,
            ...(this.router.extendRouteApi(context, api) || {}),
        };

        return {
            ...api,
            ...(this.extendApi(context, api as Partial<ApiProxy & Methods>) || {}),
        } as Partial<ApiProxy & Methods>;
    }

    // eslint-disable-next-line max-len
    async run(context: RequestContext, routerData?: RouterData): Promise<void> {
        await this.initialize();

        const api = this.makeApi(context, routerData);

        api.log.start(`Started.. ${context?.request?.url || ''}`);

        try {
            await this.handler(context, api);
        } catch (error) {
            this.log.error(`Failed with error.`, { error });
            throw error;
        }

        try {
            await this.controlHandler(context, api);
        } catch (error) {
            this.log.error(`Failed with error.`, { error });
            throw error;
        }

        // this.log.end('Ended.');
    }
};

export default GenericHandler;
