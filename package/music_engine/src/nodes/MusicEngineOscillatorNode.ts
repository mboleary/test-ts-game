/**
 * Oscillator Node for Music engine
 */

import { nanoid } from "nanoid/non-secure";
import { AudioParamPort } from "../ports/AudioParamPort";
import { AudioPort } from "../ports/AudioPort";
import { PortDirection } from "../types/PortDirection.enum";
import { noteToFrequencyEqualTemperment } from "../util/noteToFrequency";
import { MusicEngineInstrumentNode } from "./MusicEngineInstrumentNode";
import { SerializedMusicEngineNode } from "./MusicEngineNode";

const TYPE = 'oscillator_node';

export type SerializedMusicEngineOscillatorNode = SerializedMusicEngineNode & {
  type: typeof TYPE,
  oscType: OscillatorType,
};

export class MusicEngineOscillatorNode extends MusicEngineInstrumentNode {

  static type = TYPE;

  private readonly oscNodes: Map<number, OscillatorNode> = new Map();
  private readonly activeNotes: OscillatorNode[] = [];

  constructor(
    context: AudioContext,
    private readonly oscType: OscillatorType = 'sine',
    name: string = '',
    id: string = nanoid(),
    labels: string[] = [],
  ) {
    super(context, name, id, TYPE, labels);
    this.gainNode = context.createGain();
    this.gain = this.gainNode.gain;
    this.audioOut.registerAudioNode(this.gainNode);

    // Ports
    this.ports.push(this.audioOut, this.detune);
  }

  

  // public readonly volume: AudioParam = new AudioParamPort('volume', PortDirection.IN, 0.5);
  private readonly gainNode: GainNode;

  public readonly gain: AudioParam;
  public readonly detune: AudioParamPort = new AudioParamPort('detune', this, 'Detune', PortDirection.IN, 0);

  public readonly audioOut: AudioPort = new AudioPort('audio', this, 'Audio', PortDirection.OUT);

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

  public toJSON(): SerializedMusicEngineOscillatorNode {
    return {
      type: TYPE,
      oscType: this.oscType,
      name: this.name,
      id: this.id,
      labels: this.labels
    };
  }

  static fromJSON(json: SerializedMusicEngineOscillatorNode, audioContext: AudioContext): MusicEngineOscillatorNode {
    return new MusicEngineOscillatorNode(audioContext, json.oscType, json.name, json.id, json.labels);
  }
}
