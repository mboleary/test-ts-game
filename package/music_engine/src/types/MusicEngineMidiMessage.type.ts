export enum MusicEngineMidiMessageType {
  NOTE_ON = 'NOTE_ON',
  NOTE_OFF = 'NOTE_OFF',
  CONTROL_CHANGE = 'CONTROL_CHANGE'
};

export interface MusicEngineMidiMessage {
  time?: number;
  type: MusicEngineMidiMessageType;
  key?: number;
  velocity?: number;
  controller?: number;
  channel?: number;
}

export interface MidiNoteOnMessage extends MusicEngineMidiMessage {
  type: MusicEngineMidiMessageType.NOTE_ON;
}

export type MidiReceiver = {
  receive(message: MusicEngineMidiMessage): void;
}

export type MidiTransmitter = {
  transmit(): MusicEngineMidiMessage;
}
