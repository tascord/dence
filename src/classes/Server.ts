import EventEmitter from "events";
import Http, { IncomingHttpHeaders, IncomingMessage, RequestListener, ServerResponse } from "http";
import Response from "./Response";
import Settings from "./Settings";

export type Request = {

    server: Server,
    path: string,
    body: string,
    query: { [key: string]: string | boolean | Array<string | boolean> },
    method: Method,
    param: { [parameter: string]: string },
    headers: IncomingHttpHeaders

}

export type Method = 'POST' | 'GET';
export type Listener = (request: Request, response: Response) => void;
type ListenerGroup = { [path: string]: Listener };

export type Mixin = {
    priority: number,
    modify?: (request: Request, response: Response) => { request: Request, response: Response };
    modify_file?: (file_name: string, content: Buffer, args: object) => { content?: Buffer, content_type?: string };
}

declare interface Server {
    on(event: Method, listener: Listener): this;
    emit(event: Method, request: Request, response: Response): boolean;
}

class Server extends EventEmitter {

    private server: Http.Server;
    public port?: number;
    public settings: Settings;
    private handlers: Map<Method, ListenerGroup>;
    private mixins: Mixin[];

    constructor(server?: Http.Server) {

        super();

        this.settings = new Settings();
        this.server = server ?? Http.createServer();

        // Listen
        this.server.on('request', (req, res) => this.request(req, res));

        this.handlers = new Map();
        this.mixins = [];

    }

    public listen = (port: number): Promise<Server> => new Promise((resolve) => {

        this.port = port;
        this.server.listen(port, () => resolve(this));

    })

    private request = (raw_request: IncomingMessage, raw_response: ServerResponse): void => {

        // Read body data
        let buffer_body = '';
        raw_request.on('data', (chunk: any) => {
            buffer_body += chunk;
        })

        // After body has been read 
        raw_request.on('end', () => {

            const query_parameters: Request["query"] = {};
            (raw_request.url ?? '').split('?').pop()?.split('&').forEach(qp => {

                let [key, value]: (boolean | string | Array<boolean | string>)[] = qp.split('=');
                if (key === undefined) return;

                key = decodeURIComponent(key);
                value = value ? decodeURIComponent(value) : true;

                const current_value = query_parameters[key];

                // Set current value
                if (!current_value) {
                    return query_parameters[key] = value;
                }

                // Convert current value to array
                if (typeof current_value === 'string' || typeof current_value === 'boolean') {
                    query_parameters[key] = [current_value];
                }

                // Add value to current value array
                (query_parameters[key] as Array<string | boolean>).push(value);

            });


            // Create request
            let request: Request = {

                server: this,
                path: (raw_request.url ?? '/').split('?')[0],
                body: buffer_body.toString(),
                query: query_parameters,
                method: raw_request.method as Method,
                param: {},
                headers: raw_request.headers

            }

            // Create response
            let response: Response = new Response(this, raw_response);

            // Apply header if setting enabled
            if (this.settings.get('poweredBy')) response.setHeader('X-Powered-By', 'Dence/NodeJS');

            // Run mixins
            const mutated = this.modify_mixins(request, response);
            request = mutated.request;
            response = mutated.response;

            // Ignore responses handled by mixins
            if (response.concluded()) return;

            // Run requests, emitting base event if no handler was supplied
            if (!this.run_handler(request.method, request, response)) {
                if(!this.emit(request.method, request, response)) {
                    response.status(404).end();
                }
            }

        });


    }

    public get = (path: string, listener: Listener): void => {
        let value = this.handlers.get('GET') ?? {};
        value[path] = listener;
        this.handlers.set('GET', value);
    }

    public post = (path: string, listener: Listener): void => {
        let value = this.handlers.get('POST') ?? {};
        value[path] = listener;
        this.handlers.set('POST', value);
    }

    private run_handler = (method: Method, request: Request, response: Response): boolean => {

        let handler_group = this.handlers.get(method);
        if (!handler_group) return false;

        const regex = Server.path_matcher(request.path);
        const handlers = Object.entries(handler_group)
            .filter(([path, _]) => regex.test(path))

        if (handlers.length === 0) return false;

        if (handlers.length > 1 && this.settings.get("disallowMultipleHandlers")) {
            throw new Error(`Multiple handlers exist for path: ${request.path}`);
        }

        for (let [path, handler] of handlers) {

            const handler_subpaths = path.split('/');
            const request_subpaths = request.path.split('/');
            const param: Request["param"] = {};

            for (let i = 0; i < request_subpaths.length; i++) {

                if (handler_subpaths[i][0] === ':') param[handler_subpaths[i].slice(1)] = request_subpaths[i];

            }

            handler({ ...request, param }, response);
        }

        return true;

    }

    public static path_matcher = (path: string): RegExp => {

        return RegExp('^' + path.replace(/[-|\\{}()[\]^$+*?.]/g, '\\$&').split('/').map(ps => `(${ps}|\\*|:[^/]+)`).join('\\/') + '(?:\\/|)$');

    }

    public register_mixin = (mixin: Mixin): void => {

        this.mixins.push(mixin);
        this.mixins = this.mixins.sort((a, b) => b.priority - a.priority);

    }

    private modify_mixins = (request: Request, response: Response) => {

        for (let mixin of this.mixins) {

            if (!mixin.modify) continue;
            const modified = mixin.modify(request, response);

            request = modified.request;
            response = modified.response;

            if (response.concluded()) break;

        }

        return { request, response };

    }

    public modify_file_mixin = (file_name: string, content: Buffer, args: object) => {

        let new_content: Buffer = content;
        let content_type: string | undefined = undefined;

        for (let mixin of this.mixins) {

            if (!mixin.modify_file) continue;

            const modified = mixin.modify_file(file_name, content, args);

            new_content = modified.content ?? content;
            content_type = modified.content_type ?? content_type;


        }

        return { content: new_content, content_type };

    }

}

export { Server };