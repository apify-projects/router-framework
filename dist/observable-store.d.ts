import { StoreOptions, WatcherFunction } from './common/types';
import Store from './store';
export default class ObservableStore extends Store {
    private _watchersKeyByPath;
    private _watchingByKey;
    private _events;
    constructor(options: StoreOptions);
    _wrapStorage(storage: Record<string, any>): Record<string, any>;
    watch(path: string, watcher: WatcherFunction): void;
    /**
     * Waiting to finnish all current async operations
     */
    closing(): Promise<PromiseSettledResult<void>[]>;
}
//# sourceMappingURL=observable-store.d.ts.map