import { MusicEngineMidiMessageInterface, MusicEngineMidiMessageType } from "../../../types/MusicEngineMidiMessage.type";

export function buildMidiBytes(message: MusicEngineMidiMessageInterface): Uint8Array {
  switch (message.type) {
    case MusicEngineMidiMessageType.NOTE_ON: 
      return noteOn(message);
    case MusicEngineMidiMessageType.NOTE_OFF: 
      return noteOff(message);
    default:
      return new Uint8Array();

  }
}

function noteOn(message: MusicEngineMidiMessageInterface) {
  const statusByte = 0x90 + ((message.channel || 0) & 0xF);
  return new Uint8Array([statusByte, message.key || 0x00, message.velocity || 0x00]);
}

function noteOff(message: MusicEngineMidiMessageInterface) {
  const statusByte = 0x80 + ((message.channel || 0) & 0xF);
  return new Uint8Array([statusByte, message.key || 0x00, message.velocity || 0x00]);
}
