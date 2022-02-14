"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const generic_handler_1 = (0, tslib_1.__importDefault)(require("./generic-handler"));
// eslint-disable-next-line max-len
class Route extends generic_handler_1.default {
    constructor(options) {
        super({ ...options, key: 'route' });
    }
}
exports.default = Route;
//# sourceMappingURL=route.js.map