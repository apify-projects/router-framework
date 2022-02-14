"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRAWLER = exports.HOOK = exports.STORE = void 0;
/* eslint-disable max-len */
var STORE;
(function (STORE) {
    STORE["STATE"] = "GS_STATE";
    STORE["STATS"] = "GS_STATS";
})(STORE = exports.STORE || (exports.STORE = {}));
var HOOK;
(function (HOOK) {
    HOOK["START"] = "START";
    HOOK["SOURCES"] = "SOURCES";
    HOOK["END"] = "END";
    HOOK["BEFORE_EACH"] = "BEFORE_EACH";
    HOOK["AFTER_EACH"] = "AFTER_EACH";
})(HOOK = exports.HOOK || (exports.HOOK = {}));
var CRAWLER;
(function (CRAWLER) {
    CRAWLER["BASIC"] = "BASIC";
    CRAWLER["CHEERIO"] = "CHEERIO";
    CRAWLER["PUPPETEER"] = "PUPPETEER";
    CRAWLER["PLAYWRIGHT"] = "PLAYWRIGHT";
})(CRAWLER = exports.CRAWLER || (exports.CRAWLER = {}));
//# sourceMappingURL=types.js.map