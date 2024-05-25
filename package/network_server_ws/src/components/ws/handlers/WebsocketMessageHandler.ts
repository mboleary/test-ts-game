export abstract class WebsocketMessageHandler {
  constructor() {}

  public abstract handle(message: any): void;
}
