import Dence from "..";

const dence = Dence();
dence.listen(3000)
    .then(() => console.log(`Server online.`));

dence.on('GET', (request, response) => {

    console.log(`GET @ ${request.path} :: ${request.body}`);
    response.json({ pog: true }, true);

});