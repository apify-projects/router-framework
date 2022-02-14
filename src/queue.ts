import Apify from 'apify';
import Logger from './logger';
import { RequestSource, RequestOptions } from './common/types';
import { extendRequest } from './common/utils';

type routeNameOrRoute = string | { name: string }

const getRouteName = (routeNameOrRoute: routeNameOrRoute) => {
    return typeof routeNameOrRoute === 'string' ? routeNameOrRoute : routeNameOrRoute.name;
};

export default class Queue {
    id: string;
    defaultRouteName: string;
    requestQueue: Apify.RequestQueue;
    parentRequest: Apify.Request;

    log: Logger;

    constructor(defaultRouteName?: string) {
        this.id = `queue`;
        this.defaultRouteName = defaultRouteName;
        this.requestQueue = undefined;

        this.log = new Logger(this);
    }

    async init() {
        if (!this.requestQueue) {
            this.requestQueue = await Apify.openRequestQueue();
        }
    }

    setParentRequest(parentRequest: Apify.Request) {
        this.parentRequest = parentRequest;
    }

    async addTo(
        routeNameOrRoute: routeNameOrRoute,
        sourceOrSources: RequestSource | RequestSource[],
        options?: RequestOptions,
    ): Promise<Apify.QueueOperationInfo[]> {
        await this.init();
        const routeName = getRouteName(routeNameOrRoute);
        const sources = Array.isArray(sourceOrSources) ? sourceOrSources : [sourceOrSources];
        return Promise.all(sources.map((source: RequestSource) => this.addOneTo(routeName, source, options)));
    }

    async addOneTo(routeNameOrRoute: routeNameOrRoute, source: RequestSource, options?: RequestOptions): Promise<Apify.QueueOperationInfo> {
        await this.init();
        const routeName = getRouteName(routeNameOrRoute);
        const sourceExtended = extendRequest(source, { type: routeName });
        this.log.info(`Adding ${sourceExtended.url} to ${routeName} queue.`);
        return this.addRequest(sourceExtended, options);
    }

    async add(sourceOrSources: RequestSource | RequestSource[], options?: RequestOptions): Promise<Apify.QueueOperationInfo[]> {
        if (!this.defaultRouteName) {
            throw new Error('Default route name is not defined, use addTo method instead');
        }
        return this.addTo(this.defaultRouteName, sourceOrSources, options);
    }

    async addRaw(sourceOrSources: RequestSource | RequestSource[], options?: RequestOptions): Promise<Apify.QueueOperationInfo[]> {
        await this.init();
        const sources = Array.isArray(sourceOrSources) ? sourceOrSources : [sourceOrSources];
        return this.batchRequests(sources, options);
    }

    async addRequest(request: RequestSource, options?: RequestOptions): Promise<Apify.QueueOperationInfo> {
        this.log.info(`Adding ${request.url} to queue.`, { request });
        return this.requestQueue.addRequest(request, options);
    }

    async batchRequests(requests: RequestSource[], options?: RequestOptions): Promise<Apify.QueueOperationInfo[]> {
        await this.init();
        // return (this.requestQueue as any).batchAddRequests(requests, options);
        return Promise.all(requests.map((request: RequestSource) => this.addRequest(request, options)));
    }
};
