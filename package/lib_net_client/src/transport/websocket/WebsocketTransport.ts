import { MessageData } from "../../netTypes/MessageData.type";
import { MessageType } from "../../netTypes/MessageType.enum";
import { Component } from "../../type/Component";
import { EntityMetadata } from "../../type/EntityMetadata";
import { ComponentSetCallback, ComponentUnsetCallback, EntityCreateCallback, EntityDeleteCallback, MessageCallback, Transport } from "../../type/Transport.interface";

export class WebsocketTransport implements Transport {
  private readonly websocket: WebSocket;
  constructor(
    public readonly url: string,

  ) {
    this.websocket = new WebSocket(url);
    this.websocket.onmessage = this.websocketHandler.bind(this);
  }

  private clientMessageNumber: number = 0;
  private serverMessageNumber = 0;

  // Store messages that are awaiting a response
  private readonly messageResponseMap: Map<number, Promise<MessageData>> = new Map();
  private readonly messageRequestMap: Map<number, MessageData> = new Map();

  private websocketHandler(message: MessageEvent) {
    if (!message) {
      console.warn("Empty message received");
      return;
    }
    let parsed: MessageData;

    try {
      parsed = JSON.parse(message.data);
    } catch (err) {
      console.error("Websocket handler error on message parse:", err, message);
      return;
    }

    if (parsed.messageNumber !== undefined && this.messageRequestMap.has(parsed.messageNumber)) {
      // if (parsed.type === MessageType.MESSAGE || parsed.type === MessageType.)
    }

    // @TODO parse the message and write to the proper callback function
    switch (parsed.type) {
      case (MessageType.READ): 
    }

  }

  public onEntityCreate: EntityCreateCallback = () => {};
  public onEntityDelete: EntityDeleteCallback = () => {};
  public onComponentSet: ComponentSetCallback = () => {};
  public onComponentUnset: ComponentUnsetCallback = () => {};
  public onMessage: MessageCallback = () => {};

  /**
   * Methods to send commands to the server
   */

  entityCreate(id: string, components: Component<any>[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
  entityGet(id: string): Promise<string[] | null> {
    throw new Error("Method not implemented.");
  }
  entityGetIds(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  entityGetMetadata(id: string): Promise<EntityMetadata> {
    throw new Error("Method not implemented.");
  }
  entityDelete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  entitySubscribe(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  entityUnsubscribe(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  componentSet<T>(entityId: string, key: string, value: T): Promise<void> {
    throw new Error("Method not implemented.");
  }
  componentUnset(entityId: string, key: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  componentGet<T>(entityId: string, key: string): Promise<T> {
    throw new Error("Method not implemented.");
  }
  message<T, R>(targetClientId: string, data: T): Promise<R> {
    throw new Error("Method not implemented.");
  }


}
