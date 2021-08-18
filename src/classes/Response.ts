import { existsSync, readFileSync } from "fs";
import { ServerResponse } from "http";
import { ContentType, CORSHeaders, InferContentTypeFromFilename } from "../Constants";
import { Server } from "./Server";

declare interface Response {
    setHeader(header: 'Content-Type', value: ContentType): Response;
    setHeader(header: 'Age', value: `Age: ${number}`): Response;
    setHeader(header: CORSHeaders, value: `${CORSHeaders}: ${'*' | string}`): Response
}

class Response {

    private server: Server;
    private raw: ServerResponse;
    private ended: boolean;

    constructor(server: Server, raw: ServerResponse) {

        this.raw = raw;
        this.ended = false;
        this.server = server;

    }

    public status(code: number): Response {

        if (this.ended) throw new TypeError("Response already concluded.");
        if (isNaN(code) || !isFinite(code) || parseInt(code.toString()) != code) {
            throw new TypeError("Invalid status code: " + code);
        }

        this.raw.statusCode = code;
        return this;

    }

    public json(json: object, extended: boolean = false): Response {

        if (this.ended) throw new TypeError("Response already concluded.");

        if (!this.raw.getHeader('Content-Type')) this.setHeader('Content-Type', 'application/json');
        this.raw.write(!extended ? JSON.stringify(json) : JSON.stringify(json, null, 4), "utf8");
        this.end();

        return this;

    }

    public text(text: string): Response {

        if (this.ended) throw new TypeError("Response already concluded.");

        if (!this.raw.getHeader('Content-Type')) this.setHeader('Content-Type', 'text/plain');

        this.raw.write(text);
        this.end();

        return this;

    }

    public sendFile(path: string, args: object = {}): Response {

        if (this.ended) throw new TypeError("Response already concluded.");
        if (!existsSync(path)) throw new TypeError("No file exists at path: " + path);

        let { content, content_type } = this.server.modify_file_mixin(path, readFileSync(path).toString('utf-8'), args);
        if (!this.raw.getHeader('Content-Type')) this.setHeader('Content-Type', content_type ?? InferContentTypeFromFilename(path));

        this.raw.write(content);
        this.end();

        return this;

    }

    public setHeader(header: string, value: string): Response {

        this.raw.setHeader(header, value);
        return this;

    }

    public end(text?: string) {

        if (this.ended) return;

        if (!this.raw.getHeader('Content-Type')) this.setHeader('Content-Type', 'text/plain');
        if (text) this.text(text);

        this.raw.end();
        this.ended = true;

    }

    public concluded(): boolean {
        return this.ended;
    }

}

export default Response;