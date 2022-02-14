/* eslint-disable @typescript-eslint/no-explicit-any */
import ObservableSlim from 'observable-slim';
import EventEmitter from 'events';
import getByKey from 'lodash.get';
import { StoreOptions, WatcherFunction } from './common/types';
import Store from './store';
import { craftUID } from './common/utils';

export default class ObservableStore extends Store {
    private _watchersKeyByPath: Record<string, string[]>;
    private _watchingByKey: Record<string, Promise<void>>;
    private _events: EventEmitter;

    constructor(options: StoreOptions) {
        super({ ...options, key: 'observable-store' });
        this._watchersKeyByPath = {};
        this._watchingByKey = {};
        this._events = new EventEmitter();
    }

    override _wrapStorage(storage: Record<string, any>): Record<string, any> {
        return ObservableSlim.create(storage, false, (changes: any[]) => {
            const watchersPaths = Object.keys(this._watchersKeyByPath);
            const pathsToFire = new Set<string>();

            for (const change of changes) {
                for (const watcherPath of watchersPaths) {
                    if (change.currentPath.startsWith(watcherPath)) {
                        pathsToFire.add(watcherPath);
                    }
                }
            }

            for (const path of pathsToFire) {
                const currentValue = getByKey(storage, path);
                for (const watcherKey of this._watchersKeyByPath[path]) {
                    this._events.emit(watcherKey, currentValue);
                }
            }
        });
    }

    watch(path: string, watcher: WatcherFunction) {
        const watcherKey = craftUID();
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
