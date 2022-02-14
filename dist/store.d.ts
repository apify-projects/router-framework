import Logger from './logger';
import { StoreOptions } from './common/types';
export default class Store {
    name: string;
    id: string;
    kvKey: string;
    initialized: boolean;
    storage: Record<string, any>;
    log: Logger;
    constructor(options: StoreOptions);
    _wrapStorage(storage: Record<string, any>): Record<string, any>;
    read(): Record<string, any>;
    get(key: string): any;
    set(key: string, data: any): void;
    add(key: string, nb: number): void;
    subtract(key: string, nb: number): void;
    push(key: string, data: any): void;
    setAndGetKey(data: any): string;
    update(key: string, data: any): void;
    init(): Promise<void>;
    persist(): Promise<void>;
}
//# sourceMappingURL=store.d.ts.map