import Store from './store';
import ObservableStore from './observable-store';
import Logger from './logger';
export declare type StoresList = {
    state?: Store;
    trails?: Store;
    handlers?: Store;
    statuses?: ObservableStore;
    [storeName: string]: Store;
};
export declare const storage: StoresList;
declare const _default: {
    id: string;
    log: Logger;
    add(store: Store): void;
    get(): StoresList;
    init(): Promise<void>;
    /**
     * Waiting to finnish all current async operations
     */
    closing(): Promise<PromiseSettledResult<PromiseSettledResult<void>[]>[]>;
    persist(): Promise<unknown>;
};
export default _default;
//# sourceMappingURL=stores.d.ts.map