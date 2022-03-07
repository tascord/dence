const { Dence } = require('../dist');

// Create instance
const Server = Dence();
Server.listen(process.env.PORT || 5000)
    .then(() => console.log(`Server online @ http://localhost:${Server.port}/`));

Server.on('POST', (req, res) => {

    console.log('[+] ' + req.path);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

    res.status(200).json({ abc: 'defg' });

});