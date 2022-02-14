"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const apify_1 = (0, tslib_1.__importDefault)(require("apify"));
class Logger {
    resource;
    parents;
    logger;
    constructor(resource) {
        this.resource = resource;
        this.parents = [];
        this.logger = apify_1.default.utils.log;
    }
    trailId() {
        return [...this.parents.map((parent) => parent.id), this.resource.id].join(' > ');
    }
    makeLogMessage(prefix, id, message) {
        return `${prefix} (${id})  ${message}`;
    }
    ;
    attachParent(parent) {
        if (parent)
            this.parents.unshift(parent);
    }
    attachParents(parents = []) {
        this.parents.unshift(...parents);
    }
    start(message, data) {
        this.logger.info(this.makeLogMessage('[>] ', this.trailId(), message), data);
    }
    end(message, data) {
        this.logger.info(this.makeLogMessage('[<] ', this.trailId(), message), data);
    }
    info(message, data) {
        this.logger.info(this.makeLogMessage('[i] ', this.trailId(), message), data);
    }
    db(message, data) {
        this.logger.info(this.makeLogMessage('[db]', this.trailId(), message), data);
    }
    warning(message, data) {
        this.logger.error(this.makeLogMessage('[?] ', this.trailId(), message), data);
    }
    error(message, data) {
        this.logger.error(this.makeLogMessage('[!] ', this.trailId(), message), data);
    }
}
exports.default = Logger;
;
//# sourceMappingURL=logger.js.map