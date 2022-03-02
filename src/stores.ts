/* eslint-disable no-underscore-dangle */
import Apify from 'apify';
import Store from './store';
import FileStore from './file-store';
import ObservableStore from './observable-store';
import Logger from './logger';

export type AnyStore = Store | FileStore
export type StoresList = {
    state?: Store,
    trails?: Store,
    handlers?: Store,
    statuses?: ObservableStore,
    incorrectDataset?: ObservableStore,
    responseBodies?: FileStore,
    browserTraces?: FileStore,
    [storeName: string]: AnyStore
};

// Stores are declared globally
// Can be initialized only once
let initialized = false;
export const storage: StoresList = {};

export default {
    id: 'stores',
    log: new Logger({ id: 'stores' }),

    add(store: Store | FileStore) {
        storage[store.name] = store;
    },

    get(): StoresList {
        return storage;
    },

    async init() {
        if (!initialized) {
            // Set up a default state store
            this.add(new Store({ name: 'state' }));
            this.add(new Store({ name: 'trails' }));
            this.add(new Store({ name: 'statuses' }));
            this.add(new Store({ name: 'incorrectDataset' }));
            this.add(new FileStore({ name: 'responseBodies' }));
            this.add(new FileStore({ name: 'browserTraces' }));

            await Promise.allSettled(Object.values(storage).map((store) => store.init()));

            Apify.events.on('migrating', async () => {
                this.log.info('Migrating: Persisting stores...');
                await this.persist();
            });

            Apify.events.on('aborting', async () => {
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
            return Promise.allSettled(
                Object.values(storage)
                    .filter((store) => store instanceof ObservableStore)
                    .map(async (store) => (store as ObservableStore).closing()),
            ).then(resolve);
        });
    },

    async persist() {
        return Promise.allSettled(Object.values(storage).map((store) => Promise.resolve('persist' in store ? store.persist() : undefined)));
    },
};
