import Apify from 'apify';
import debounce from 'debounce-async';
import Logger from './logger';
import { UnknownObject } from './common/types';

export default class Dataset {
    id: string;
    name: string;
    dataset: Apify.Dataset;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debouncers: Record<string, any>;
    log: Logger;

    constructor(name?: string) {
        this.id = `dataset-${name || 'default'}`;
        this.name = name;
        this.dataset = undefined;
        this.debouncers = {};
        this.log = new Logger(this);
    }

    async init() {
        if (!this.dataset) {
            this.dataset = await Apify.openDataset(this.name);
        }
    }

    async push(data: UnknownObject | UnknownObject[]) {
        await this.init();

        const list = Array.isArray(data) ? data : [data];

        if (list.length === 0) {
            this.log.error(`No data to be pushed to dataset`);
            return;
        }

        return this.dataset.pushData(data);
    }

    /**
     * Makes sure in case of racing conditions that the data is pushed only once
     * against a uniqueId (which may be the trailId)
     * @param uniqueId
     * @param data
     */
    async pushOnce(uniqueId: string, data: UnknownObject | UnknownObject[]) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;

        if (!(uniqueId in this.debouncers)) {
            this.debouncers[uniqueId] = debounce(async () => self.push(data), 300);
        }

        await this.debouncers[uniqueId](data);
    }
}
