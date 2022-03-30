import Router from '../router';
import useTrailStateMethods, { defaultSortBy, defaultSortByPropNumber, getDataModelPaths } from '../context/use-trail-state-methods';
import useValidation from '../context/use-validation';
import defineDataValidator from './define-data-validator';
import defineHook from './define-hook';
import defineRoute from './define-route';
import defineStore from './define-store';
import hooks from './hooks';

export { HOOK } from '../common/consts';
export * from '../common/utils';
export * from '../validation';

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
    getDataModelPaths,
    defaultSortByPropNumber,
    defaultSortBy,
    useTrailStateMethods,
    useValidation,
};

export default Router;
