import { MusicEngineMidiMessage } from "../types/MusicEngineMidiMessage.type";
import { PortDirection } from "../types/PortDirection.enum";
import { PortType } from "../types/PortType";
import { MidiSendPort } from "./MidiSendPort";
import { MusicEnginePort } from "./Port";

export type MidiMessageReceiver = (message: MusicEngineMidiMessage) => void;

/**
 * This port is for sending midi signals
 */
export class MidiReceivePort extends MusicEnginePort {
  constructor(
    name: string,
    private readonly receiveHandler: MidiMessageReceiver,
  ) {
    super(name, PortDirection.IN, PortType.MIDI);
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
    this.receiveHandler(message);
  }
}
