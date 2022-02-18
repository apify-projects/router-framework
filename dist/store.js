"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const apify_1 = (0, tslib_1.__importDefault)(require("apify"));
const lodash_set_1 = (0, tslib_1.__importDefault)(require("lodash.set"));
const lodash_get_1 = (0, tslib_1.__importDefault)(require("lodash.get"));
const lodash_has_1 = (0, tslib_1.__importDefault)(require("lodash.has"));
const lodash_clonedeep_1 = (0, tslib_1.__importDefault)(require("lodash.clonedeep"));
const utils_1 = require("./common/utils");
const logger_1 = (0, tslib_1.__importDefault)(require("./logger"));
class Store {
    name;
    id;
    kvKey;
    initialized;
    storage;
    log;
    constructor(options) {
        const { name, kvKey, key = 'store' } = options || {};
        this.name = name;
        this.id = `${key}-${name}${kvKey ? `-${kvKey}` : ''}`;
        this.kvKey = kvKey || `${key}-${name}`;
        this.initialized = false;
        this.storage = this._wrapStorage({});
        this.log = new logger_1.default(this);
    }
    _wrapStorage(storage) {
        return storage;
    }
    read() {
        return this._wrapStorage((0, lodash_clonedeep_1.default)(this.storage));
    }
    get(key) {
        return (0, lodash_clonedeep_1.default)((0, lodash_get_1.default)(this.storage, key));
    }
    set(key, data) {
        (0, lodash_set_1.default)(this.storage, key, data);
    }
    has(path) {
        return (0, lodash_has_1.default)(this.storage, path);
    }
    add(key, nb) {
        this.set(key, +(this.get(key) || 0) + nb);
    }
    subtract(key, nb) {
        this.set(key, +(this.get(key) || 0) - nb);
    }
    push(key, data) {
        this.set(key, [...(this.get(key) || []), data]);
    }
    setAndGetKey(data) {
        const key = (0, utils_1.craftUIDKey)();
        this.set(key, data);
        return key;
    }
    update(key, data) {
        this.set(key, { ...(this.get(key) || {}), ...data });
    }
    async init() {
        if (!this.initialized) {
            this.log.info('Initializing...');
            this.initialized = true;
            const data = await apify_1.default.getValue(this.kvKey) || {};
            this.storage = this._wrapStorage(data);
        }
    }
    async persist() {
        this.log.info('Persisting...');
        await apify_1.default.setValue(this.kvKey, this.storage);
    }
}
exports.default = Store;
//# sourceMappingURL=store.js.map