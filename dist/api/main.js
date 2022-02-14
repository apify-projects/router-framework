"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomNumberBetween = exports.arrayToKeyedObject = exports.craftUIDKey = exports.craftUID = exports.HOOK = exports.defineHookQueueEnded = exports.defineHookQueueStarted = exports.defineHookRouteFailed = exports.defineHookRouteEnded = exports.defineHookRouteStarted = exports.defineHookRouterEnded = exports.defineHookRouterStarted = exports.defineRoute = exports.defineDataValidator = exports.defineHook = exports.defineStore = exports.Router = void 0;
const tslib_1 = require("tslib");
const define_hook_1 = (0, tslib_1.__importDefault)(require("./define-hook"));
exports.defineHook = define_hook_1.default;
const define_data_validator_1 = (0, tslib_1.__importDefault)(require("./define-data-validator"));
exports.defineDataValidator = define_data_validator_1.default;
const define_route_1 = (0, tslib_1.__importDefault)(require("./define-route"));
exports.defineRoute = define_route_1.default;
const define_store_1 = (0, tslib_1.__importDefault)(require("./define-store"));
exports.defineStore = define_store_1.default;
const hooks_1 = (0, tslib_1.__importDefault)(require("./hooks"));
const router_1 = (0, tslib_1.__importDefault)(require("../router"));
exports.Router = router_1.default;
const consts_1 = require("../consts");
Object.defineProperty(exports, "HOOK", { enumerable: true, get: function () { return consts_1.HOOK; } });
const utils_1 = require("../common/utils");
Object.defineProperty(exports, "craftUID", { enumerable: true, get: function () { return utils_1.craftUID; } });
Object.defineProperty(exports, "craftUIDKey", { enumerable: true, get: function () { return utils_1.craftUIDKey; } });
Object.defineProperty(exports, "arrayToKeyedObject", { enumerable: true, get: function () { return utils_1.arrayToKeyedObject; } });
Object.defineProperty(exports, "randomNumberBetween", { enumerable: true, get: function () { return utils_1.randomNumberBetween; } });
const defineHookRouterStarted = hooks_1.default.ROUTER_STARTED;
exports.defineHookRouterStarted = defineHookRouterStarted;
const defineHookRouterEnded = hooks_1.default.ROUTER_ENDED;
exports.defineHookRouterEnded = defineHookRouterEnded;
const defineHookRouteStarted = hooks_1.default.ROUTE_STARTED;
exports.defineHookRouteStarted = defineHookRouteStarted;
const defineHookRouteEnded = hooks_1.default.ROUTE_ENDED;
exports.defineHookRouteEnded = defineHookRouteEnded;
const defineHookRouteFailed = hooks_1.default.ROUTE_FAILED;
exports.defineHookRouteFailed = defineHookRouteFailed;
const defineHookQueueStarted = hooks_1.default.QUEUE_STARTED;
exports.defineHookQueueStarted = defineHookQueueStarted;
const defineHookQueueEnded = hooks_1.default.QUEUE_ENDED;
exports.defineHookQueueEnded = defineHookQueueEnded;
exports.default = {
    Router: router_1.default,
    defineStore: define_store_1.default,
    defineHook: define_hook_1.default,
    defineDataValidator: define_data_validator_1.default,
    defineRoute: define_route_1.default,
    defineHookRouterStarted,
    defineHookRouterEnded,
    defineHookRouteStarted,
    defineHookRouteEnded,
    defineHookRouteFailed,
    defineHookQueueStarted,
    defineHookQueueEnded,
    HOOK: consts_1.HOOK,
    craftUID: utils_1.craftUID,
    craftUIDKey: utils_1.craftUIDKey,
    arrayToKeyedObject: utils_1.arrayToKeyedObject,
    randomNumberBetween: utils_1.randomNumberBetween,
    resolveUrl: utils_1.resolveUrl,
};
//# sourceMappingURL=main.js.map