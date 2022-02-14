"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveUrl = exports.randomNumberBetween = exports.extendRequest = exports.keyedObjectToArray = exports.arrayToKeyedObject = exports.craftUIDKey = exports.craftUID = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const nanoid_1 = require("nanoid");
const url_1 = require("url");
const consts_1 = require("../consts");
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
exports.craftUID = (0, nanoid_1.customAlphabet)(alphabet, 4);
const craftUIDKey = () => `${consts_1.UID_KEY_PREFIX}${(0, nanoid_1.customAlphabet)(alphabet, 6)()}`;
exports.craftUIDKey = craftUIDKey;
const arrayToKeyedObject = (arr) => arr
    .reduce((acc, item) => {
    acc[(0, exports.craftUIDKey)()] = item;
    return acc;
}, {});
exports.arrayToKeyedObject = arrayToKeyedObject;
const keyedObjectToArray = (keyedObject) => Object.values(keyedObject)
    .reduce((acc, item) => {
    acc.push(item);
    return acc;
}, []);
exports.keyedObjectToArray = keyedObjectToArray;
const extendRequest = (request, data) => {
    return {
        ...request,
        userData: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(request.userData || {}),
            ...data,
        },
    };
};
exports.extendRequest = extendRequest;
const randomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
exports.randomNumberBetween = randomNumberBetween;
const resolveUrl = (path, url) => {
    try {
        const link = new url_1.URL(path, url);
        return link.href;
    }
    catch (error) {
        // fail silently, return undefined
    }
};
exports.resolveUrl = resolveUrl;
//# sourceMappingURL=utils.js.map