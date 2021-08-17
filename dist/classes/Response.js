"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var Constants_1 = require("../Constants");
var Response = /** @class */ (function () {
    function Response(raw) {
        this.raw = raw;
        this.ended = false;
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
    Response.prototype.sendFile = function (path) {
        if (this.ended)
            throw new TypeError("Response already concluded.");
        if (!fs_1.existsSync(path))
            throw new TypeError("No file exists at path: " + path);
        if (!this.raw.getHeader('Content-Type'))
            this.setHeader('Content-Type', Constants_1.InferContentTypeFromFilename(path));
        this.raw.write(fs_1.readFileSync(path));
        this.end();
        return this;
    };
    Response.prototype.setHeader = function (header, value) {
        this.raw.setHeader(header, value);
        return this;
    };
    Response.prototype.end = function () {
        if (this.ended)
            return;
        if (!this.raw.getHeader('Content-Type'))
            this.raw.setHeader('Content-Type', 'text/plain');
        this.raw.end();
        this.ended = true;
    };
    return Response;
}());
exports.default = Response;
//# sourceMappingURL=Response.js.map