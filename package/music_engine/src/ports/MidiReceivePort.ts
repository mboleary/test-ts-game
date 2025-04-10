// import { MusicEngineMidiMessage } from "../types/MusicEngineMidiMessage.type";
import { MusicEngineNode } from "../nodes";
import { MusicEngineMidiMessage } from "../subsystem/midi/message/MusicEngineMidiMessage";
import { PortDirection } from "../types/PortDirection.enum";
import { PortType } from "../types/PortType";
import { MidiSendPort } from "./MidiSendPort";
import { MusicEnginePort } from "./Port";

export type MidiMessageReceiver = (message: MusicEngineMidiMessage, id?: string) => void;

/**
 * This port is for sending midi signals
 */
export class MidiReceivePort extends MusicEnginePort {
  constructor(
    id: string,
    node: MusicEngineNode | null,
    name: string,
    private readonly receiveHandler: MidiMessageReceiver,
    public readonly midiId?: string
  ) {
    super(id, node, name, PortDirection.IN, PortType.MIDI);
  }

  /**
   * Incoming Ports don't need to do anything, as outgoing ports are responsible for establishing the 
   * @param port 
   */
  protected handleConnect(port: MusicEnginePort): void {
  }

  protected handleDisconnect(port: MusicEnginePort): void {
    
  }

  public receive(message: MusicEngineMidiMessage) {
    this.receiveHandler(message, this.midiId);
  }
}
