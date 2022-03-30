/* eslint-disable @typescript-eslint/no-explicit-any */
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import type { ApiProxy, RequestContext } from '@apify-projects/router-framework/dist/common/types';
import { ValidationOptions } from '../common/types';

export default (context: RequestContext, api: Partial<ApiProxy>) => {
    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);

    function makeSchemaValidator<T>(key: string, schema: any) {
        return (data: T = {} as T, { partial = false, logError = true, throwError = true }: ValidationOptions = {}) => {
            const validate = ajv.compile({ ...schema, ...(partial ? { required: [] } : {}) });
            const valid = validate(data);
            if (!valid) {
                if (logError) api.log.error(`Input ${key} is invalid`, { data, errors: validate.errors });
                if (throwError) throw new Error(`Input ${key} is invalid`);
            }
            return valid;
        };
    };

    return {
        userData(keys: string[], { partial = false, logError = true, throwError = true }: ValidationOptions = {}) {
            return makeSchemaValidator<any>('userData', {
                type: 'object',
                properties: keys.reduce((acc, key) => ({ ...acc, [key]: { type: 'string' } }), {}),
                required: keys,
            })(context.request?.userData, { partial, logError, throwError });
        },
        makeSchemaValidator,
    };
};
