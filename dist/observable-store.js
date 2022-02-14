"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const observable_slim_1 = (0, tslib_1.__importDefault)(require("observable-slim"));
const events_1 = (0, tslib_1.__importDefault)(require("events"));
const lodash_get_1 = (0, tslib_1.__importDefault)(require("lodash.get"));
const store_1 = (0, tslib_1.__importDefault)(require("./store"));
const utils_1 = require("./common/utils");
class ObservableStore extends store_1.default {
    _watchersKeyByPath;
    _watchingByKey;
    _events;
    constructor(options) {
        super({ ...options, key: 'observable-store' });
        this._watchersKeyByPath = {};
        this._watchingByKey = {};
        this._events = new events_1.default();
    }
    _wrapStorage(storage) {
        return observable_slim_1.default.create(storage, false, (changes) => {
            const watchersPaths = Object.keys(this._watchersKeyByPath);
            const pathsToFire = new Set();
            for (const change of changes) {
                for (const watcherPath of watchersPaths) {
                    if (change.currentPath.startsWith(watcherPath)) {
                        pathsToFire.add(watcherPath);
                    }
                }
            }
            for (const path of pathsToFire) {
                const currentValue = (0, lodash_get_1.default)(storage, path);
                for (const watcherKey of this._watchersKeyByPath[path]) {
                    this._events.emit(watcherKey, currentValue);
                }
            }
        });
    }
    watch(path, watcher) {
        const watcherKey = (0, utils_1.craftUID)();
        this._watchingByKey[watcherKey] = new Promise((resolve) => {
            this._events.on(watcherKey, async (currentValue) => {
                await Promise.resolve(watcher(currentValue, resolve));
            });
        });
        this._watchersKeyByPath[path] = [...(this._watchersKeyByPath[path] || []), watcherKey];
    }
    /**
     * Waiting to finnish all current async operations
     */
    async closing() {
        return Promise.allSettled(Object.values(this._watchingByKey));
    }
}
exports.default = ObservableStore;
//# sourceMappingURL=observable-store.js.map