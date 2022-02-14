import Apify from 'apify';
import Logger from './logger';
import { RequestSource, RequestOptions } from './common/types';
declare type routeNameOrRoute = string | {
    name: string;
};
export default class Queue {
    id: string;
    defaultRouteName: string;
    requestQueue: Apify.RequestQueue;
    parentRequest: Apify.Request;
    log: Logger;
    constructor(defaultRouteName?: string);
    init(): Promise<void>;
    setParentRequest(parentRequest: Apify.Request): void;
    addTo(routeNameOrRoute: routeNameOrRoute, sourceOrSources: RequestSource | RequestSource[], options?: RequestOptions): Promise<Apify.QueueOperationInfo[]>;
    addOneTo(routeNameOrRoute: routeNameOrRoute, source: RequestSource, options?: RequestOptions): Promise<Apify.QueueOperationInfo>;
    add(sourceOrSources: RequestSource | RequestSource[], options?: RequestOptions): Promise<Apify.QueueOperationInfo[]>;
    addRaw(sourceOrSources: RequestSource | RequestSource[], options?: RequestOptions): Promise<Apify.QueueOperationInfo[]>;
    addRequest(request: RequestSource, options?: RequestOptions): Promise<Apify.QueueOperationInfo>;
    batchRequests(requests: RequestSource[], options?: RequestOptions): Promise<Apify.QueueOperationInfo[]>;
}
export {};
//# sourceMappingURL=queue.d.ts.map