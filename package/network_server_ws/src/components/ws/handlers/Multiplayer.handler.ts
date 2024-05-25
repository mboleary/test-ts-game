import { MalformedMessageError } from "../errors/MalformedMessage.error";
import { WebsocketMessageHandler } from "./WebsocketMessageHandler";
import { MessageData } from "./types/MessageData.interface";

export class MultiplayerHandler extends WebsocketMessageHandler {
  constructor() {
    super();
  }

  public handle(message: MessageData): void {
    switch(message.type) {
      case "message": this.handleMessage(message); break;
      default: throw new MalformedMessageError(`Unknown message type ${message.type}`);
    }
  }

  public async handleMessage(message: MessageData): Promise<any> {

  }

  public async createHandler(message: MessageData): Promise<any> {

  }

  public async readHandler(message: MessageData): Promise<any> {

  }

  public async updateHandler(message: MessageData): Promise<any> {

  }

  public async deleteHandler(message: MessageData): Promise<any> {

  }
}
