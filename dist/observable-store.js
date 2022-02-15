"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const observable_slim_1 = (0, tslib_1.__importDefault)(require("observable-slim"));
const events_1 = (0, tslib_1.__importDefault)(require("events"));
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
            const pathsToFire = new Map();
            for (const change of changes) {
                for (const watcherPath of watchersPaths) {
                    if (change.currentPath.split('.').slice(0, -1).join('.') === watcherPath) {
                        pathsToFire.set(watcherPath, change.proxy);
                    }
                }
            }
            for (const [path, currentValue] of pathsToFire.entries()) {
                for (const watcherKey of this._watchersKeyByPath[path]) {
                    this._events.emit(watcherKey, currentValue);
                }
            }
        });
    }
    watch(path, watcher) {
        const watcherKey = (0, utils_1.craftUID)();
        this._watchingByKey[watcherKey] = new Promise((resolve) => {
            this._events.on(watcherKey, (currentValue) => {
                watcher(currentValue, resolve);
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