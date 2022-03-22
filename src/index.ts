import { Server, Request } from "./classes/Server";
import Response from "./classes/Response";
import Settings from "./classes/Settings";
import Http from "http";

/**
 * Dence creator (Call signature)
 * @param adapt Http Server to host on top of
 * @returns Dence server
 */
export default function Dence(adapt?: Http.Server) {
    return new Server(adapt);
}

module.exports = Dence;
export { Server, Request, Response, Settings };