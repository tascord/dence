/// <reference types="node" />
import EventEmitter from "events";
import Http, { IncomingMessage, ServerResponse } from "http";
import Response from "./Response";
import Settings from "./Settings";
export declare type Request = {
    app: Host;
    path: string;
    body: string;
};
export declare type Method = 'POST' | 'GET';
declare interface Host {
    on(event: Method, listener: (request: Request, response: Response) => void): this;
    emit(event: Method, request: Request, response: Response): boolean;
}
declare class Host extends EventEmitter {
    server: Http.Server;
    port?: number;
    settings: Settings;
    constructor();
    listen: (port: number) => Promise<Host>;
    request: (raw_request: IncomingMessage, raw_response: ServerResponse) => void;
}
export default Host;
