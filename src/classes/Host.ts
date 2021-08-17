import EventEmitter from "events";
import Http, { IncomingMessage, RequestListener, ServerResponse } from "http";
import Response from "./Response";
import Settings from "./Settings";

export type Request = {

    app: Host,
    path: string,
    body: string

}

export type Method = 'POST' | 'GET';

declare interface Host {
    on(event: Method, listener: (request: Request, response: Response) => void): this;
    emit(event: Method, request: Request, response: Response): boolean;
}

class Host extends EventEmitter {

    server: Http.Server;
    port?: number;
    settings: Settings;

    constructor() {

        super();

        this.settings = new Settings();
        this.server = Http.createServer(this.request as RequestListener);

    }

    listen = (port: number): Promise<Host> => new Promise((resolve) => {

        this.port = port;
        this.server.listen(port, () => resolve(this));

    })

    request = (raw_request: IncomingMessage, raw_response: ServerResponse) => {

        let buffer_body = '';
        raw_request.on('data', (chunk: any) => {
            buffer_body += chunk;
        })

        raw_request.on('end', () => {

            const request: Request = {

                app: this,
                path: raw_request.url ?? '/',
                body: buffer_body.toString()
    
            }
            
            const response: Response = new Response(raw_response);
            if(this.settings.get('poweredBy')) response.setHeader('X-Powered-By', 'Dence/NodeJS');

            this.emit('GET', request, response);

        });


    }


}

export default Host;