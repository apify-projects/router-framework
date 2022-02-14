import { RouteHandlerOptions, RouterHandlerDefaultMethods } from '../common/types';
import Route from '../route';

// eslint-disable-next-line max-len
export default function defineRoute<Methods = RouterHandlerDefaultMethods, AllowedNames = string>(options: RouteHandlerOptions<Methods, AllowedNames>) {
    return new Route<Methods, AllowedNames>(options);
}
