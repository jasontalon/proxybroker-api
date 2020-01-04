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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __importDefault(require("util"));
var child_process_1 = require("child_process");
var ProxyBroker = /** @class */ (function () {
    function ProxyBroker(config) {
        this.config = config;
    }
    ProxyBroker.prototype.search = function () {
        return __awaiter(this, void 0, void 0, function () {
            var command, asyncExec, _a, stdout, stderr, items;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        command = this.buildCommand(), asyncExec = util_1.default.promisify(child_process_1.exec);
                        return [4 /*yield*/, asyncExec(command)];
                    case 1:
                        _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                        if (stderr)
                            throw stderr;
                        else {
                            items = stdout.split("\n").filter(function (p) { return p; });
                            return [2 /*return*/, items];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ProxyBroker.prototype.buildCommand = function () {
        var _a = this.config, types = _a.types, lvl = _a.lvl, strict = _a.strict, limit = _a.limit, countries = _a.countries, buildArgs = function (config) {
            var countryArgs = countries.length > 0 ? "--countries " + countries.join(" ") : "", lvlArgs = lvl.length > 0 ? "--lvl " + lvl.join(" ") : "", typesArgs = types.length > 0 ? "--types " + types.join(" ") : "", strictArgs = strict ? "--strict" : "", limitArgs = "--limit " + limit;
            return countryArgs + " " + typesArgs + " " + lvlArgs + " " + strictArgs + " " + limitArgs;
        }, args = buildArgs(this.config), command = "proxybroker find " + args, removeWhiteSpaces = function (val) {
            return val.replace(/\r?\n|\r/g, " ").replace(/\s\s+/g, " ");
        };
        return removeWhiteSpaces(command);
    };
    return ProxyBroker;
}());
exports.default = ProxyBroker;
var AddressFormatter = /** @class */ (function () {
    function AddressFormatter(proxy) {
        this.proxy = proxy;
        this.extracted = "";
        this.formatted = { fullAddress: "", ip: "", port: "", summary: "" };
    }
    AddressFormatter.prototype.extract = function () {
        var _a;
        this.extracted = (_a = (this.proxy.match(/(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+/gm) || []).pop(), (_a !== null && _a !== void 0 ? _a : ""));
        return this;
    };
    AddressFormatter.prototype.format = function () {
        var regex = new RegExp(/(?::[0-9]+)$/gm), ip = this.extracted.replace(regex, ""), port = ((this.extracted.match(regex) || []).pop() || "").replace(/:/gm, "") ||
            "";
        this.formatted = {
            fullAddress: ip + ":" + port,
            ip: ip,
            port: port,
            summary: this.proxy
        };
        return this;
    };
    return AddressFormatter;
}());
function Format(proxy) {
    var formatted = new AddressFormatter(proxy).extract().format().formatted;
    return formatted;
}
exports.Format = Format;
