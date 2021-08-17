/// <reference types="node" />
import { ServerResponse } from "http";
import { ContentType, CORSHeaders } from "../Constants";
declare interface Response {
    setHeader(header: 'Content-Type', value: ContentType): Response;
    setHeader(header: 'Age', value: `Age: ${number}`): Response;
    setHeader(header: CORSHeaders, value: `${CORSHeaders}: ${'*' | string}`): Response;
}
declare class Response {
    raw: ServerResponse;
    ended: boolean;
    constructor(raw: ServerResponse);
    status(code: number): Response;
    json(object: Object, extended?: boolean): Response;
    end(): void;
}
export default Response;
