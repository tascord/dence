"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = __importDefault(require(".."));
var dence = __1.default();
dence.listen(3000)
    .then(function () { return console.log("Server online."); });
dence.on('GET', function (request, response) {
    console.log("GET @ " + request.path + " :: " + request.body);
    response.json({ pog: true }, true);
});
//# sourceMappingURL=index.js.map