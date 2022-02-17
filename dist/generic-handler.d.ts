import { ApiProxy, GenericHandlerOptionsHandler, RequestContext, RouteHandlerOptions, RouterData, RouterHandlerDefaultMethods } from './common/types';
import Dataset from './dataset';
import Logger from './logger';
import Queue from './queue';
import Router from './router';
import { StoresList } from './stores';
declare class GenericHandler<Methods = RouterHandlerDefaultMethods, AllowedNames = string> {
    uid: string;
    name: AllowedNames;
    id: string;
    handler: GenericHandlerOptionsHandler<Methods>;
    controlHandler: GenericHandlerOptionsHandler<Methods>;
    failHandler: GenericHandlerOptionsHandler<Methods>;
    extendApi: (context: RequestContext, api: Partial<ApiProxy & Methods>) => Partial<Methods>;
    dataset: Dataset;
    queue: Queue;
    router: Router;
    log: Logger;
    constructor(options: RouteHandlerOptions<Methods, AllowedNames>);
    _initialize(): Promise<void>;
    attachRouter(router: Router): void;
    get store(): StoresList;
    makeApi(context: RequestContext, routerData?: RouterData): Partial<ApiProxy & Methods>;
    run(context: RequestContext, routerData?: RouterData): Promise<void>;
}
export default GenericHandler;
//# sourceMappingURL=generic-handler.d.ts.map