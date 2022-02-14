import { HookAvailableNames, RouteHandlerOptions, RouterHandlerDefaultMethods } from './common/types';
import GenericHandler from './generic-handler';

export default class Hook<Methods = RouterHandlerDefaultMethods, AllowedNames = HookAvailableNames> extends GenericHandler<Methods, AllowedNames> {
    constructor(options: RouteHandlerOptions<Methods, AllowedNames>) {
        super({ ...options, key: 'hook' });
    }
}
