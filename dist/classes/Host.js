"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __importDefault(require("events"));
var http_1 = __importDefault(require("http"));
var Response_1 = __importDefault(require("./Response"));
var Settings_1 = __importDefault(require("./Settings"));
var package_json_1 = require("../package.json");
var Host = /** @class */ (function (_super) {
    __extends(Host, _super);
    function Host() {
        var _this = _super.call(this) || this;
        _this.listen = function (port) { return new Promise(function (resolve) {
            _this.port = port;
            _this.server.listen(port, function () { return resolve(_this); });
        }); };
        _this.request = function (raw_request, raw_response) {
            var buffer_body = '';
            raw_request.on('data', function (chunk) {
                buffer_body += chunk;
            });
            raw_request.on('end', function () {
                var _a;
                var request = {
                    app: _this,
                    path: (_a = raw_request.url) !== null && _a !== void 0 ? _a : '/',
                    body: buffer_body.toString()
                };
                var response = new Response_1.default(raw_response);
                if (_this.settings.get('poweredBy'))
                    response.setHeader('X-Powered-By', 'Dence/' + package_json_1.version);
                _this.emit('GET', request, response);
            });
        };
        _this.settings = new Settings_1.default();
        _this.server = http_1.default.createServer(_this.request);
        return _this;
    }
    return Host;
}(events_1.default));
exports.default = Host;
//# sourceMappingURL=Host.js.map