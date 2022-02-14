/// <reference types="node" />
import type Apify from 'apify';
export declare enum STORE {
    STATE = "GS_STATE",
    STATS = "GS_STATS"
}
export declare enum HOOK {
    START = "START",
    SOURCES = "SOURCES",
    END = "END",
    BEFORE_EACH = "BEFORE_EACH",
    AFTER_EACH = "AFTER_EACH"
}
export declare enum CRAWLER {
    BASIC = "BASIC",
    CHEERIO = "CHEERIO",
    PUPPETEER = "PUPPETEER",
    PLAYWRIGHT = "PLAYWRIGHT"
}
export declare type UnknownValue = string | {
    [x: string]: unknown;
} | Buffer;
export declare type UnknownObject = {
    [key: string]: UnknownObject | unknown;
};
export declare type UnknownInstance = {
    [id: string]: string;
};
export declare type UnknownFunction = (...params: []) => unknown;
export declare type RequestSource = import('apify').Request | import('apify').RequestOptions;
export declare type RequestOptions = {
    forefront?: boolean | undefined;
} | undefined;
export declare type RequestContext = Apify.CrawlingContext & {
    page: import('puppeteer').Page;
    request: import('apify').Request;
};
export declare type RouterData = {
    input?: Record<string, any>;
};
export declare type ApiProxy = {
    store: import('../stores').StoresList;
    dataset: import('../dataset').default;
    queue: import('../queue').default;
    router: import('../router').default;
    resource: {
        uid: string;
        name: string;
        id: string;
    };
    getInput: () => any;
    trail: {
        addToRequest: (request: RequestSource) => RequestSource;
        getId: () => string;
        getState: () => any;
        setState: (state: any) => void;
    };
    log: import('../logger').default;
    absoluteUrl(path: string): string | void;
};
export declare type OmitGloblalApi<T> = Omit<T, 'store' | 'router' | 'dataset' | 'queue' | 'trail'>;
export declare type GenericHandlerOptionsHandler<Methods = RouterHandlerDefaultMethods, Api = ApiProxy & Methods> = (context: RequestContext, api: Api) => Promise<void>;
export declare type GenericHandlerOptionsHandlerLimited<Methods = RouterHandlerDefaultMethods> = GenericHandlerOptionsHandler<Methods, OmitGloblalApi<ApiProxy & Methods>>;
export declare type HookAvailableNames = 'ROUTE_STARTED' | 'ROUTE_ENDED' | 'ROUTE_FAILED' | 'ROUTER_STARTED' | 'ROUTER_ENDED' | 'QUEUE_STARTED' | 'QUEUE_ENDED';
export declare type RouterHandlerDefaultMethods = {
    [methodName: string]: any;
};
export declare type RouteHandlerOptions<Methods = RouterHandlerDefaultMethods, AllowedNames = string> = {
    key?: string;
    name: AllowedNames;
    handler?: GenericHandlerOptionsHandler<Methods>;
    controlHandler?: GenericHandlerOptionsHandler<Methods>;
    failHandler?: GenericHandlerOptionsHandler<Methods>;
    extendApi?: (context: RequestContext, api: ApiProxy) => Methods;
};
export declare type StoreOptions = {
    name: string;
    kvKey?: string;
    key?: string;
};
export declare type ValidateResult<Data> = {
    data: Data;
    valid: boolean;
    errors?: UnknownObject[];
};
export declare type DataSanitizeFn<Inputdata, OutputData> = (rawData: Inputdata) => OutputData;
export declare type DataValidateFn<Data> = (sanitizedData: Data) => ValidateResult<Data>;
export declare type DataValidatorOptions<Inputdata, OutputData> = {
    key?: string;
    name?: string;
    sanitize?: DataSanitizeFn<Inputdata, OutputData>;
    validate?: DataValidateFn<OutputData>;
};
export declare type HOOK_ROUTE_STARTED_OUTPUT = {
    stop?: boolean;
} | undefined;
export declare type CrawlerType = (options: UnknownObject) => {
    run: () => Promise<void>;
};
export declare type QueueStartedApiMethods = {
    addRequest: (routeName: string, query: any, request: RequestSource) => void;
};
export declare type ResolverFn<T = undefined> = (value?: T) => void;
export declare type WatcherFunction = (currentValue: any, resolve: ResolverFn) => void;
//# sourceMappingURL=types.d.ts.map