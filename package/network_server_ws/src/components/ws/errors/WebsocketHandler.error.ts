export class WebsocketHandlerError extends Error {
  code: string = "error.websocket";
  message: string = "Internal Server Error";
}
