/* eslint-disable @typescript-eslint/no-explicit-any */
import { customAlphabet } from 'nanoid';
import { URL } from 'url';
import { UID_KEY_PREFIX } from '../consts';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const uidPartLength = 2;

export const craftUID = customAlphabet(alphabet, 4);
export const craftUIDKey = (prefix?: string) => `${prefix || UID_KEY_PREFIX}_${customAlphabet(alphabet, uidPartLength)()}${new Date().getTime().toString(36)}`;
export const getUIDKeyTime = (key: string) => parseInt(key.split('_')[1].slice(uidPartLength), 36);
export const sortUIDKeysFromLatest = (keys: string[]) => keys.sort((a, b) => getUIDKeyTime(a) - getUIDKeyTime(b));
export const sortUIDKeysFromOldest = (keys: string[]) => keys.sort((a, b) => getUIDKeyTime(b) - getUIDKeyTime(a));

export const arrayToKeyedObject = (arr: any[]) => arr
    .reduce((acc, item) => {
        acc[craftUIDKey()] = item;
        return acc;
    }, {});

export const keyedObjectToArray = (keyedObject: Record<string, any>) => Object.values(keyedObject)
    .reduce((acc, item) => {
        acc.push(item);
        return acc;
    }, []);

export const extendRequest = (request: any, data: any) => {
    return {
        ...request,
        userData: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...((request as any).userData || {}),
            ...data,
        },
    };
};

export const randomNumberBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const resolveUrl = (path: string, url: string): string | void => {
    try {
        const link = new URL(path, url);
        return link.href;
    } catch (error) {
        // fail silently, return undefined
    }
};
