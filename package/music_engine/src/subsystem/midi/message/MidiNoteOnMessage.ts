import { MusicEngineMidiMessageInterface as MusicEngineMidiMessageObjectType, MusicEngineMidiMessageType } from "../../../types/MusicEngineMidiMessage.type";
import { MusicEngineMidiMessage } from "./MusicEngineMidiMessage";

export class MidiNoteOnMessage extends MusicEngineMidiMessage {
  constructor(
    public readonly key: number,
    public readonly velocity: number,
    time?: number, 
    channel?: number
  ) {
    super(MusicEngineMidiMessageType.NOTE_ON, time, channel);
  }

  public toBytes(): Uint8Array {
    const statusByte = 0x90 + (this.channel & 0xF);
    return new Uint8Array([statusByte, this.key, this.velocity]);
  }

  public static fromBytes(bytes: Uint8Array, offset: number = 0): MidiNoteOnMessage {
    if (bytes[0] < 0x90 || bytes[0] > 0x9F) {
      throw new Error(`Not NOTE_ON message, expected 0x9N, received ${bytes[0]}`);
    }
    const channel = bytes[0] & 0xF;
    const key = bytes[1];
    const velocity = bytes[2];
    return new MidiNoteOnMessage(key, velocity, offset, channel);
  }

  public static from(json: Partial<MusicEngineMidiMessageObjectType>): MidiNoteOnMessage {
    if (json.key === undefined || json.velocity === undefined) {
      throw new Error("key or velocity undefined");
    }
    return new MidiNoteOnMessage(json.key, json.velocity, json.time, json.channel);
  }
}
