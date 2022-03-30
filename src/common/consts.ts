const UID_KEY_PREFIX = 'uk_';

const CRAWLER = {
    BASIC: 'BASIC',
    CHEERIO: 'CHEERIO',
    PUPPETEER: 'PUPPETEER',
    PLAYWRIGHT: 'PLAYWRIGHT',
};

const HOOK = {
    ROUTE_STARTED: 'ROUTE_STARTED',
    ROUTE_ENDED: 'ROUTE_ENDED',
    ROUTE_FAILED: 'ROUTE_FAILED',

    ROUTER_STARTED: 'ROUTER_STARTED',
    ROUTER_ENDED: 'ROUTER_ENDED',

    QUEUE_STARTED: 'QUEUE_STARTED',
    QUEUE_ENDED: 'QUEUE_ENDED',
};

export const INPUT_DATA_KEY = 'input';
export const OUTPUT_DATA_KEY = 'output';
export const DATA_STATUSES_KEY = 'statuses';

const WAIT_FOR_ELEMENT_TIMEOUT = 10000;

export {
    UID_KEY_PREFIX,
    CRAWLER,
    HOOK,
    WAIT_FOR_ELEMENT_TIMEOUT,
};