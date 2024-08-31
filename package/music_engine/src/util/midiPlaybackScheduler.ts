/**
 * Contains functions to schedule notes on a AudioScheduledSourceNode
 */

import { MusicEngineMidiMessageInterface, MusicEngineMidiMessageType } from "../types/MusicEngineMidiMessage.type";
import { noteToFrequencyEqualTemperment } from "./noteToFrequency";

export function scheduleNote(
  midiMessage: MusicEngineMidiMessageInterface, 
  context: AudioContext,
  node: AudioScheduledSourceNode & {frequency: AudioParam},
): void {
  if (midiMessage.type === MusicEngineMidiMessageType.NOTE_ON) {
    if (!midiMessage.key) {
      throw new Error(`Missing 'key' in midi message`);
    }
    if (midiMessage.time) {
      node.start(midiMessage.time);
      node.frequency.setValueAtTime(
        noteToFrequencyEqualTemperment(midiMessage.key),
        midiMessage.time
      )
    } else {
      node.start();
      node.frequency.setValueAtTime(
        noteToFrequencyEqualTemperment(midiMessage.key),
        context.currentTime
      );
    }
  }
}
