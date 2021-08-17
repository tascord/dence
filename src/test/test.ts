import { join } from "path";
import Dence from "../Dence";

// Instantiate dence
const dence = Dence();

// Remove X-Powered-By credit
dence.settings.set('poweredBy', false);

// Start the server
dence.listen(3000)
    .then(() => console.log(`Server online.`));

// Handle all GET requests
dence.on('GET', (request, response) => {

    console.log(`GET @ ${request.path} :: ${JSON.stringify(request.query)}`);

});

// Handle singular endpoint
dence.get("/cry", (req, res) => {

    console.log("Get request from /cry!");
    res.sendFile(join(__dirname, 'index.html'));

});

