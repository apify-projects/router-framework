/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueueStartedApiMethods, RequestSource, RouteHandlerOptions, RouterHandlerDefaultMethods } from '../common/types';
import * as utils from '../common/utils';
import defineHook from './define-hook';

export function ROUTER_STARTED<Methods = RouterHandlerDefaultMethods>(options: Omit<RouteHandlerOptions<Methods>, 'name'>) {
    return defineHook<Methods>({
        ...options,
        name: 'ROUTER_STARTED',
    });
}

export function QUEUE_STARTED<Methods = RouterHandlerDefaultMethods>(options: Pick<RouteHandlerOptions<Methods | QueueStartedApiMethods>, 'handler'>) {
    return defineHook<Methods | QueueStartedApiMethods>({
        name: 'QUEUE_STARTED',
        handler: options.handler,
        extendApi(_, api) {
            return {
                addRequest(routeName: string, query: any, request: RequestSource) {
                    // Store the trail
                    const trailData = { query, requests: {}, stats: {}, data: {}, partial: {} };
                    const trailId = api.store.trails.setAndGetKey(trailData);
                    api.log.info(`Created trail ${trailId}`, { trailData });

                    // Pass on data for the control
                    const state = api.store.handlers.get(api.resource.id) as { requests: RequestSource[] } || { requests: [] };
                    const requestExtended = utils.extendRequest(request, { type: routeName, trailId });
                    state.requests.push(requestExtended);
                    api.store.handlers.set(api.resource.id, state);
                    // api.log.info(`Updated handler's state`, { state });
                },
            };
        },
        async controlHandler(_, api) {
            const state = api.store.handlers.get(api.resource.id) || {};
            const { requests = [] } = state;
            // api.log.info(`Fetched handler's state`, { state });
            for (const request of requests as RequestSource[]) {
                await api.queue.addRaw(request);
            }
        },
    });
}

export function ROUTE_STARTED<Methods = RouterHandlerDefaultMethods>(options: Omit<RouteHandlerOptions<Methods>, 'name'>) {
    return defineHook<Methods>({
        ...options,
        name: 'ROUTE_STARTED',
    });
}

export function ROUTE_ENDED<Methods = RouterHandlerDefaultMethods>(options: Omit<RouteHandlerOptions<Methods>, 'name'>) {
    return defineHook<Methods>({
        ...options,
        name: 'ROUTE_ENDED',
    });
}

export function ROUTE_FAILED<Methods = RouterHandlerDefaultMethods>(options: Omit<RouteHandlerOptions<Methods>, 'name'>) {
    return defineHook<Methods>({
        ...options,
        name: 'ROUTE_FAILED',
    });
}

export function QUEUE_ENDED<Methods = RouterHandlerDefaultMethods>(options: Omit<RouteHandlerOptions<Methods>, 'name'>) {
    return defineHook<Methods>({
        ...options,
        name: 'QUEUE_ENDED',
    });
}

export function ROUTER_ENDED<Methods = RouterHandlerDefaultMethods>(options: Omit<RouteHandlerOptions<Methods>, 'name'>) {
    return defineHook<Methods>({
        ...options,
        name: 'ROUTER_ENDED',
    });
}

export default {
    ROUTER_STARTED,
    ROUTER_ENDED,
    ROUTE_STARTED,
    ROUTE_ENDED,
    ROUTE_FAILED,
    QUEUE_STARTED,
    QUEUE_ENDED,
};
