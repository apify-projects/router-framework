/* eslint-disable max-len */
import Hook from '../hook';
import { HookAvailableNames, RouteHandlerOptions, RouterHandlerDefaultMethods } from '../common/types';

export default function defineHook<Methods = RouterHandlerDefaultMethods>(options: RouteHandlerOptions<Methods, HookAvailableNames>) {
    return new Hook<Methods, HookAvailableNames>(options);
}
