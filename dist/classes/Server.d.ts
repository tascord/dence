/// <reference types="node" />
import EventEmitter from "events";
import Response from "./Response";
import Settings from "./Settings";
export declare type Request = {
    app: Server;
    path: string;
    body: string;
    query: {
        [key: string]: string | boolean | Array<string | boolean>;
    };
    param: {
        [parameter: string]: string;
    };
};
export declare type Method = 'POST' | 'GET';
export declare type Listener = (request: Request, response: Response) => void;
export declare type Mixin = {
    priority: number;
    modify: (request: Request, response: Response) => {
        request: Request;
        response: Response;
    };
};
declare interface Server {
    on(event: Method, listener: Listener): this;
    emit(event: Method, request: Request, response: Response): boolean;
}
declare class Server extends EventEmitter {
    private server;
    port?: number;
    settings: Settings;
    private handlers;
    private mixins;
    constructor();
    listen: (port: number) => Promise<Server>;
    private request;
    get: (path: string, listener: Listener) => void;
    post: (path: string, listener: Listener) => void;
    private run_handler;
    static path_matcher: (path: string) => RegExp;
    register_mixin: (mixin: Mixin) => void;
    private run_mixins;
}
export { Server };
