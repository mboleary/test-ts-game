/**
 * Oscillator Node for Music engine
 */

import { MidiReceiver, MusicEngineMidiMessage, MusicEngineMidiMessageType } from "../types/MusicEngineMidiMessage.type";
import { noteToFrequencyEqualTemperment } from "../util/noteToFrequency";
import { MusicEngineNode } from "./MusicEngineNode";

export class MusicEngineOscillatorNode extends MusicEngineNode implements MidiReceiver {

  private oscNodes: Map<number, OscillatorNode[]> = new Map();
  constructor(
    private readonly context: AudioContext,
    type: OscillatorType,
    labels: string[],
  ) {
    super('oscillator_node', labels);
  }

  private addNodeInstance(note: number) {
    const node = new OscillatorNode(this.context);
    const arr = this.oscNodes.get(note) || [];
    arr.push(node)
    this.oscNodes.set(note, arr);
    node.addEventListener('ended', (e) => {
      node.disconnect();
      // remove node
      const idx = arr.indexOf(node);
      if (idx >= 0) {
        arr.splice(idx, 1);
      }
    });
    return node;
  }

  private getNodeInstance(note: number): OscillatorNode | null {
    const arr = this.oscNodes.get(note);
    if (!arr || arr.length === 0) return null;
    return arr[0];
  }

  private noteOn(time: number, note: number): void {
    const node = this.addNodeInstance(note);
    node.frequency.value = noteToFrequencyEqualTemperment(note);
    // @TODO implement port interface for storing node connection
    node.connect(this.context.destination);
    node.start(time);
  }

  private noteOff(time: number, note: number): void {
    const node = this.getNodeInstance(note);
    node?.stop(time);
  }

  public receive(message: MusicEngineMidiMessage): void {
    if (message.type === MusicEngineMidiMessageType.NOTE_ON && message.time !== undefined && message.key !== undefined) {
      this.noteOn(message.time, message.key);
    }
    if(message.type === MusicEngineMidiMessageType.NOTE_OFF && message.time !== undefined && message.key !== undefined) {
      this.noteOff(message.time, message.key);
    }
  }
}
