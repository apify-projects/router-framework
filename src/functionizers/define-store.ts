import Store from '../storage/store';
import { StoreOptions } from '../common/types';

export default function defineStore(options: StoreOptions) {
    return new Store(options);
}
