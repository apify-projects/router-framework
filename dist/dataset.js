"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const apify_1 = (0, tslib_1.__importDefault)(require("apify"));
const debounce_async_1 = (0, tslib_1.__importDefault)(require("debounce-async"));
const logger_1 = (0, tslib_1.__importDefault)(require("./logger"));
class Dataset {
    id;
    name;
    dataset;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debouncers;
    log;
    constructor(name) {
        this.id = `dataset-${name || 'default'}`;
        this.name = name;
        this.dataset = undefined;
        this.debouncers = {};
        this.log = new logger_1.default(this);
    }
    async init() {
        if (!this.dataset) {
            this.dataset = await apify_1.default.openDataset(this.name);
        }
    }
    async push(data) {
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
    async pushOnce(uniqueId, data) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        if (!(uniqueId in this.debouncers)) {
            this.debouncers[uniqueId] = (0, debounce_async_1.default)(async () => self.push(data), 300);
        }
        await this.debouncers[uniqueId](data);
    }
}
exports.default = Dataset;
//# sourceMappingURL=dataset.js.map