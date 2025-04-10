import { nanoid } from "nanoid/non-secure";
import { MusicEngineNode, SerializedMusicEngineNode } from "../../../nodes/MusicEngineNode";
import { MidiReceivePort } from "../../../ports/MidiReceivePort";
import { MusicEngineMidiMessage } from "../message/MusicEngineMidiMessage";

const TYPE = "midi_output_node";

export type SerializedMidiOutputNode = SerializedMusicEngineNode & {
  type: typeof TYPE,
}

export class MidiOutputNode extends MusicEngineNode {
  private readonly outputMidiMap: Map<string, MidiReceivePort> = new Map();
  constructor(
    private readonly midiAccess: MIDIAccess,
    context: AudioContext,
    name: string = '',
    id: string = nanoid(),
    labels: string[] = []
  ) {
    super(context, name, id, TYPE, labels);

    // Generate Midi Ports based on Midi Map
    for (const entry of (this.midiAccess.outputs as unknown as Map<any, MIDIPort>)) {
      const p = this.buildMidiPort(entry[1]);
      this.outputMidiMap.set(entry[0], p);
      this.ports.push(p);
    }

    // Listen for State Changes
    midiAccess.addEventListener("statechange", (event: Event) => {
      if (event && (event as MIDIConnectionEvent).port) {
        const port = (event as MIDIConnectionEvent).port;
        if (!port) return;
        if (port.state === "connected" && !this.outputMidiMap.has(port.id)) {
          const toAdd = this.buildMidiPort(port);
          this.outputMidiMap.set(port.id, toAdd);
          this.ports.push(toAdd);
        } else if (port.state !== "connected") {
          const toDelete = this.outputMidiMap.get(port.id);
          if (toDelete) {
            toDelete.disconnectAll();
            this.outputMidiMap.delete(port.id);
            this.ports.splice(this.ports.findIndex(p => p.id === toDelete.id), 1);
          }
        }
      }
    });
  }

  public getMidiPorts(): MidiReceivePort[] {
    return Array.from(this.outputMidiMap.values());
  }

  private buildMidiPort(port: MIDIPort): MidiReceivePort {
    return new MidiReceivePort(nanoid(), this, port.name || port.id, this.midiHandler.bind(this), port.id);
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

  /**
     * NOTE: building this port from JSON isn't going to work due to the MidiAccess requirement
     * @returns SerializedMidiOutputNode
     */
    public toJSON(): SerializedMidiOutputNode {
      return {
        type: TYPE,
        name: this.name,
        id: this.id,
        labels: this.labels
      };
    }
}
