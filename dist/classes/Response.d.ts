/// <reference types="node" />
import { ServerResponse } from "http";
import { ContentType, CORSHeaders } from "../Constants";
declare interface Response {
    setHeader(header: 'Content-Type', value: ContentType): Response;
    setHeader(header: 'Age', value: `Age: ${number}`): Response;
    setHeader(header: CORSHeaders, value: `${CORSHeaders}: ${'*' | string}`): Response;
}
declare class Response {
    private raw;
    private ended;
    constructor(raw: ServerResponse);
    status(code: number): Response;
    json(json: object, extended?: boolean): Response;
    text(text: string): Response;
    sendFile(path: string): Response;
    end(text?: string): void;
}
export default Response;
