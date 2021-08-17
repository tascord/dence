/// <reference types="node" />
import EventEmitter from "events";
import Http from "http";
import Response from "./Response";
import Settings from "./Settings";
export declare type Request = {
    app: Host;
    path: string;
    body: string;
    query: {
        [key: string]: string | boolean | Array<string | boolean>;
    };
};
export declare type Method = 'POST' | 'GET';
export declare type Listener = (request: Request, response: Response) => void;
declare type ListenerGroup = {
    [path: string]: Listener;
};
declare interface Host {
    on(event: Method, listener: Listener): this;
    emit(event: Method, request: Request, response: Response): boolean;
}
declare class Host extends EventEmitter {
    server: Http.Server;
    port?: number;
    settings: Settings;
    handlers: Map<Method, ListenerGroup>;
    constructor();
    listen: (port: number) => Promise<Host>;
    private request;
    get: (path: string, listener: Listener) => void;
    post: (path: string, listener: Listener) => void;
}
export default Host;
