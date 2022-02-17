"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const tslib_1 = require("tslib");
/* eslint-disable no-underscore-dangle */
const apify_1 = (0, tslib_1.__importDefault)(require("apify"));
const store_1 = (0, tslib_1.__importDefault)(require("./store"));
const observable_store_1 = (0, tslib_1.__importDefault)(require("./observable-store"));
const logger_1 = (0, tslib_1.__importDefault)(require("./logger"));
// Stores are declared globally
// Can be initialized only once
let initialized = false;
exports.storage = {};
exports.default = {
    id: 'stores',
    log: new logger_1.default({ id: 'stores' }),
    add(store) {
        exports.storage[store.name] = store;
    },
    get() {
        return exports.storage;
    },
    async init() {
        if (!initialized) {
            // Set up a default state store
            this.add(new store_1.default({ name: 'state' }));
            this.add(new store_1.default({ name: 'trails' }));
            this.add(new store_1.default({ name: 'handlers' }));
            this.add(new observable_store_1.default({ name: 'statuses' }));
            await Promise.allSettled(Object.values(exports.storage).map((store) => store.init()));
            apify_1.default.events.on('migrating', async () => {
                this.log.info('Migrating: Persisting stores...');
                await this.persist();
            });
            apify_1.default.events.on('aborting', async () => {
                this.log.info('Aborting: Persisting stores...');
                await this.persist();
            });
            initialized = true;
        }
    },
    /**
     * Waiting to finnish all current async operations
     */
    async closing() {
        return new Promise((resolve) => {
            // Resolve in 10s max (if mishandled watchers are not resolved)
            setTimeout(resolve, 10000);
            // Or resolve the watchers
            return Promise.allSettled(Object.values(exports.storage)
                .filter((store) => store instanceof observable_store_1.default)
                .map(async (store) => store.closing())).then(resolve);
        });
    },
    async persist() {
        return Promise.allSettled(Object.values(exports.storage).map((store) => store.persist()));
    },
};
//# sourceMappingURL=stores.js.map