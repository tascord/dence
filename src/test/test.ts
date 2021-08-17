import Dence from "../Dence";

const dence = Dence();
dence.listen(3000)
    .then(() => console.log(`Server online.`));

dence.on('GET', (request, response) => {

    console.log(`GET @ ${request.path} :: ${JSON.stringify(request.query)}`);

});

dence.get("/cry", (req, res) => {

    console.log("Get request from /cry!");
    res.json({ weeping: true });

});