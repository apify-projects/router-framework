/* eslint-disable @typescript-eslint/no-explicit-any */
import ObservableSlim from 'observable-slim';
import EventEmitter from 'events';
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
            const pathsToFire = new Map<string, any>();

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

    watch(path: string, watcher: WatcherFunction) {
        const watcherKey = craftUID();
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
