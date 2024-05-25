import { WebSocketServerOptions } from "../WebsocketServer";

export const websocketServerOptionsDefault: WebSocketServerOptions = {
  path: "/",
  refreshInterval: 30000 // 30 seconds
}
