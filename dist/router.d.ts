import { ApiProxy, CrawlerType, RequestContext, RouterData, RouterHandlerDefaultMethods } from './common/types';
import DataValidator from './data-validator';
import Hook from './hook';
import Logger from './logger';
import Route from './route';
import Store from './store';
export declare type RouterOptions<Methods = RouterHandlerDefaultMethods> = {
    key?: string;
    inputValidator?: DataValidator;
    routes?: Route<any, any>[];
    hooks?: Hook<any, any>[];
    stores?: Store[];
    crawler?: CrawlerType;
    extendRouteApi?: (context: RequestContext, api: ApiProxy) => Methods;
};
export default class Router<Methods = RouterHandlerDefaultMethods> {
    id: string;
    inputValidator: DataValidator;
    routes: {
        [routeName: string]: Route<any, any>;
    };
    hooks: {
        [hookName: string]: Hook<any, any>;
    };
    crawler: CrawlerType;
    extendRouteApi: (context: RequestContext, api: ApiProxy) => Methods;
    log: Logger;
    constructor(options: RouterOptions<Methods>);
    setInputValidator(validator: DataValidator<any, any>): void;
    setExtendRouteApi(extendApi: (context: RequestContext, api: ApiProxy) => Methods): void;
    setRoute(route: Route<any, any>): void;
    setRoutes(routes?: Route<any, any>[]): void;
    setHook(hook: Hook<any, any>): void;
    setHooks(hooks?: Hook<any, any>[]): void;
    setStore(store: Store): void;
    setStores(stores?: Store[]): void;
    setCrawler(crawler: CrawlerType): void;
    _runHook(hookName: string, context: RequestContext, routerData: RouterData): Promise<void>;
    getRoute(routeName: string): Route<any, any>;
    run(inputRaw: any): Promise<void>;
}
//# sourceMappingURL=router.d.ts.map