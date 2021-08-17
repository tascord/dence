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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __importDefault(require("events"));
var http_1 = __importDefault(require("http"));
var Response_1 = __importDefault(require("./Response"));
var Settings_1 = __importDefault(require("./Settings"));
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
                var _a, _b, _c;
                var query_parameters = {};
                (_b = ((_a = raw_request.url) !== null && _a !== void 0 ? _a : '').split('?').pop()) === null || _b === void 0 ? void 0 : _b.split('&').forEach(function (qp) {
                    var _a = __read(qp.split('='), 2), key = _a[0], value = _a[1];
                    if (key === undefined)
                        return;
                    key = decodeURIComponent(key);
                    value = value ? decodeURIComponent(value) : true;
                    var current_value = query_parameters[key];
                    // Set current value
                    if (!current_value) {
                        return query_parameters[key] = value;
                    }
                    // Convert current value to array
                    if (typeof current_value === 'string' || typeof current_value === 'boolean') {
                        query_parameters[key] = [current_value];
                    }
                    // Add value to current value array
                    query_parameters[key].push(value);
                });
                var request = {
                    app: _this,
                    path: ((_c = raw_request.url) !== null && _c !== void 0 ? _c : '/').split('?')[0],
                    body: buffer_body.toString(),
                    query: query_parameters
                };
                var response = new Response_1.default(raw_response);
                if (_this.settings.get('poweredBy'))
                    response.setHeader('X-Powered-By', 'Dence/NodeJS');
                var handler_group = _this.handlers.get(raw_request.method);
                switch (raw_request.method) {
                    case "GET":
                        if (handler_group && handler_group[request.path])
                            handler_group[request.path](request, response);
                        _this.emit('GET', request, response);
                        break;
                    case "POST":
                        if (handler_group && handler_group[request.path])
                            handler_group[request.path](request, response);
                        _this.emit('GET', request, response);
                        break;
                }
            });
        };
        _this.get = function (path, listener) {
            var _a;
            var value = (_a = _this.handlers.get('GET')) !== null && _a !== void 0 ? _a : {};
            value[path] = listener;
            _this.handlers.set('GET', value);
        };
        _this.post = function (path, listener) {
            var _a;
            var value = (_a = _this.handlers.get('POST')) !== null && _a !== void 0 ? _a : {};
            value[path] = listener;
            _this.handlers.set('POST', value);
        };
        _this.settings = new Settings_1.default();
        _this.server = http_1.default.createServer(_this.request);
        _this.handlers = new Map();
        return _this;
    }
    return Host;
}(events_1.default));
exports.default = Host;
//# sourceMappingURL=Host.js.map