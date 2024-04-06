import { Server } from "http";
import { Server as WebsocketServer } from "ws";
// import Layer from "express/lib/router/layer";
import { match } from "path-to-regexp";

/**
 * At some point in the future, refactor this to use decorators and generally be cleaner
 */

export type WebsocketConnectionArgs = {

}

/**
 * Initialize Websocket Server 
 * @param server HTTP Server
 */

export function initWebsocketServer(server: Server) {
  const websocketServer = new WebsocketServer({ noServer: true });

  server.on("upgrade", async function (req, sock, head) {
    // Check the URL to join the correct room

    const args = {};

    // URL should be a GET request and look like this: /ws/:room-id

    // let lyr = Layer("/ws/:id", {},  function a() {});

    // let match = lyr.match(req.url);

    // let params = lyr.params;

    if (!req.url) {
      sock.destroy();
      return;
    }

    const matchFunc = match("/ws/:id", { decode: decodeURIComponent });
    const matchResults = matchFunc(req.url);

    if (matchResults === false) {
      sock.destroy();
      return;
    }

    const params = matchResults.params as Record<string, string>;

    // Check for room

    // const room = Rooms.getRoom(params.id)

    if (!params.id) {
      console.log("Room not created:", params);
      sock.destroy();
      return;
    }

    // args.room = room;

    // Parse URL

    // const url = new URL(req.url, `ws://${req.headers.host}`);

    // if (url.searchParams) {
    //   args.name = url.searchParams.name;
    // }

    websocketServer.handleUpgrade(req, sock, head, function (ws) {
      websocketServer.emit("connection", ws, req, args);
    });

    
  });
}
