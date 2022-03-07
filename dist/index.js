"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = exports.Response = exports.Server = void 0;
var Server_1 = require("./classes/Server");
Object.defineProperty(exports, "Server", { enumerable: true, get: function () { return Server_1.Server; } });
var Response_1 = __importDefault(require("./classes/Response"));
exports.Response = Response_1.default;
var Settings_1 = __importDefault(require("./classes/Settings"));
exports.Settings = Settings_1.default;
function Dence() {
    return new Server_1.Server();
}
exports.default = Dence;
module.exports = Dence;
//# sourceMappingURL=index.js.map