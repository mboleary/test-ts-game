/**
 * Oscillator Node for Music engine
 */

import { AudioParamPort } from "../ports/AudioParamPort";
import { AudioPort } from "../ports/AudioPort";
import { PortDirection } from "../types/PortDirection.enum";
import { noteToFrequencyEqualTemperment } from "../util/noteToFrequency";
import { MusicEngineInstrumentNode } from "./MusicEngineInstrumentNode";

const TYPE = 'oscillator_node';

export class MusicEngineOscillatorNode extends MusicEngineInstrumentNode {

  private readonly oscNodes: Map<number, OscillatorNode> = new Map();
  private readonly activeNotes: OscillatorNode[] = [];

  constructor(
    context: AudioContext,
    private readonly oscType: OscillatorType = 'sine',
    name: string = '',
    labels: string[] = [],
  ) {
    super(context, name, TYPE, labels);
    this.gainNode = context.createGain();
    this.gain = this.gainNode.gain;
    this.audioOut.registerAudioNode(this.gainNode);
  }

  // public readonly volume: AudioParam = new AudioParamPort('volume', PortDirection.IN, 0.5);
  private readonly gainNode: GainNode;

  public readonly gain: AudioParam;
  public readonly detune: AudioParamPort = new AudioParamPort('detune', PortDirection.IN, 0);

  public readonly audioOut: AudioPort = new AudioPort('audio', PortDirection.OUT);

  protected noteOn(time: number, note: number): void {
    const node = new OscillatorNode(this.context);
    node.type = this.oscType;
    this.activeNotes.push(node)
    this.oscNodes.set(note, node);
    const freq = noteToFrequencyEqualTemperment(note);
    node.frequency.value = freq;
    this.detune.registerAudioParam(node.detune);
    node.addEventListener('ended', (e) => {
      const t = e.target as OscillatorNode;
      // remove node from active nodes
      const activeNoteIdx = this.activeNotes.indexOf(t);
      if (activeNoteIdx >= 0) {
        this.activeNotes.splice(activeNoteIdx, 1);
      }
      this.detune.unregisterAudioParam(t.detune);
      t.disconnect();
    });
    // @TODO implement port interface for storing node connection
    node.connect(this.gainNode);
    node.start(time);
  }

  protected noteOff(time: number, note: number): void {
    const node = this.oscNodes.get(note);
    if (node) {
      node.stop(time);
      // Remove node from scheduling map
      this.oscNodes.delete(note);
    } else {
      console.warn("no node for note", note, time);
    }
  }
}
