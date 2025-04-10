// import { MusicEngineMidiMessage } from "../types/MusicEngineMidiMessage.type";
import { MusicEngineNode } from "../nodes";
import { MusicEngineMidiMessage } from "../subsystem/midi/message/MusicEngineMidiMessage";
import { PortDirection } from "../types/PortDirection.enum";
import { PortType } from "../types/PortType";
import { MidiReceivePort } from "./MidiReceivePort";
import { MusicEnginePort } from "./Port";

/**
 * This port is for sending midi signals
 */
export class MidiSendPort extends MusicEnginePort {
  constructor(
    id: string,
    node: MusicEngineNode | null,
    name: string,
    public readonly midiId?: string
  ) {
    super(id, node, name, PortDirection.OUT, PortType.MIDI);
  }

  protected handleConnect(port: MidiReceivePort): void {
    
  }

  protected handleDisconnect(port: MidiReceivePort): void {
    
  }

  public send(message: MusicEngineMidiMessage) {
    for (const port of this.getConnectedPorts() as MidiReceivePort[]) {
      port.receive(message);
    }
  }
}
