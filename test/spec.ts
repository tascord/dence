import Dence, { Request, Response } from '../dist';
import $, { Headers } from 'node-fetch';
import { join } from 'path';
import chalk from 'chalk';
import { render } from 'ejs';
import Http from "http";

type ValidatorArgs = [Headers, string];
const tests: {
    name: string,
    description: string,
    status: 'running' | 'pass' | 'fail' | 'error',
    time: number,
    log: string[]
}[] = [];

// Create HTTP server
const HttpServer = Http.createServer();
HttpServer.on('request', (req: Http.IncomingMessage, res: Http.ServerResponse) => {
    
    if(req.url === '/http') {
        res.write('HTTP Success!');
        res.end();
    }

})

// Create Dence Server
const Server = Dence(HttpServer);
Server.listen(Number(process.env.PORT || 5000))
    .then(queue_tests);

Server.register_mixin({
    priority: 1,
    modify_file: (file_name: string, content: Buffer, args: object) => {

        if (file_name.endsWith('.ejs')) return { content: render(content.toString(), { tests }, {}), content_type: 'text/html' };
        else return { content };

    }
});

// Online view
Server.get('/', (_req, res) => res.sendFile(join(__dirname, 'resources', 'index.ejs')));
Server.get('/r/:resource', (req, res) => res.sendFile(join(__dirname, 'resources', req.param.resource)));

// Update tests in console
const update_tests = () => {
    console.clear();
    console.log(chalk.bold('\nSpec Tests:\n'));
    for (const test of tests) {

        const emoji = test.status === 'error' ? '🚨' : test.status === 'running' ? '🕐' : test.status === 'pass' ? '✅' : '❌';
        const colour = test.status === 'error' ? chalk.redBright : test.status === 'running' ? chalk.cyanBright : test.status === 'pass' ? chalk.greenBright : chalk.yellowBright;

        console.log(chalk.bold(colour(`[${emoji}] ${test.name} - ${test.description} (${test.time}ms)\n`)));
    }
}

// Run tests
const test = async (name: string, description: string, handler: (Request, Response) => void, validator: (...args: ValidatorArgs) => boolean) => {

    const path = `/test/${name.toLowerCase().replace(/ +/g, '_')}`;
    const test_index = tests.push({
        name, description,
        status: 'running',
        time: 0,
        log: []
    }) - 1;

    const log = (message: string) => tests[test_index].log.push(message);

    update_tests();

    try {
        // Add handler
        Server.get(path, handler);

        // URL
        const url = `http://localhost:${Server.port}${path}`;

        // Starting time
        const start = Date.now();

        // Request
        log(`Polling ${url} for data`);
        const response = await $(url);
        const time = Date.now() - start;

        const body = await response.text();
        const status = validator(response.headers, body);

        tests[test_index].status = status ? 'pass' : 'fail';
        tests[test_index].time = time;

        log(`Arrived at ${response.url}!`);
        log('Response Headers:\n' + JSON.stringify(response.headers.raw()));
        log('Request Body:\n' + JSON.stringify(body));


    } catch (reason) {
        tests[test_index].status = 'error';
        log(`Error: ${reason}`);
    } finally {
        log(`Test concluded in ${tests[test_index].time}ms [${tests[test_index].status}]`);
        update_tests();
    }


}

/** Test Suite Below **/

function queue_tests() {

    // console.clear();

    test(
        'Test 1', 'Ensure text is sent correctly',
        (_req, res) => res.text('Success!'),
        (_headers, body) => body === 'Success!'
    )

    test(
        'Test 2', 'Ensure JSON is sent with correct headers',
        (_req, res) => res.json({ success: true }),
        (headers, body) => headers.get('content-type') === 'application/json' && JSON.parse(body).success === true
    )

    test(
        'Test 3', 'Ensure redirects are sent correctly',
        (_req, res) => res.redirect('/test/test_1'),
        (_headers, body) => body === 'Success!'
    )

    test(
        'Test 4', 'Ensure file is sent correctly',
        (_req, res) => res.redirect('/r/test.txt'),
        (_headers, body) => body === 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    )

    test(
        'Test 5', 'Ensure server creation from http.Server',
        (_req, res) => res.redirect('/http'),
        (_headers, body) => body === 'HTTP Success!'
    )


}