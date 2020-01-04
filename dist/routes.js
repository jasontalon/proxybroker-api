"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var proxybroker_1 = __importStar(require("./proxybroker"));
var RouteBuilder = /** @class */ (function () {
    function RouteBuilder(app) {
        this.app = app;
    }
    RouteBuilder.prototype.getRoutes = function () {
        var routes = [
            {
                httpMethod: "get",
                path: "/search",
                handler: function (request, response) {
                    return __awaiter(this, void 0, void 0, function () {
                        var emptyString, notEmpty, _a, _b, countries, _c, types, _d, lvl, _e, limit, _f, strict, asProxyType, asLevel, proxies, err_1;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    emptyString = "", notEmpty = function (value) { return !!value; }, _a = request.query, _b = _a.countries, countries = _b === void 0 ? emptyString : _b, _c = _a.types, types = _c === void 0 ? emptyString : _c, _d = _a.lvl, lvl = _d === void 0 ? emptyString : _d, _e = _a.limit, limit = _e === void 0 ? 10 : _e, _f = _a.strict, strict = _f === void 0 ? false : _f;
                                    if ([types, lvl].includes(emptyString)) {
                                        response
                                            .status(400)
                                            .send("specify types=[HTTP, HTTPS, SOCKS4, SOCKS5, CONNECT:80, CONNECT25], lvl=[Transparent, Anonymous, High] parameters");
                                        return [2 /*return*/];
                                    }
                                    _g.label = 1;
                                case 1:
                                    _g.trys.push([1, 3, , 4]);
                                    asProxyType = function (type) { return type; }, asLevel = function (level) { return level; };
                                    return [4 /*yield*/, new proxybroker_1.default({
                                            countries: countries.split(",").filter(function (p) { return p; }),
                                            types: types
                                                .split(",")
                                                .map(asProxyType)
                                                .filter(notEmpty),
                                            lvl: lvl
                                                .split(",")
                                                .map(asLevel)
                                                .filter(notEmpty),
                                            limit: limit,
                                            strict: strict
                                        }).search()];
                                case 2:
                                    proxies = _g.sent();
                                    response.jsonp(proxies.map(proxybroker_1.Format));
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _g.sent();
                                    response.status(400).send(err_1);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    });
                }
            }
        ];
        return routes;
    };
    RouteBuilder.prototype.assignRoute = function (route) {
        this.app[route.httpMethod](route.path, route.handler);
    };
    RouteBuilder.prototype.setup = function () {
        this.getRoutes().forEach(this.assignRoute, this);
    };
    return RouteBuilder;
}());
exports.default = RouteBuilder;
