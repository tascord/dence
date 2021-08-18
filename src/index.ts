import { Server } from "./classes/Server";
import Response from "./classes/Response";
import Settings from "./classes/Settings";

function Dence() {
    return new Server();
}

export { Dence, Server, Response, Settings };