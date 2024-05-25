import { IncomingMessage, Server } from "http";
import { injectable } from "inversify";
import WebSocket, { WebSocketServer } from "ws";
import { Logger } from "../logger/Logger";
import { websocketServerOptionsDefault } from "./defaults/websocketServerOptions.default";
import { MalformedMessageError } from "./errors/MalformedMessage.error";
import { WebsocketMessageHandler } from "./handlers/WebsocketMessageHandler";
import { parseUrlQueryParams, urlMatches } from "./helpers";

export type WebSocketServerOptions = {
  path: string;
  refreshInterval: number;
}

export type WebsocketServerRequestContext = {
  params: Record<string, string>,
  queryParams: Record<string, string[]>
}

type WebsocketWithPing = WebSocket & {
  isAlive: boolean,
  latency: number,
  pingSendTime: number,
  pingRecieveTime: number
};

@injectable()
export class WebsocketServerComponent {
  public wss: WebSocketServer;
  constructor(
    server: Server,
    private messageHandler: WebsocketMessageHandler,
    private logger: Logger,
    {
      path,
      refreshInterval,
    } = websocketServerOptionsDefault
  ) {
    const wss = new WebSocketServer({ noServer: true });
    this.wss = wss;
    server.on("upgrade", async function(req, sock, head) {
      const args: WebsocketServerRequestContext = {
        params: {},
        queryParams: {}
      }

      if (!req.url) {
        sock.destroy();
        return;
      }

      const params = urlMatches(path, req.url);
      if (params.match === false) {
        sock.destroy();
        return;
      }

      args.params = params.params as Record<string, string>;
      args.queryParams = parseUrlQueryParams(req.url, req.headers.host || "/");

      wss.handleUpgrade(req, sock, head, function (ws) {
        wss.emit("connection", ws, req, args);
      });
    });
    wss.on("connection", this.handleConnection.bind(this));
    // Check connection status, remove disconnected clients
    const interval = setInterval(function ping() {
      (wss.clients as Set<WebsocketWithPing>).forEach(function each(ws) {
          if (ws.isAlive === false) return ws.terminate();
          ws.isAlive = false;
          // Also check latency
          ws.latency = -1;
          ws.pingSendTime = performance.now();
          ws.pingRecieveTime = -1;
          ws.ping();
      });
  }, refreshInterval);
    wss.on("close", function() {
      clearInterval(interval);
    });
  }

  public getClients(): WebSocket[] {
    return Array.from(this.wss.clients.values());
  }

  private handleConnection
  (
    ws: WebsocketWithPing,
    req: IncomingMessage,
    context: WebsocketServerRequestContext
  ) {
    // @TODO track client
    this.logger.debug(`wss: Client Connected ${context}`);

    // Track connection status
    ws.isAlive = true;
    ws.on("pong", function heartbeat() {
      const wsPing = (this as WebsocketWithPing);
      wsPing.pingRecieveTime = performance.now();
      wsPing.latency = ws.pingRecieveTime - ws.pingSendTime;
      wsPing.isAlive = true;
    });

    // Handle messages
    ws.on("message", (message) => {
      try {
        const input = message.toString();
        this.logger.debug(`ws message received: ${input}`);
        const response = this.handleMessage(input);
        this.logger.debug(`ws message response: ${response}`);
        ws.send(this.buildResponseObject(JSON.stringify(response)));
      } catch(err: any) {
        ws.send(JSON.stringify(this.buildResponseObject(null, err)));
      }
    });

    // Handle Errors
    ws.on('error', (error) => {
      this.logger.error(`ws: Error from client: ${error.toString()}`);
    });
  }

  private async handleMessage(mesage: string) {
    let parsedMessageData;
    try {
      parsedMessageData = JSON.parse(mesage);
    } catch (err) {
      throw new MalformedMessageError(`Received invalid JSON message`);
    }

    await this.messageHandler.handle(parsedMessageData);
  }

  private buildResponseObject(data: any, error: any = null): any {
    return {
      data: data ? data : undefined,
      error: error ? error : undefined,
      success: !error
    };
  }
}
