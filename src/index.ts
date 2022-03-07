import { Server, Request } from "./classes/Server";
import Response from "./classes/Response";
import Settings from "./classes/Settings";

export default function Dence() {
    return new Server();
}

module.exports = Dence;
export { Server, Request, Response, Settings };