import { MusicEngineMidiMessageInterface as MusicEngineMidiMessageObjectType, MusicEngineMidiMessageType } from "../../../types/MusicEngineMidiMessage.type";
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

  public abstract toBytes(): Uint8Array;

  public toString(): string {
    return `Midi message: ${this.type.toLowerCase()} ${this.channel} ${this.key !== undefined ? this.key : this.controller} +${this.time}`;
  }
}
