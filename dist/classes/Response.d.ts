/// <reference types="node" />
import { ServerResponse } from "http";
import { ContentType, CORSHeaders } from "../Constants";
import { Server } from "./Server";
declare interface Response {
    setHeader(header: 'Content-Type', value: ContentType): Response;
    setHeader(header: 'Age', value: `Age: ${number}`): Response;
    setHeader(header: CORSHeaders, value: `${CORSHeaders}: ${'*' | string}`): Response;
}
declare class Response {
    private server;
    private raw;
    private ended;
    constructor(server: Server, raw: ServerResponse);
    status(code: number): Response;
    json(json: object, extended?: boolean): Response;
    text(text: string): Response;
    sendFile(path: string, args?: object): Response;
    end(text?: string): void;
    concluded(): boolean;
}
export default Response;
