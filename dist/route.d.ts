import { RouteHandlerOptions, RouterHandlerDefaultMethods } from './common/types';
import GenericHandler from './generic-handler';
export default class Route<Methods = RouterHandlerDefaultMethods, AllowedNames = string> extends GenericHandler<Methods, AllowedNames> {
    constructor(options: RouteHandlerOptions<Methods, AllowedNames>);
}
//# sourceMappingURL=route.d.ts.map