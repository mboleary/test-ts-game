export const enum MusicEngineMidiMessageType {
  NOTE_ON = 'NOTE_ON',
  NOTE_OFF = 'NOTE_OFF',
  CONTROL_CHANGE = 'CONTROL_CHANGE'
};

export interface MusicEngineMidiMessageInterface {
  time?: number;
  type: MusicEngineMidiMessageType;
  key?: number;
  velocity?: number;
  controller?: number;
  channel?: number;
}

export interface MidiNoteOnMessageInterface extends MusicEngineMidiMessageInterface {
  type: MusicEngineMidiMessageType.NOTE_ON;
}

// export type MidiReceiver = {
//   receive(message: MusicEngineMidiMessage): void;
// }

// export type MidiTransmitter = {
//   transmit(): MusicEngineMidiMessage;
// }
