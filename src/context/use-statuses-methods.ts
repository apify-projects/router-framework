/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { ApiProxy, RequestContext } from '@apify-projects/router-framework/dist/common/types';
import {
    AllRouteApi,
    EpisodeReference, EpisodeRequestReference, EpisodeServerReference, MovieReference,
    MovieRequestReference, MovieServerReference, RequestReference, SeasonReference, SeasonRequestReference, StatusType, TvShowReference, TvShowRequestReference,
} from '../common/types';
import { DATA_STATUSES_KEY } from '../common/consts';
import { getDataModelPaths } from '../data-models';

export default (_: RequestContext, api: Partial<ApiProxy & AllRouteApi>) => {

    const makeStatusMethods = <ReferenceType>(name: string) => {

        const makeMethods = (pathKey: string) => {
            const paths = getDataModelPaths({ name, path: DATA_STATUSES_KEY });

            return {
                setStatus(ref: Partial<ReferenceType>, status: StatusType) {
                    const path = paths?.[pathKey]?.(api, ref);
                    api.store.statuses.set(path, status || { done: false });
                    return path;
                },
                hasStatus(ref: Partial<ReferenceType>) {
                    const path = paths?.[pathKey]?.(api, ref);
                    return api.store.statuses.has(path);
                },
                getAll(ref?: Partial<ReferenceType>): Record<string, StatusType> {
                    const path = paths?.[pathKey]?.(api, ref);
                    return api.store.statuses.get(path) || {};
                },
                haveBeenCompleted(ref?: Partial<ReferenceType>) {
                    return Object.values(this.getAll(ref)).every((status) => status.success);
                },
            };
        };

    };

    return {
        requests: makeStatusMethods<RequestReference>(FRAGMENTS_KEYS.REQUEST.ITEMS),

        makeStatusMethods,
    };
};
