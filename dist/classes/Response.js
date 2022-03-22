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
        if (this.raw.writableEnded || this.raw.headersSent) {
            this.ended = true;
            return this;
        }
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
        if (this.raw.writableEnded || this.raw.headersSent) {
            this.ended = true;
            return this;
        }
        if (!this.raw.getHeader('Content-Type'))
            this.setHeader('Content-Type', 'application/json');
        this.raw.write(!extended ? JSON.stringify(json) : JSON.stringify(json, null, 4), "utf8");
        this.end();
        return this;
    };
    Response.prototype.text = function (text) {
        if (this.ended)
            throw new TypeError("Response already concluded.");
        if (this.raw.writableEnded || this.raw.headersSent) {
            this.ended = true;
            return this;
        }
        if (!this.raw.getHeader('Content-Type'))
            this.setHeader('Content-Type', 'text/plain');
        this.raw.write(text);
        this.end();
        return this;
    };
    Response.prototype.sendFile = function (path, args) {
        var _a;
        if (args === void 0) { args = {}; }
        if (this.ended)
            throw new TypeError("Response already concluded.");
        if (this.raw.writableEnded || this.raw.headersSent) {
            this.ended = true;
            return this;
        }
        if (!(0, fs_1.existsSync)(path))
            throw new TypeError("No file exists at path: " + path);
        var file = (0, fs_1.readFileSync)(path);
        var _b = this.server.modify_file_mixin(path, file, args), content = _b.content, content_type = _b.content_type;
        if (!this.raw.getHeader('Content-Type'))
            this.setHeader('Content-Type', content_type !== null && content_type !== void 0 ? content_type : (0, Constants_1.InferContentTypeFromFilename)(path));
        this.raw.write(((_a = this.raw.getHeader('Content-Type')) === null || _a === void 0 ? void 0 : _a.toString().startsWith('text/')) ? content.toString() : content);
        this.end();
        return this;
    };
    Response.prototype.redirect = function (path, permanent) {
        if (permanent === void 0) { permanent = false; }
        this.status(permanent ? 308 : 307)
            .setHeader('Location', path)
            .end();
    };
    Response.prototype.setHeader = function (header, value) {
        if (this.ended)
            throw new TypeError("Response already concluded.");
        if (this.raw.writableEnded || this.raw.headersSent) {
            this.ended = true;
            return this;
        }
        this.raw.setHeader(header, value);
        return this;
    };
    Response.prototype.end = function (text) {
        if (this.ended)
            return;
        if (this.raw.writableFinished) {
            this.ended = true;
            return this;
        }
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