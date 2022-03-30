/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import orderBy from 'lodash.orderby';
import { INPUT_DATA_KEY, OUTPUT_DATA_KEY } from '../common/consts';
import { ApiProxy, RequestContext, RequestReference, RequestSource, StateMethodsDefinition } from '../common/types';
import { concatAsUniqueArray, craftUIDKey, sortUIDKeysFromFirst, sortUIDKeysFromLast } from '../common/utils';
import { getDataModelPaths } from '../data-models';

export const defaultSortBy = (keyedResults: Record<string, any>, order = 'first') => (order === 'last' ? sortUIDKeysFromLast(Object.keys(keyedResults)) : sortUIDKeysFromFirst(Object.keys(keyedResults)));

export const defaultSortByPropNumber = (prop: string) => (keyedResults: Record<string, any>, order = 'first') => {
    const values = Object.entries(keyedResults).map(([key, value]) => ({ key, ...value }));
    const hasNumbers = values.every((item) => typeof item[prop] === 'number');
    const ordered = hasNumbers ? orderBy(values, [prop], [order === 'first' ? 'asc' : 'desc']).map(({ key }) => key) : defaultSortBy(keyedResults || {}, order);
    return ordered;
};

export default (_: RequestContext, api: Partial<ApiProxy>) => {
    return <DataReference, ParentReferenceType, ReferenceType>(definition: StateMethodsDefinition) => {
        const trailGet = api.store.trails.get.bind(api.store.trails);
        const trailUpdate = api.store.trails.update.bind(api.store.trails);

        const {
            name,
            referenceKey,
            sortBy = defaultSortBy,
            getItemKeyValues = () => ({}),
            getIdentifiersFromItem = () => [],
            updateMerger = (existingValue, newValue) => {
                if (!newValue && typeof existingValue !== 'number') return existingValue;
                if (Array.isArray(newValue)) {
                    return concatAsUniqueArray(existingValue, newValue);
                }
                return undefined;
            },
            getMaxItems = () => Infinity,
            getSortingOrder = () => 'first',
        } = definition;

        const makeMethods = (path: string) => {
            const paths = getDataModelPaths({ name, referenceKey, path });

            return {
                // paths
                getPath(ref?: ParentReferenceType | ReferenceType): string {
                    return paths.ITEMS(api, ref);
                },
                getReferencePath(ref?: ParentReferenceType | ReferenceType): string {
                    return paths.ITEMS_REFERENCES(api, ref);
                },
                getRequestPath(ref?: ParentReferenceType | ReferenceType | RequestReference): string {
                    return paths.REQUESTS(api, ref);
                },
                getListRequestPath(ref?: (ParentReferenceType | ReferenceType) | RequestReference): string {
                    return paths.LISTING_REQUESTS(api, ref);
                },
                // items
                set(partialData: Partial<DataReference>, ref?: ParentReferenceType | ReferenceType): ReferenceType {
                    // api.log.debug(`trail-state > set`, { partialData, ref });

                    const { identifiers = [] } = ref || {} as any;
                    const newIdentifiers = concatAsUniqueArray(identifiers, getIdentifiersFromItem(partialData || {}));

                    const keyValues = getItemKeyValues(partialData || {});
                    const existingItems = this.getItemsAsObject(ref);
                    const existingItemReferences = this.getItemReferencesAsObject(ref);

                    const findExistingReference = () => {
                        if (!Object.keys(keyValues).length) return {};

                        for (const key of Object.keys(existingItems)) {
                            const existingItem = existingItems[key];
                            const existingReference = existingItemReferences[key];
                            const existingIdentifiers = concatAsUniqueArray(existingReference?.identifiers, getIdentifiersFromItem(existingItem));

                            const keyValuesMatches = Object.keys(keyValues).every((k) => existingItem[k] === keyValues[k]);
                            if (keyValuesMatches) {
                                const identifiersPartialMatches = newIdentifiers.some((identifier: string) => existingIdentifiers.includes(identifier));
                                if (!newIdentifiers.length || identifiersPartialMatches) {
                                    return {
                                        ...existingReference[key],
                                        identifiers: concatAsUniqueArray(existingIdentifiers, newIdentifiers),
                                        [referenceKey]: key,
                                    };
                                }
                            }
                        }

                        return {};
                    };

                    const foundExistingReference = findExistingReference();

                    const reference = {
                        // Sets a crafted reference
                        [referenceKey]: craftUIDKey(),
                        // Overrides it with the passed reference (when it exists)
                        ...(ref || {}),
                        // Overrides it by an existing reference (when it exists)
                        ...foundExistingReference,
                    } as ReferenceType;

                    return this.update(partialData || {}, reference);
                },
                update(partialData: Partial<DataReference>, ref: ReferenceType): ReferenceType {
                    trailUpdate(this.getPath(ref), partialData || {}, updateMerger);
                    const referencePath = this.getReferencePath(ref);
                    if (referencePath) {
                        trailUpdate(referencePath, ref, updateMerger);
                    }
                    return ref;
                },
                get(ref?: ParentReferenceType | ReferenceType): DataReference {
                    return trailGet(this.getPath(ref));
                },
                getItemsAsObject(ref?: ParentReferenceType | ReferenceType) {
                    return trailGet(this.getPath(ref)) || {};
                },
                getItems(ref?: ParentReferenceType | ReferenceType): DataReference[] {
                    return Object.values(this.getItemsAsObject(ref));
                },
                getItemReferencesAsObject(ref?: ParentReferenceType | ReferenceType) {
                    return trailGet(this.getReferencePath(ref)) || {};
                },
                getItemReferences(ref?: ParentReferenceType | ReferenceType): DataReference[] {
                    return Object.values(this.getItemReferencesAsObject(ref));
                },
                // Requests
                setRequest(request: RequestSource, partialData?: Partial<DataReference>, ref?: ParentReferenceType | ReferenceType): ReferenceType & RequestReference {
                    const setRef = this.set(partialData, ref);
                    const reference = { ...setRef, ...(ref || {}) } as ReferenceType & RequestReference;
                    trailUpdate(this.getRequestPath(reference), request || {});
                    return reference;
                },
                getRequest(ref?: ParentReferenceType | ReferenceType | RequestReference) {
                    return trailGet(this.getRequestPath(ref));
                },
                getRequestItemsAsObject(ref?: ParentReferenceType | RequestReference) {
                    return trailGet(this.getRequestPath(ref)) || {};
                },
                getRequestItems(ref?: ParentReferenceType) {
                    return Object.values(this.getRequestPath(ref));
                },
                // Listing Requests
                setListingRequest(request: RequestSource, ref?: ParentReferenceType | ReferenceType | RequestReference): ParentReferenceType & RequestReference {
                    const requestKey = craftUIDKey();
                    const listingRef = { requestKey, ...(ref || {}) } as ParentReferenceType & RequestReference;
                    trailUpdate(this.getListRequestPath(listingRef), request || {});
                    return listingRef;
                },
                getListingRequest(ref?: ParentReferenceType & RequestReference) {
                    return Object.values(this.getListRequestPath(ref));
                },
                getListingRequestItemsAsObject(ref?: ParentReferenceType | RequestReference) {
                    return trailGet(this.getListRequestPath(ref)) || {};
                },
                getListingRequestItems(ref?: ParentReferenceType & RequestReference) {
                    return Object.values(this.getListRequestPath(ref));
                },
                // general
                getAllAsObject(ref?: ParentReferenceType) {
                    return { ...this.getItemsAsObject(ref), ...this.getRequestItemsAsObject(ref) };
                },
                count(ref?: ParentReferenceType) {
                    return Object.keys(this.getAllAsObject(ref)).length;
                },
                availableCount(ref?: ParentReferenceType) {
                    return getMaxItems() - this.count(ref);
                },
                acceptsMore(keys?: string[], ref?: ParentReferenceType) {
                    return this.availableCount(ref) > 0 || (keys || []).some((key) => Object.keys(this.getAllAsObject(ref)).includes(key));
                },
                getAcceptedKeys(keyedResults?: Record<string, any>, ref?: ParentReferenceType): string[] {
                    const sortedKeys = sortBy(keyedResults, getSortingOrder());

                    const existingKeys = (sortedKeys || []).filter((key) => Object.keys(this.getAllAsObject(ref)).includes(key));
                    const newKeys = (sortedKeys || []).filter((key) => !Object.keys(this.getAllAsObject(ref)).includes(key));

                    // TODO: Doesnt make sense for requests
                    // const newValidKeys = newKeys.filter((key) => validateItem(keyedResults[key]));
                    // console.dir({ newKeys, newValidKeys }, { depth: null });

                    const existingExistingKeysCount = this.count(ref) - existingKeys.length;
                    const maxNbKeys = getMaxItems() - existingExistingKeysCount;
                    const acceptedKeys = [...existingKeys, ...newKeys].slice(0, maxNbKeys > 0 ? maxNbKeys : 0);

                    return acceptedKeys;
                },
            };
        };

        return {
            [INPUT_DATA_KEY]: makeMethods(INPUT_DATA_KEY),
            [OUTPUT_DATA_KEY]: makeMethods(OUTPUT_DATA_KEY),
        };
    };
};
