import { ServerResponse } from "http";
import { ContentType, CORSHeaders } from "../Constants";

declare interface Response {
    setHeader(header: 'Content-Type', value: ContentType): Response;
    setHeader(header: 'Age', value: `Age: ${number}`): Response;
    setHeader(header: CORSHeaders, value: `${CORSHeaders}: ${'*' | string}`): Response
}

class Response {

    raw: ServerResponse;
    ended: boolean;

    constructor(raw: ServerResponse) {

        this.raw = raw;
        this.ended = false;

    }

    status(code: number): Response {

        if (this.ended) throw new TypeError("Response already concluded.");
        if (isNaN(code) || !isFinite(code) || parseInt(code.toString()) != code) {
            throw new TypeError("Invalid status code: " + code);
        }

        this.raw.statusCode = code;
        return this;

    }

    json(object: Object, extended: boolean = false): Response {

        if (this.ended) throw new TypeError("Response already concluded.");

        this.raw.setHeader('Content-Type', 'application/json');
        this.raw.write(!extended ? JSON.stringify(object) : JSON.stringify(object, null, 4), "utf8");
        this.end();

        return this;

    }

    setHeader(header: string, value: string): Response {

        this.raw.setHeader(header, value);
        return this;

    }

    end() {

        if (this.ended) return;

        if (!this.raw.getHeader('Content-Type')) this.raw.setHeader('Content-Type', 'text/plain');

        this.raw.end();
        this.ended = true;

    }

}

export default Response;