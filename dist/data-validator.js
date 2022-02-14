"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const logger_1 = (0, tslib_1.__importDefault)(require("./logger"));
class DataValidator {
    id;
    sanitizeHandler;
    validateHandler;
    log;
    constructor(options) {
        const { key = 'data-validator', name, sanitize, validate } = options;
        this.id = `${key}${name ? `-${name}` : ''}`;
        this.sanitizeHandler = sanitize || ((input) => input);
        this.validateHandler = validate || ((input) => ({ valid: true, data: input }));
        this.log = new logger_1.default(this);
    }
    sanitize(rawData) {
        return this.sanitizeHandler(rawData);
    }
    validate(rawData) {
        return this.validateHandler(this.sanitizeHandler(rawData));
    }
}
exports.default = DataValidator;
//# sourceMappingURL=data-validator.js.map