import { MusicEngineNode } from "../nodes";
import { PortDirection } from "../types/PortDirection.enum";
import { PortType } from "../types/PortType";
import { MusicEnginePort } from "./Port";
import { TriggerReceivePort } from "./TriggerReceivePort";

export class TriggerSendPort extends MusicEnginePort {
  constructor(
    id: string,
    node: MusicEngineNode | null,
    name: string,
  ) {
    super(id, node, name, PortDirection.OUT, PortType.TRIGGER);
  }

  protected handleConnect(port: MusicEnginePort): void {
    
  }

  protected handleDisconnect(port: MusicEnginePort): void {
    
  }

  public send(time: number = 0) {
    for (const port of this.getConnectedPorts() as TriggerReceivePort[]) {
      port.receive(time);
    }
  }
}
