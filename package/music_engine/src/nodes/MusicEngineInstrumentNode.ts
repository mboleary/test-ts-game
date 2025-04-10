/**
 * Implements a controller for note playback
 */

import { MidiReceivePort } from "../ports/MidiReceivePort";
import { MusicEngineMidiMessageInterface, MusicEngineMidiMessageType } from "../types/MusicEngineMidiMessage.type";
import { MusicEngineNode, SerializedMusicEngineNode } from "./MusicEngineNode";

export abstract class MusicEngineInstrumentNode extends MusicEngineNode {
  constructor(
    context: AudioContext,
    name: string,
    id: string,
    type: string,
    labels: string[]
  ) {
    super(context, name, id, type, labels,);
    this.ports.push(this.midiIn);
  }

  public readonly midiIn: MidiReceivePort = new MidiReceivePort('in', this, 'Midi In', this.receive.bind(this));

  protected abstract noteOn(time: number, note: number): void;

  protected abstract noteOff(time: number, note: number): void;

  private receive(message: MusicEngineMidiMessageInterface): void {
    if (message.type === MusicEngineMidiMessageType.NOTE_ON && message.time !== undefined && message.key !== undefined) {
      this.noteOn(message.time, message.key);
    }
    if (message.type === MusicEngineMidiMessageType.NOTE_OFF && message.time !== undefined && message.key !== undefined) {
      this.noteOff(message.time, message.key);
    }
  }

  public abstract toJSON(): SerializedMusicEngineNode;
}
