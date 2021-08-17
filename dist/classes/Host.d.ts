/// <reference types="node" />
import EventEmitter from "events";
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
declare interface Host {
    on(event: Method, listener: Listener): this;
    emit(event: Method, request: Request, response: Response): boolean;
}
declare class Host extends EventEmitter {
    private server;
    port?: number;
    settings: Settings;
    private handlers;
    constructor();
    listen: (port: number) => Promise<Host>;
    private request;
    get: (path: string, listener: Listener) => void;
    post: (path: string, listener: Listener) => void;
}
export default Host;
