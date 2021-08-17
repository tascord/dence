"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    Response.prototype.json = function (object, extended) {
        if (extended === void 0) { extended = false; }
        if (this.ended)
            throw new TypeError("Response already concluded.");
        this.raw.setHeader('Content-Type', 'application/json');
        this.raw.write(!extended ? JSON.stringify(object) : JSON.stringify(object, null, 4), "utf8");
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