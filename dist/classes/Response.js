"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var Constants_1 = require("../Constants");
var Response = /** @class */ (function () {
    function Response(server, raw) {
        this.raw = raw;
        this.ended = false;
        this.server = server;
    }
    Response.prototype.status = function (code) {
        if (this.ended)
            throw new TypeError("Response already concluded.");
        if (isNaN(code) || !isFinite(code) || parseInt(code.toString()) != code) {
            throw new TypeError("Invalid status code: " + code);
        }
        this.raw.statusCode = code;
        return this;
    };
    Response.prototype.json = function (json, extended) {
        if (extended === void 0) { extended = false; }
        if (this.ended)
            throw new TypeError("Response already concluded.");
        if (!this.raw.getHeader('Content-Type'))
            this.setHeader('Content-Type', 'application/json');
        this.raw.write(!extended ? JSON.stringify(json) : JSON.stringify(json, null, 4), "utf8");
        this.end();
        return this;
    };
    Response.prototype.text = function (text) {
        if (this.ended)
            throw new TypeError("Response already concluded.");
        if (!this.raw.getHeader('Content-Type'))
            this.setHeader('Content-Type', 'text/plain');
        this.raw.write(text);
        this.end();
        return this;
    };
    Response.prototype.sendFile = function (path, args) {
        if (args === void 0) { args = {}; }
        if (this.ended)
            throw new TypeError("Response already concluded.");
        if (!fs_1.existsSync(path))
            throw new TypeError("No file exists at path: " + path);
        if (!this.raw.getHeader('Content-Type'))
            this.setHeader('Content-Type', Constants_1.InferContentTypeFromFilename(path));
        var content = this.server.modify_file_mixin(path, fs_1.readFileSync(path).toString('utf-8'), args);
        this.raw.write(content);
        this.end();
        return this;
    };
    Response.prototype.setHeader = function (header, value) {
        this.raw.setHeader(header, value);
        return this;
    };
    Response.prototype.end = function (text) {
        if (this.ended)
            return;
        if (!this.raw.getHeader('Content-Type'))
            this.setHeader('Content-Type', 'text/plain');
        if (text)
            this.text(text);
        this.raw.end();
        this.ended = true;
    };
    Response.prototype.concluded = function () {
        return this.ended;
    };
    return Response;
}());
exports.default = Response;
//# sourceMappingURL=Response.js.map