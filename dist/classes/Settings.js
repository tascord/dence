"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults = {
    "poweredBy": true,
    "disallowMultipleHandlers": true,
};
var Settings = /** @class */ (function () {
    function Settings() {
        this.values = defaults;
    }
    Settings.prototype.set = function (key, value) {
        if (!this.values[key])
            throw new TypeError("No value '".concat(key, "' exists in settings"));
        this.values[key] = value;
        return this;
    };
    Settings.prototype.get = function (key) {
        var _a;
        return (_a = this.values[key]) !== null && _a !== void 0 ? _a : null;
    };
    return Settings;
}());
exports.default = Settings;
//# sourceMappingURL=Settings.js.map