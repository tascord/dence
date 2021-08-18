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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
var events_1 = __importDefault(require("events"));
var http_1 = __importDefault(require("http"));
var Response_1 = __importDefault(require("./Response"));
var Settings_1 = __importDefault(require("./Settings"));
var Server = /** @class */ (function (_super) {
    __extends(Server, _super);
    function Server() {
        var _this = _super.call(this) || this;
        _this.listen = function (port) { return new Promise(function (resolve) {
            _this.port = port;
            _this.server.listen(port, function () { return resolve(_this); });
        }); };
        _this.request = function (raw_request, raw_response) {
            // Read body data
            var buffer_body = '';
            raw_request.on('data', function (chunk) {
                buffer_body += chunk;
            });
            // After body has been read 
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
                // Create request
                var request = {
                    app: _this,
                    path: ((_c = raw_request.url) !== null && _c !== void 0 ? _c : '/').split('?')[0],
                    body: buffer_body.toString(),
                    query: query_parameters,
                    param: {},
                };
                // Create response
                var response = new Response_1.default(raw_response);
                // Apply header if setting enabled
                if (_this.settings.get('poweredBy'))
                    response.setHeader('X-Powered-By', 'Dence/NodeJS');
                // Run mixins
                var mutated = _this.run_mixins(request, response);
                request = mutated.request;
                response = mutated.response;
                // Ignore responses handled by mixins
                if (response.concluded())
                    return;
                // Run requests, emitting base event if no handler was supplied
                switch (raw_request.method) {
                    case "GET":
                        if (!_this.run_handler(raw_request.method, request, response))
                            _this.emit('GET', request, response);
                        break;
                    case "POST":
                        if (!_this.run_handler(raw_request.method, request, response))
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
        _this.run_handler = function (method, request, response) {
            var e_1, _a;
            var handler_group = _this.handlers.get(method);
            if (!handler_group)
                return false;
            var regex = Server.path_matcher(request.path);
            var handlers = Object.entries(handler_group)
                .filter(function (_a) {
                var _b = __read(_a, 2), path = _b[0], _ = _b[1];
                return regex.test(path);
            });
            if (handlers.length === 0)
                return false;
            if (handlers.length > 1 && _this.settings.get("disallowMultipleHandlers")) {
                throw new Error("Multiple handlers exist for path: " + request.path);
            }
            try {
                for (var handlers_1 = __values(handlers), handlers_1_1 = handlers_1.next(); !handlers_1_1.done; handlers_1_1 = handlers_1.next()) {
                    var _b = __read(handlers_1_1.value, 2), path = _b[0], handler = _b[1];
                    var handler_subpaths = path.split('/');
                    var request_subpaths = request.path.split('/');
                    var param = {};
                    for (var i = 0; i < request_subpaths.length; i++) {
                        if (handler_subpaths[i][0] === ':')
                            param[handler_subpaths[i].slice(1)] = request_subpaths[i];
                    }
                    handler(__assign(__assign({}, request), { param: param }), response);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (handlers_1_1 && !handlers_1_1.done && (_a = handlers_1.return)) _a.call(handlers_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return true;
        };
        _this.register_mixin = function (mixin) {
            _this.mixins.push(mixin);
            _this.mixins = _this.mixins.sort(function (a, b) { return b.priority - a.priority; });
        };
        _this.run_mixins = function (request, response) {
            var e_2, _a;
            try {
                for (var _b = __values(_this.mixins), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var mixin = _c.value;
                    var modified = mixin.modify(request, response);
                    request = modified.request;
                    response = modified.response;
                    if (response.concluded())
                        break;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return { request: request, response: response };
        };
        _this.settings = new Settings_1.default();
        _this.server = http_1.default.createServer(_this.request);
        _this.handlers = new Map();
        _this.mixins = [];
        return _this;
    }
    Server.path_matcher = function (path) {
        return RegExp('^' + path.split('/').map(function (ps) { return "(" + ps + "|\\*|:[^/]+)"; }).join('\\/') + '(?:\\/|)$');
    };
    return Server;
}(events_1.default));
exports.Server = Server;
//# sourceMappingURL=Server.js.map