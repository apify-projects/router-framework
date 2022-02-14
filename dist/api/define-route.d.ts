import { RouteHandlerOptions, RouterHandlerDefaultMethods } from '../common/types';
import Route from '../route';
export default function defineRoute<Methods = RouterHandlerDefaultMethods, AllowedNames = string>(options: RouteHandlerOptions<Methods, AllowedNames>): Route<Methods, AllowedNames>;
//# sourceMappingURL=define-route.d.ts.map