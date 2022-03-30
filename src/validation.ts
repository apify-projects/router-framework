/* eslint-disable @typescript-eslint/no-explicit-any */
import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';

import cloneDeep from 'lodash.clonedeep';
import getByPath from 'lodash.get';
import hasByPath from 'lodash.has';
import setByPath from 'lodash.set';

export const validateSchema = (schema: any, data: any) => {
    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    const valid = ajv.validate(schema, data);
    return { valid, errors: ajv.errors || [] };
};

export const errorToPathList = (error: ErrorObject) => {
    const segments = error.instancePath.split('/').filter(Boolean);
    const arrayIndex = [...segments].reverse().findIndex((segment) => !Number.isNaN(+segment));
    return segments.slice(0, -arrayIndex);
};

export const filterValidated = (schema: any, data: any) => {
    let { errors } = validateSchema(schema, data);
    const errorsList = errors;

    const correctData = cloneDeep(data);
    const incorrectData = cloneDeep(data);

    if (errors.length === 0) {
        return {
            correctData,
        };
    }

    const hasNonArraysIssues = errors.some(({ schemaPath }) => !schemaPath.includes('items'));
    if (hasNonArraysIssues) {
        return {
            incorrectData,
            errors,
        };
    };

    // Reduce the incorrectData to empty arrays
    for (const error of errors) {
        const path = errorToPathList(error);
        const subpath = path.slice(0, -1).join('.');
        if (hasByPath(incorrectData, subpath)) {
            setByPath(incorrectData, subpath, []);
        }
    }

    // Fill the incorrect items to incorrectData
    for (const error of errors) {
        const path = errorToPathList(error);
        const subpath = path.slice(0, -1).join('.');
        if (hasByPath(incorrectData, subpath)) {
            setByPath(incorrectData, subpath, [...getByPath(incorrectData, subpath), getByPath(data, path)]);
        }
    }

    let previousError;
    // Reduce the correctData
    while (errors.length > 0 && previousError?.instancePath !== errors[0].instancePath) {
        [previousError] = errors;
        // console.log(errors[0]);
        const path = errorToPathList(errors[0]);
        const index = +path.pop();
        const subpath = path.join('.');
        // console.dir({ error: errors[0], correctData, path, index, subpath }, { depth: null });
        if (hasByPath(correctData, subpath)) {
            const items = getByPath(correctData, subpath);
            items.splice(index, 1);
            setByPath(correctData, subpath, items);
        }
        ({ errors } = validateSchema(schema, correctData));
    }

    if (errors.length > 0) {
        return {
            incorrectData: data,
            errors: errorsList,
        };
    }

    return {
        correctData,
        incorrectData,
        errors: errorsList,
    };
};
