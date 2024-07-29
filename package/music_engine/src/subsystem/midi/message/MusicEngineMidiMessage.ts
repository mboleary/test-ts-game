import { MusicEngineMidiMessage as MusicEngineMidiMessageObjectType, MusicEngineMidiMessageType } from "../../../types/MusicEngineMidiMessage.type";
// import { MidiNoteOffMessage } from "./MidiNoteOffMessage";
// import { MidiNoteOnMessage } from "./MidiNoteOnMessage";

export abstract class MusicEngineMidiMessage implements MusicEngineMidiMessageObjectType {
  public readonly key?: number | undefined; // key pressed
  public readonly velocity?: number | undefined; // velocity at which key pressed
  public readonly controller?: number | undefined; // controller changed
  public readonly data?: number | undefined; // controller data
  
  constructor(
    public readonly type: MusicEngineMidiMessageType,
    public readonly time: number = 0,
    public readonly channel: number = 0,
  ) {}

  public static from(json: MusicEngineMidiMessageObjectType): MusicEngineMidiMessage {
    switch(json.type) {
      // case MusicEngineMidiMessageType.NOTE_ON:
      //   return MidiNoteOnMessage.from(json);
      // case MusicEngineMidiMessageType.NOTE_OFF:
      //   return MidiNoteOffMessage.from(json);
      default:
        throw new Error(`Unknown message type ${json.type}`);
    }
  }

  public static fromBytes(bytes: Uint8Array): MusicEngineMidiMessage {
    const statusByte = bytes[0] >> 1;
    switch(statusByte) {
      // case 0x8:
      //   return MidiNoteOffMessage.fromBytes(bytes);
      // case 0x9:
      //   return MidiNoteOnMessage.fromBytes(bytes);
      default:
        throw new Error(`Unknown status code ${statusByte}`);
    }
  }

  public abstract toBytes(): Uint8Array;

  public toString(): string {
    return `Midi message: ${this.type.toLowerCase()} ${this.channel} ${this.key !== undefined ? this.key : this.controller} +${this.time}`;
  }
}
