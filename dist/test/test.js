"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var Dence_1 = __importDefault(require("../Dence"));
// Instantiate dence
var dence = Dence_1.default();
// Remove X-Powered-By credit
dence.settings.set('poweredBy', false);
// Start the server
dence.listen(3000)
    .then(function () { return console.log("Server online."); });
// Handle all GET requests
dence.on('GET', function (request, response) {
    console.log("GET @ " + request.path + " :: " + JSON.stringify(request.query));
});
// Handle singular endpoint
dence.get("/cry", function (req, res) {
    console.log("Get request from /cry!");
    res.sendFile(path_1.join(__dirname, 'index.html'));
});
//# sourceMappingURL=test.js.map