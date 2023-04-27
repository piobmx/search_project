"use strict";

const underscore = require("underscore");
const config = require("./config/config");

exports.isAString = function (s) {
    return !(typeof s === "undefined" || s == null || typeof s !== "string");
};

exports.isPosInteger = function (i) {
    return !(
        typeof i === "undefined" ||
        i == null ||
        typeof i !== "number" ||
        i < 0
    );
};

exports.isObject = function (o) {
    return !(typeof o === "undefined" || o == null || typeof o !== "object");
};

exports.isFresh = function (date) {
    const currentDate = new Date();
    return (currentDate - date) / 1000 <= config.cacheFreshness;
};

exports.sample = function (a, n) {
    return underscore.take(underscore.shuffle(a), n);
};

exports.getUrlParams = function (url) {
    let params = {};
    let paramString = url.substring(url.indexOf("?") + 1);
    let paramArray = paramString.split("&");
    for (let i = 0; i < paramArray.length; i++) {
        let param = paramArray[i].split("=");
        params[param[0]] = param[1];
    }
    return params;
};
