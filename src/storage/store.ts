/* eslint-disable @typescript-eslint/no-explicit-any */
import Apify from 'apify';
import setByKey from 'lodash.set';
import getByKey from 'lodash.get';
import hasByPath from 'lodash.has';
import cloneDeep from 'lodash.clonedeep';
import mergeWith from 'lodash.mergewith';
import { craftUIDKey } from '../common/utils';
import Logger from '../logger';
import { StoreOptions } from '../common/types';

export default class Store {
    name: string;
    id: string;
    kvKey: string;

    initialized: boolean;
    storage: Record<string, any>;

    log: Logger;

    constructor(options: StoreOptions) {
        const { name, kvKey, key = 'store' } = options || {};

        this.name = name;
        this.id = `${key}-${name}${kvKey ? `-${kvKey}` : ''}`;
        this.kvKey = kvKey || `${key}-${name}`;

        this.initialized = false;
        this.storage = this._wrapStorage({});

        this.log = new Logger(this);
    }

    _wrapStorage(storage: Record<string, any>) {
        return storage;
    }

    read() {
        return this._wrapStorage(cloneDeep(this.storage));
    }

    get(key: string): any {
        return cloneDeep(getByKey(this.storage, key)) as any;
    }

    set(key: string, data: any) {
        setByKey(this.storage, key, data);
    }

    has(path: string) {
        return hasByPath(this.storage, path);
    }

    add(key: string, nb: number) {
        this.set(key, +(this.get(key) || 0) + nb);
    }

    subtract(key: string, nb: number) {
        this.set(key, +(this.get(key) || 0) - nb);
    }

    pop(key: string) {
        const items = this.get(key) || [];
        const item = items.pop();
        this.set(key, items);
        return item;
    }

    shift(key: string) {
        const items = this.get(key) || [];
        const item = items.shift();
        this.set(key, items);
        return item;
    }

    push(key: string, data: any) {
        this.set(key, [...(this.get(key) || []), data]);
    }

    setAndGetKey(data: any) {
        const key = craftUIDKey();
        this.set(key, data);
        return key;
    }

    update(key: string, data: any, merger: (oldData: any, newData: any) => any = () => undefined) {
        this.set(key,
            mergeWith(
                this.get(key) || {},
                data || {},
                merger,
            ),
        );
    }

    async init() {
        if (!this.initialized) {
            this.log.info('Initializing...');
            this.initialized = true;
            const data = await Apify.getValue(this.kvKey) || {} as any;
            this.storage = this._wrapStorage(data);
        }
    }

    async persist() {
        this.log.info('Persisting...');
        await Apify.setValue(this.kvKey, this.storage);
    }
}
