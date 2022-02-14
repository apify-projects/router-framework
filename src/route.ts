import { RouteHandlerOptions, RouterHandlerDefaultMethods } from './common/types';
import GenericHandler from './generic-handler';

// eslint-disable-next-line max-len
export default class Route<Methods = RouterHandlerDefaultMethods, AllowedNames = string> extends GenericHandler<Methods, AllowedNames> {
    constructor(options: RouteHandlerOptions<Methods, AllowedNames>) {
        super({ ...options, key: 'route' });
    }
}
