/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { ApiProxy } from '@apify-projects/router-framework/dist/common/types';
import { RequestReference } from '../common/types';
import { DATA_STATUSES_KEY, INPUT_DATA_KEY, OUTPUT_DATA_KEY } from './common/consts';
import { DataModelPathsOptions } from './common/types';
import { pathify } from './common/utils';

const getDataModelFragmentNames = (name: string) => {
    return {
        ITEMS: `${name}S`,
        ITEMS_REFERENCES: `${name}S_REFERENCES`,
        REQUESTS: `${name}_REQUESTS`,
        LISTING_REQUESTS: `${name}S_LISTING_REQUESTS`,
    };
};

export const getDataModelPaths = <ReferenceType>(options: DataModelPathsOptions) => {
    const { name, path, referenceKey } = options;
    const names = getDataModelFragmentNames(name);

    return {
        [names.ITEMS]: (api: Partial<ApiProxy>, reference: Partial<ReferenceType>) => pathify(api.trail.getId() || 'default', path, names.ITEMS.toLowerCase(), reference?.[referenceKey]),
        [names.ITEMS_REFERENCES]: (api: Partial<ApiProxy>, reference?: Partial<ReferenceType>) => pathify(api.trail.getId() || 'default', path, names.ITEMS_REFERENCES.toLowerCase(), reference?.[referenceKey]),
        [names.REQUESTS]: (api: Partial<ApiProxy>, reference?: Partial<ReferenceType>) => pathify(api.trail.getId() || 'default', path, names.REQUESTS.toLowerCase(), reference?.[referenceKey]),
        [names.LISTING_REQUESTS]: (api: Partial<ApiProxy>, reference?: Partial<RequestReference>) => pathify(api.trail.getId() || 'default', path, names.LISTING_REQUESTS.toLowerCase(), reference?.requestKey),
        get ITEMS() { return this[names.ITEMS]; },
        get ITEMS_REFERENCES() { return this[names.ITEMS_REFERENCES]; },
        get REQUESTS() { return this[names.REQUESTS]; },
        get LISTING_REQUESTS() { return this[names.LISTING_REQUESTS]; },
    };
};

export const getStatePaths = <DataModelReferences>(dataModels: Record<keyof DataModelReferences, string>) => {
    const defaultDataModels = {
        request: 'requestKey',
    };

    const allDataModels = {
        ...defaultDataModels,
        ...dataModels,
    };

    return {
        [DATA_STATUSES_KEY]: Object.keys(allDataModels).reduce((acc, name) => {
            return {
                ...acc,
                [name]: getDataModelPaths({ name, path: DATA_STATUSES_KEY, referenceKey: allDataModels[name] }),
            };
        }, {}),

        [INPUT_DATA_KEY]: Object.keys(allDataModels).reduce((acc, name) => {
            return {
                ...acc,
                [name]: getDataModelPaths({ name, path: INPUT_DATA_KEY, referenceKey: allDataModels[name] }),
            };
        }, {}),

        [OUTPUT_DATA_KEY]: Object.keys(allDataModels).reduce((acc, name) => {
            return {
                ...acc,
                [name]: getDataModelPaths({ name, path: OUTPUT_DATA_KEY, referenceKey: allDataModels[name] }),
            };
        }, {}),
    };
};
