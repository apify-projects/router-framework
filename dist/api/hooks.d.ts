import { RouteHandlerOptions, RouterHandlerDefaultMethods } from '../common/types';
export declare function ROUTER_STARTED<Methods = RouterHandlerDefaultMethods>(options: Omit<RouteHandlerOptions<Methods>, 'name'>): import("../hook").default<Methods, import("../common/types").HookAvailableNames>;
export declare function QUEUE_STARTED<Methods = RouterHandlerDefaultMethods>(options: Omit<RouteHandlerOptions<Methods>, 'name'>): import("../hook").default<Methods, import("../common/types").HookAvailableNames>;
export declare function ROUTE_STARTED<Methods = RouterHandlerDefaultMethods>(options: Omit<RouteHandlerOptions<Methods>, 'name'>): import("../hook").default<Methods, import("../common/types").HookAvailableNames>;
export declare function ROUTE_ENDED<Methods = RouterHandlerDefaultMethods>(options: Omit<RouteHandlerOptions<Methods>, 'name'>): import("../hook").default<Methods, import("../common/types").HookAvailableNames>;
export declare function ROUTE_FAILED<Methods = RouterHandlerDefaultMethods>(options: Omit<RouteHandlerOptions<Methods>, 'name'>): import("../hook").default<Methods, import("../common/types").HookAvailableNames>;
export declare function QUEUE_ENDED<Methods = RouterHandlerDefaultMethods>(options: Omit<RouteHandlerOptions<Methods>, 'name'>): import("../hook").default<Methods, import("../common/types").HookAvailableNames>;
export declare function ROUTER_ENDED<Methods = RouterHandlerDefaultMethods>(options: Omit<RouteHandlerOptions<Methods>, 'name'>): import("../hook").default<Methods, import("../common/types").HookAvailableNames>;
declare const _default: {
    ROUTER_STARTED: typeof ROUTER_STARTED;
    ROUTER_ENDED: typeof ROUTER_ENDED;
    ROUTE_STARTED: typeof ROUTE_STARTED;
    ROUTE_ENDED: typeof ROUTE_ENDED;
    ROUTE_FAILED: typeof ROUTE_FAILED;
    QUEUE_STARTED: typeof QUEUE_STARTED;
    QUEUE_ENDED: typeof QUEUE_ENDED;
};
export default _default;
//# sourceMappingURL=hooks.d.ts.map