"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("./common/utils");
const dataset_1 = (0, tslib_1.__importDefault)(require("./dataset"));
const logger_1 = (0, tslib_1.__importDefault)(require("./logger"));
const queue_1 = (0, tslib_1.__importDefault)(require("./queue"));
const stores_1 = (0, tslib_1.__importDefault)(require("./stores"));
class GenericHandler {
    uid;
    name;
    id;
    handler;
    controlHandler;
    failHandler;
    extendApi;
    dataset;
    queue;
    router;
    log;
    constructor(options) {
        const { key = 'generic-handler', name, handler, controlHandler, failHandler, extendApi } = options;
        this.uid = (0, utils_1.craftUID)();
        this.name = name;
        this.id = `${key}-${name}`; // -${this.uid}
        this.handler = handler || (async () => undefined);
        this.controlHandler = controlHandler || (async () => undefined);
        this.failHandler = failHandler || (async () => undefined);
        this.extendApi = extendApi || (() => ({}));
        this.dataset = undefined;
        this.queue = undefined;
        this.router = undefined;
        this.log = new logger_1.default(this);
    }
    async _initialize() {
        if (!this.dataset) {
            this.dataset = new dataset_1.default();
            this.dataset.log.attachParent(this);
        }
        if (!this.queue) {
            this.queue = new queue_1.default(this.name);
            this.queue.log.attachParent(this);
        }
    }
    attachRouter(router) {
        this.router = router;
    }
    get store() {
        return stores_1.default.get();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    makeApi(context, routerData = {}) {
        const getTrailId = () => context.request?.userData?.trailId;
        let api = {
            // main api
            store: this.store,
            dataset: this.dataset,
            queue: this.queue,
            router: this.router,
            // resource
            resource: {
                uid: this.uid,
                name: this.name,
                id: this.id,
            },
            // accessors
            getInput: () => routerData.input || {},
            // trail
            trail: {
                addToRequest: (request) => (0, utils_1.extendRequest)(request, { trailId: getTrailId() }),
                getId: () => getTrailId(),
                getState: () => this.store.trails.get(getTrailId()) || {},
                setState: (state) => this.store.trails.set(getTrailId(), state),
            },
            // utils
            log: this.log,
            absoluteUrl: (path) => (0, utils_1.resolveUrl)(path, context.request.loadedUrl),
        };
        // Extends it first with router
        api = {
            ...api,
            ...(this.router.extendRouteApi(context, api) || {}),
        };
        return {
            ...api,
            ...(this.extendApi(context, api) || {}),
        };
    }
    // eslint-disable-next-line max-len
    async run(context, routerData) {
        await this._initialize();
        this.log.start('Started..');
        try {
            await this.handler(context, this.makeApi(context, routerData));
        }
        catch (error) {
            this.log.error(`Failed with error.`, { error });
            throw error;
        }
        try {
            await this.controlHandler(context, this.makeApi(context, routerData));
        }
        catch (error) {
            this.log.error(`Failed with error.`, { error });
            throw error;
        }
        // this.log.end('Ended.');
    }
}
;
exports.default = GenericHandler;
//# sourceMappingURL=generic-handler.js.map