/* eslint-disable @typescript-eslint/no-explicit-any */
import { RouteHandlerOptions, RouterHandlerDefaultMethods } from '../common/types';
import defineHook from './define-hook';

export function ROUTER_STARTED<Methods = RouterHandlerDefaultMethods>(options: Omit<RouteHandlerOptions<Methods>, 'name'>) {
    return defineHook<Methods>({
        ...options,
        name: 'ROUTER_STARTED',
    });
}

export function QUEUE_STARTED<Methods = RouterHandlerDefaultMethods>(options: Omit<RouteHandlerOptions<Methods>, 'name'>) {
    return defineHook<Methods>({
        ...options,
        name: 'QUEUE_STARTED',
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
