"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const apify_1 = (0, tslib_1.__importDefault)(require("apify"));
const logger_1 = (0, tslib_1.__importDefault)(require("./logger"));
const utils_1 = require("./common/utils");
const getRouteName = (routeNameOrRoute) => {
    return typeof routeNameOrRoute === 'string' ? routeNameOrRoute : routeNameOrRoute.name;
};
class Queue {
    id;
    defaultRouteName;
    requestQueue;
    parentRequest;
    log;
    constructor(defaultRouteName) {
        this.id = `queue`;
        this.defaultRouteName = defaultRouteName;
        this.requestQueue = undefined;
        this.log = new logger_1.default(this);
    }
    async init() {
        if (!this.requestQueue) {
            this.requestQueue = await apify_1.default.openRequestQueue();
        }
    }
    setParentRequest(parentRequest) {
        this.parentRequest = parentRequest;
    }
    async addTo(routeNameOrRoute, sourceOrSources, options) {
        await this.init();
        const routeName = getRouteName(routeNameOrRoute);
        const sources = Array.isArray(sourceOrSources) ? sourceOrSources : [sourceOrSources];
        return Promise.all(sources.map((source) => this.addOneTo(routeName, source, options)));
    }
    async addOneTo(routeNameOrRoute, source, options) {
        await this.init();
        const routeName = getRouteName(routeNameOrRoute);
        const sourceExtended = (0, utils_1.extendRequest)(source, { type: routeName });
        this.log.info(`Adding ${sourceExtended.url} to ${routeName} queue.`);
        return this.addRequest(sourceExtended, options);
    }
    async add(sourceOrSources, options) {
        if (!this.defaultRouteName) {
            throw new Error('Default route name is not defined, use addTo method instead');
        }
        return this.addTo(this.defaultRouteName, sourceOrSources, options);
    }
    async addRaw(sourceOrSources, options) {
        await this.init();
        const sources = Array.isArray(sourceOrSources) ? sourceOrSources : [sourceOrSources];
        return this.batchRequests(sources, options);
    }
    async addRequest(request, options) {
        this.log.info(`Adding ${request.url} to queue.`, { request });
        return this.requestQueue.addRequest(request, options);
    }
    async batchRequests(requests, options) {
        await this.init();
        return Promise.all(requests.map((request) => this.addRequest(request, options)));
    }
}
exports.default = Queue;
;
//# sourceMappingURL=queue.js.map