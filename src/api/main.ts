import defineHook from './define-hook';
import defineDataValidator from './define-data-validator';
import defineRoute from './define-route';
import defineStore from './define-store';
import hooks from './hooks';
import Router from '../router';
import { HOOK } from '../consts';
import { craftUID, craftUIDKey, sortUIDKeysFromFirst, sortUIDKeysFromLast, arrayToKeyedObject, randomNumberBetween, resolveUrl } from '../common/utils';

const defineHookRouterStarted = hooks.ROUTER_STARTED;
const defineHookRouterEnded = hooks.ROUTER_ENDED;
const defineHookRouteStarted = hooks.ROUTE_STARTED;
const defineHookRouteEnded = hooks.ROUTE_ENDED;
const defineHookRouteFailed = hooks.ROUTE_FAILED;
const defineHookQueueStarted = hooks.QUEUE_STARTED;
const defineHookQueueEnded = hooks.QUEUE_ENDED;

export {
    Router,
    defineStore,
    defineHook,
    defineDataValidator,
    defineRoute,
    defineHookRouterStarted,
    defineHookRouterEnded,
    defineHookRouteStarted,
    defineHookRouteEnded,
    defineHookRouteFailed,
    defineHookQueueStarted,
    defineHookQueueEnded,
    HOOK,
    craftUID,
    craftUIDKey,
    sortUIDKeysFromFirst,
    sortUIDKeysFromLast,
    arrayToKeyedObject,
    randomNumberBetween,
};

export default {
    Router,
    defineStore,
    defineHook,
    defineDataValidator,
    defineRoute,
    defineHookRouterStarted,
    defineHookRouterEnded,
    defineHookRouteStarted,
    defineHookRouteEnded,
    defineHookRouteFailed,
    defineHookQueueStarted,
    defineHookQueueEnded,
    HOOK,
    craftUID,
    craftUIDKey,
    sortUIDKeysFromFirst,
    sortUIDKeysFromLast,
    arrayToKeyedObject,
    randomNumberBetween,
    resolveUrl,
};
