/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiProxy, GenericHandlerOptionsHandler, RequestContext, RequestSource, RouteHandlerOptions, RouterData, RouterHandlerDefaultMethods } from './common/types';
import { craftUID, extendRequest, resolveUrl } from './common/utils';
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
    extendApi: (context: RequestContext, api: ApiProxy) => Methods;

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
        this.extendApi = extendApi || (() => ({} as Methods));

        this.dataset = undefined;
        this.queue = undefined;
        this.router = undefined;

        this.log = new Logger(this);
    }

    async _initialize() {
        if (!this.dataset) {
            this.dataset = new Dataset();
            this.dataset.log.attachParent(this);
        }

        if (!this.queue) {
            this.queue = new Queue(this.name as unknown as string);
            this.queue.log.attachParent(this);
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
        const getTrailId = () => context.request?.userData?.trailId;

        const api = {
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
            getInput: () => routerData.input,
            // trail
            trail: {
                addToRequest: (request: RequestSource) => extendRequest(request, { trailId: getTrailId() }),
                getId: () => getTrailId(),
                getState: () => this.store.trails.get(getTrailId()),
                setState: (state: any) => this.store.trails.set(getTrailId(), state),
            },
            // utils
            log: this.log,
            absoluteUrl: (path: string) => resolveUrl(path, context.request.loadedUrl),
        };

        return {
            ...api,
            ...(this.extendApi(context, api) || {}),
        } as (ApiProxy & Methods);
    }

    // eslint-disable-next-line max-len
    async run(context: RequestContext, routerData?: RouterData): Promise<void> {
        await this._initialize();

        this.log.start('Started..');

        try {
            await this.handler(context, this.makeApi(context, routerData));
        } catch (error) {
            this.log.error(`Failed with error.`, { error });
            throw error;
        }

        try {
            await this.controlHandler(context, this.makeApi(context, routerData));
        } catch (error) {
            this.log.error(`Failed with error.`, { error });
            throw error;
        }

        // this.log.end('Ended.');
    }
};

export default GenericHandler;
