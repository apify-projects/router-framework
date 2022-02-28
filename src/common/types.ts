/* eslint-disable @typescript-eslint/no-explicit-any */

import type Apify from 'apify';
import { QueueOperationInfo } from 'apify';

/* eslint-disable max-len */
export enum STORE {
    STATE = 'GS_STATE',
    STATS = 'GS_STATS',
}

export enum HOOK {
    START = 'START',
    SOURCES = 'SOURCES',
    END = 'END',
    BEFORE_EACH = 'BEFORE_EACH',
    AFTER_EACH = 'AFTER_EACH'
}

export enum CRAWLER {
    BASIC = 'BASIC',
    CHEERIO = 'CHEERIO',
    PUPPETEER = 'PUPPETEER',
    PLAYWRIGHT = 'PLAYWRIGHT',
}

export type UnknownValue = string | { [x: string]: unknown } | Buffer;

export type UnknownObject = {
    [key: string]: UnknownObject | unknown;
}

export type UnknownInstance = {
    [id: string]: string
}

export type UnknownFunction = (...params: []) => unknown

export type RequestSource = import('apify').Request | import('apify').RequestOptions
export type RequestOptions = { forefront?: boolean | undefined } | undefined

export type RequestContext = Apify.CheerioHandlePageInputs & Apify.PlaywrightHandlePageFunctionParam & Apify.BrowserCrawlingContext & Apify.CrawlingContext

// generic-handler.ts

export type RouterData = {
    input?: Record<string, any>;
}

export type ApiProxy = {
    store: import('../stores').StoresList,
    dataset: import('../dataset').default,
    queue: import('../queue').default,
    router: import('../router').default,
    resource: {
        uid: string,
        name: string,
        id: string
    },
    getInput: () => any,
    trail: {
        addToRequest: (request: RequestSource) => RequestSource,
        getId: () => string,
        getState: () => any,
        setState: (state: any) => void,
    },
    log: import('../logger').default,
    absoluteUrl(path: string): string | void,
    addEntryRequest: (routeName: string, query: any, request: RequestSource) => Promise<QueueOperationInfo[]>;
}

export type OmitGloblalApi<T> = Omit<T, 'store' | 'router' | 'dataset' | 'queue' | 'trail'>;

export type GenericHandlerOptionsHandler<Methods = RouterHandlerDefaultMethods, Api = ApiProxy & Methods> = (context: RequestContext, api: Partial<Api>) => Promise<void>

export type GenericHandlerOptionsHandlerLimited<Methods = RouterHandlerDefaultMethods> = GenericHandlerOptionsHandler<Methods, OmitGloblalApi<ApiProxy & Methods>>

export type HookAvailableNames = 'ROUTE_STARTED' | 'ROUTE_ENDED' | 'ROUTE_FAILED' | 'ROUTER_STARTED' | 'ROUTER_ENDED' | 'QUEUE_STARTED' | 'QUEUE_ENDED'

export type RouterHandlerDefaultMethods = {
    // [methodName: string]: any
    empty?: () => void;
}

export type RouteHandlerOptions<Methods = RouterHandlerDefaultMethods, AllowedNames = string> = {
    key?: string,
    name: AllowedNames,
    handler?: GenericHandlerOptionsHandler<Methods>,
    controlHandler?: GenericHandlerOptionsHandler<Methods>,
    failHandler?: GenericHandlerOptionsHandler<Methods>,
    extendApi?: (context: RequestContext, api: Partial<ApiProxy & Methods>) => Partial<Methods>
}

export type StoreOptions = {
    name: string,
    kvKey?: string,
    key?: string,
}

export type ValidateResult<Data> = {
    data: Data,
    valid: boolean,
    errors?: UnknownObject[],
}

// data-validator.ts

export type DataSanitizeFn<Inputdata, OutputData> = (rawData: Inputdata) => OutputData;
export type DataValidateFn<Data> = (sanitizedData: Data) => ValidateResult<Data>;

export type DataValidatorOptions<Inputdata, OutputData> = {
    key?: string,
    name?: string,
    sanitize?: DataSanitizeFn<Inputdata, OutputData>;
    validate?: DataValidateFn<OutputData>;
}

export type HOOK_ROUTE_STARTED_OUTPUT = { stop?: boolean } | undefined;

// router.ts

export type CrawlerType = (options: UnknownObject) => Promise<{ run: () => Promise<void> }>;

// hooks.ts

// observable-store.ts

export type ResolverFn<T = undefined> = (value?: T) => void;

export type WatcherFunction = (currentValue: any, resolve: ResolverFn) => void
