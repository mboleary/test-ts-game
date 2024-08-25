import { PortDirection } from "../types/PortDirection.enum";
import { PortType } from "../types/PortType";
import { MusicEnginePort } from "./Port";
import { TriggerReceivePort } from "./TriggerReceivePort";

export class TriggerSendPort extends MusicEnginePort {
  constructor(
    name: string,
  ) {
    super(name, PortDirection.OUT, PortType.TRIGGER);
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
