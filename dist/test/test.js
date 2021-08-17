"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Dence_1 = __importDefault(require("../Dence"));
var dence = Dence_1.default();
dence.listen(3000)
    .then(function () { return console.log("Server online."); });
dence.on('GET', function (request, response) {
    console.log("GET @ " + request.path + " :: " + JSON.stringify(request.query));
});
dence.get("/cry", function (req, res) {
    console.log("Get request from /cry!");
    res.json({ weeping: true });
});
//# sourceMappingURL=test.js.map