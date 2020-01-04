"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var routes_1 = __importDefault(require("./routes"));
var _a = process.env.PORT, PORT = _a === void 0 ? 8080 : _a, app = express_1.default();
app.set("json spaces", 2);
app.use(express_1.default.json());
new routes_1.default(app).setup();
app.listen(PORT, function () {
    console.log("listening to port " + PORT);
});
