import { nanoid } from "nanoid/non-secure";
import { MidiInputNode } from "./nodes/MidiInputNode";
import { MidiOutputNode } from "./nodes/MidiOutputNode";

export class MidiAccess { 
  public readonly midiOutputNode: MidiOutputNode;
  public readonly midiInputNode: MidiInputNode;
  private constructor(
    public readonly access: MIDIAccess,
    private readonly audioContext: AudioContext
  ) {
    this.midiOutputNode = new MidiOutputNode(access, audioContext, 'Device Midi Outputs', nanoid());
    this.midiInputNode = new MidiInputNode(access, audioContext, 'Device Midi Inputs', nanoid());
  }

  static async prompt(): Promise<boolean> {
    const result = await navigator.permissions.query({ name: "midi" as PermissionName});

    return result.state === "granted" || result.state === "prompt";
  }

  static async start(audioContext: AudioContext): Promise<MidiAccess> {
    const midiAccess = await navigator.requestMIDIAccess();
    return new MidiAccess(midiAccess, audioContext);
  }
}
