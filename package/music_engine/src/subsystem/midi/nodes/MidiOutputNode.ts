import { MusicEngineNode } from "../../../nodes/MusicEngineNode";
import { MidiReceivePort } from "../../../ports/MidiReceivePort";
import { MusicEngineMidiMessage } from "../message/MusicEngineMidiMessage";

const TYPE = "midi_output_node";

export class MidiOutputNode extends MusicEngineNode {
  private readonly outputMidiMap: Map<string, MidiReceivePort> = new Map();
  constructor(
    private readonly midiAccess: MIDIAccess,
    context: AudioContext,
    name: string,
    labels: string[] = []
  ) {
    super(context, name, TYPE, labels);

    // Generate Midi Ports based on Midi Map
    for (const entry of (this.midiAccess.outputs as unknown as Map<any, MIDIPort>)) {
      this.outputMidiMap.set(entry[0], this.buildMidiPort(entry[1]));
    }

    // Listen for State Changes
    midiAccess.addEventListener("statechange", (event: Event) => {
      if (event && (event as MIDIConnectionEvent).port) {
        const port = (event as MIDIConnectionEvent).port;
        if (port.state === "connected" && !this.outputMidiMap.has(port.id)) {
          const toAdd = this.buildMidiPort(port);
          this.outputMidiMap.set(port.id, toAdd);
        } else if (port.state !== "connected") {
          const toDelete = this.outputMidiMap.get(port.id);
          if (toDelete) {
            toDelete.disconnectAll();
          }
        }
      }
    });
  }

  public getMidiPorts(): MidiReceivePort[] {
    return Array.from(this.outputMidiMap.values());
  }

  private buildMidiPort(port: MIDIPort): MidiReceivePort {
    return new MidiReceivePort(port.name || port.id, this.midiHandler.bind(this), port.id);
  }

  private midiHandler(message: MusicEngineMidiMessage, id?: string) {
    if (id) {
      const bytes = message.toBytes();
      const output = (this.midiAccess.outputs as Map<any, any>).get(id);
      if (output && message.time) {
        // Note that the time is relative to performance.now(), which is measured in ms
        const now = window.performance.now();
        const diff = now - (this.context.currentTime * 1000);
        const time = (message.time * 1000) + diff;
        output.send(bytes, time);
      } else if (output) {
        output.send(bytes);
      }
    }
  }
}
