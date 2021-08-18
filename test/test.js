const { join } = require('path');
const { Dence } = require('../dist');

const Server = Dence();
Server.listen(process.env.PORT || 3000)
    .then(() => console.log(`Server online @ http://localhost:${Server.port}/`));

// Handle user id route
Server.get('/user/:id', (req, res) => {

    console.log(`New user page request: ${req.param.id}`);
    res.status(200).end(`User '${req.param.id}' found!`);

});

// Handles any requests not handled by <Server>.get.
Server.on('GET', (req, res) => {

    res.sendFile(join(__dirname, 'index.html'));

});