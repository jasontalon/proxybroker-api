"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tryGetHttpResponseError = function (err) {
    var _a = err.response, _b = _a === void 0 ? {} : _a, _c = _b.data, data = _c === void 0 ? {} : _c, _d = _b.statusText, statusText = _d === void 0 ? "" : _d;
    return { data: data, statusText: statusText };
};
exports.tryGetHttpResponseError = tryGetHttpResponseError;
var removeStackProperty = function (obj) {
    return Object.getOwnPropertyNames(obj).reduce(function (acc, key) {
        if (key.toLowerCase() !== "stack") {
            acc[key] = obj[key];
            return acc;
        }
        else
            return acc;
    }, {});
};
exports.removeStackProperty = removeStackProperty;
var cleanErrorResponse = function (err) {
    return tryGetHttpResponseError(err) || removeStackProperty(err);
};
exports.cleanErrorResponse = cleanErrorResponse;
var sendErrorResponse = function (res, err) {
    return res.status(400).send(cleanErrorResponse(err));
};
exports.sendErrorResponse = sendErrorResponse;
var getRandomIndex = function (max) {
    return Math.floor(Math.random() * Math.floor(max));
};
var getRandomUniqueNumbers = function (length, maxRandomNumbers) {
    return __spreadArrays(new Array(length)).reduce(function (acc, curValue, curIndex) {
        var randomIndex = getRandomIndex(maxRandomNumbers);
        while (acc.includes(randomIndex))
            randomIndex = getRandomIndex(maxRandomNumbers);
        acc.push(randomIndex);
        return acc;
    }, []);
};
exports.getRandomUniqueNumbers = getRandomUniqueNumbers;
