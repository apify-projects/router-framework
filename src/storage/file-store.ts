/* eslint-disable @typescript-eslint/no-explicit-any */
import Apify from 'apify';
import { FileStoreOptions } from '../common/types';
import Logger from '../logger';

export default class FileStore {
    name: string;
    id: string;
    kv: Apify.KeyValueStore;

    initialized: boolean;

    log: Logger;

    constructor(options: FileStoreOptions) {
        const { name, key = 'cold-store' } = options || {};

        this.name = name;
        this.id = `${key}-${name}`;
        this.initialized = false;

        this.log = new Logger(this);
    }

    async get(key: string): Promise<any> {
        return this.kv.getValue(key);
    }

    async set(key: string, value: Apify.KeyValueStoreValueTypes, options?: { contentType?: string; }) {
        return this.kv.setValue(key, value, options);
    }

    async init() {
        if (!this.initialized) {
            this.log.info('Initializing...');
            this.initialized = true;
            this.kv = await Apify.openKeyValueStore(this.name);
        }
    }
}
