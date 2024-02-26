/**
 * Implements a controller for note playback
 */

import { MidiReceiver, MusicEngineMidiMessage, MusicEngineMidiMessageType } from "../types/MusicEngineMidiMessage.type";
import { MusicEngineNode } from "./MusicEngineNode";

export abstract class MusicEngineInstrumentNode extends MusicEngineNode implements MidiReceiver {
  constructor(
    context: AudioContext,
    name: string,
    type: string,
    labels: string[]
  ) {
    super(context, name, type, labels);
  }

  protected abstract noteOn(time: number, note: number): void;

  protected abstract noteOff(time: number, note: number): void;

  public receive(message: MusicEngineMidiMessage): void {
    if (message.type === MusicEngineMidiMessageType.NOTE_ON && message.time !== undefined && message.key !== undefined) {
      this.noteOn(message.time, message.key);
    }
    if(message.type === MusicEngineMidiMessageType.NOTE_OFF && message.time !== undefined && message.key !== undefined) {
      this.noteOff(message.time, message.key);
    }
  }
}
