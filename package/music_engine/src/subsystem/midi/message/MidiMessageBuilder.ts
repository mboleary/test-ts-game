import { MusicEngineMidiMessage as MusicEngineMidiMessageObjectType, MusicEngineMidiMessageType } from "../../../types/MusicEngineMidiMessage.type";
import { MidiNoteOffMessage } from "./MidiNoteOffMessage";
import { MidiNoteOnMessage } from "./MidiNoteOnMessage";
import { MusicEngineMidiMessage } from "./MusicEngineMidiMessage";

/**
 * Builds midi messages from either a plain object or midi event bytes
 */
export class MidiMessageBuilder {
  public static from(json: MusicEngineMidiMessageObjectType): MusicEngineMidiMessage {
    switch(json.type) {
      case MusicEngineMidiMessageType.NOTE_ON:
        return MidiNoteOnMessage.from(json);
      case MusicEngineMidiMessageType.NOTE_OFF:
        return MidiNoteOffMessage.from(json);
      default:
        throw new Error(`Unknown message type ${json.type}`);
    }
  }

  public static fromBytes(bytes: Uint8Array): MusicEngineMidiMessage {
    const statusByte = bytes[0] >> 4;
    switch(statusByte) {
      case 0x8:
        return MidiNoteOffMessage.fromBytes(bytes);
      case 0x9:
        return MidiNoteOnMessage.fromBytes(bytes);
      default:
        throw new Error(`Unknown status code ${statusByte}`);
    }
  }
}
