"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTER_ENDED = exports.QUEUE_ENDED = exports.ROUTE_FAILED = exports.ROUTE_ENDED = exports.ROUTE_STARTED = exports.QUEUE_STARTED = exports.ROUTER_STARTED = void 0;
const tslib_1 = require("tslib");
const define_hook_1 = (0, tslib_1.__importDefault)(require("./define-hook"));
function ROUTER_STARTED(options) {
    return (0, define_hook_1.default)({
        ...options,
        name: 'ROUTER_STARTED',
    });
}
exports.ROUTER_STARTED = ROUTER_STARTED;
function QUEUE_STARTED(options) {
    return (0, define_hook_1.default)({
        ...options,
        name: 'QUEUE_STARTED',
    });
}
exports.QUEUE_STARTED = QUEUE_STARTED;
function ROUTE_STARTED(options) {
    return (0, define_hook_1.default)({
        ...options,
        name: 'ROUTE_STARTED',
    });
}
exports.ROUTE_STARTED = ROUTE_STARTED;
function ROUTE_ENDED(options) {
    return (0, define_hook_1.default)({
        ...options,
        name: 'ROUTE_ENDED',
    });
}
exports.ROUTE_ENDED = ROUTE_ENDED;
function ROUTE_FAILED(options) {
    return (0, define_hook_1.default)({
        ...options,
        name: 'ROUTE_FAILED',
    });
}
exports.ROUTE_FAILED = ROUTE_FAILED;
function QUEUE_ENDED(options) {
    return (0, define_hook_1.default)({
        ...options,
        name: 'QUEUE_ENDED',
    });
}
exports.QUEUE_ENDED = QUEUE_ENDED;
function ROUTER_ENDED(options) {
    return (0, define_hook_1.default)({
        ...options,
        name: 'ROUTER_ENDED',
    });
}
exports.ROUTER_ENDED = ROUTER_ENDED;
exports.default = {
    ROUTER_STARTED,
    ROUTER_ENDED,
    ROUTE_STARTED,
    ROUTE_ENDED,
    ROUTE_FAILED,
    QUEUE_STARTED,
    QUEUE_ENDED,
};
//# sourceMappingURL=hooks.js.map