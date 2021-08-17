import { existsSync, readFileSync } from "fs";
import { ServerResponse } from "http";
import { ContentType, CORSHeaders, InferContentTypeFromFilename } from "../Constants";

declare interface Response {
    setHeader(header: 'Content-Type', value: ContentType): Response;
    setHeader(header: 'Age', value: `Age: ${number}`): Response;
    setHeader(header: CORSHeaders, value: `${CORSHeaders}: ${'*' | string}`): Response
}

class Response {

    private raw: ServerResponse;
    private ended: boolean;

    constructor(raw: ServerResponse) {

        this.raw = raw;
        this.ended = false;

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

    public sendFile(path: string): Response {

        if (this.ended) throw new TypeError("Response already concluded.");
        if (!existsSync(path)) throw new TypeError("No file exists at path: " + path);

        if (!this.raw.getHeader('Content-Type')) this.setHeader('Content-Type', InferContentTypeFromFilename(path));

        this.raw.write(readFileSync(path));
        this.end();

        return this;

    }

    public setHeader(header: string, value: string): Response {

        this.raw.setHeader(header, value);
        return this;

    }

    public end() {

        if (this.ended) return;

        if (!this.raw.getHeader('Content-Type')) this.raw.setHeader('Content-Type', 'text/plain');

        this.raw.end();
        this.ended = true;

    }

}

export default Response;