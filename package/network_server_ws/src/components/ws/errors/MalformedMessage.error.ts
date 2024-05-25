import { WebsocketHandlerError } from "./WebsocketHandler.error";

export class MalformedMessageError extends WebsocketHandlerError {
  message: string = "Message is malformed";
  code = super.code + ".malformed_message";
}
