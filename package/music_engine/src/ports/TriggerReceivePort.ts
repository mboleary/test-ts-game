import { MusicEngineNode } from "../nodes";
import { PortDirection } from "../types/PortDirection.enum";
import { PortType } from "../types/PortType";
import { MusicEnginePort } from "./Port";

export type TriggerReceiver = (time: number) => void;

export class TriggerReceivePort extends MusicEnginePort {
  constructor(
    id: string,
    node: MusicEngineNode | null,
    name: string,
    private readonly receiveHandler: TriggerReceiver,
  ) {
    super(id, node, name, PortDirection.IN, PortType.TRIGGER);
  }

  protected handleConnect(port: MusicEnginePort): void {
    
  }

  protected handleDisconnect(port: MusicEnginePort): void {
    
  }

  public receive(time: number = 0) {
    this.receiveHandler(time);
  }
}
