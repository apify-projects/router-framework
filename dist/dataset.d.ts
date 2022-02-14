import Apify from 'apify';
import Logger from './logger';
import { UnknownObject } from './common/types';
export default class Dataset {
    id: string;
    name: string;
    dataset: Apify.Dataset;
    debouncers: Record<string, any>;
    log: Logger;
    constructor(name?: string);
    init(): Promise<void>;
    push(data: UnknownObject | UnknownObject[]): Promise<void>;
    /**
     * Makes sure in case of racing conditions that the data is pushed only once
     * against a uniqueId (which may be the trailId)
     * @param uniqueId
     * @param data
     */
    pushOnce(uniqueId: string, data: UnknownObject | UnknownObject[]): Promise<void>;
}
//# sourceMappingURL=dataset.d.ts.map