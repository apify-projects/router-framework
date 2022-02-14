"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTER_ENDED = exports.QUEUE_ENDED = exports.ROUTE_FAILED = exports.ROUTE_ENDED = exports.ROUTE_STARTED = exports.QUEUE_STARTED = exports.ROUTER_STARTED = void 0;
const tslib_1 = require("tslib");
const utils = (0, tslib_1.__importStar)(require("../common/utils"));
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
        name: 'QUEUE_STARTED',
        handler: options.handler,
        extendApi(_, api) {
            return {
                addRequest(routeName, query, request) {
                    // Store the trail
                    const trailData = { query, requests: {}, stats: {}, data: {}, partial: {} };
                    const trailId = api.store.trails.setAndGetKey(trailData);
                    api.log.info(`Created trail ${trailId}`, { trailData });
                    // Pass on data for the control
                    const state = api.store.handlers.get(api.resource.id) || { requests: [] };
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
            for (const request of requests) {
                await api.queue.addRaw(request);
            }
        },
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