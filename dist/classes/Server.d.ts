/// <reference types="node" />
import EventEmitter from "events";
import { IncomingHttpHeaders } from "http";
import Response from "./Response";
import Settings from "./Settings";
export declare type Request = {
    server: Server;
    path: string;
    body: string;
    query: {
        [key: string]: string | boolean | Array<string | boolean>;
    };
    method: Method;
    param: {
        [parameter: string]: string;
    };
    headers: IncomingHttpHeaders;
};
export declare type Method = 'POST' | 'GET';
export declare type Listener = (request: Request, response: Response) => void;
export declare type Mixin = {
    priority: number;
    modify?: (request: Request, response: Response) => {
        request: Request;
        response: Response;
    };
    modify_file?: (file_name: string, content: Buffer, args: object) => {
        content?: Buffer;
        content_type?: string;
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
    private modify_mixins;
    modify_file_mixin: (file_name: string, content: Buffer, args: object) => {
        content: Buffer;
        content_type: string | undefined;
    };
}
export { Server };
