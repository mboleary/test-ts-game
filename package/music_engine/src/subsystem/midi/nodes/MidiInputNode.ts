import { nanoid } from "nanoid/non-secure";
import { MusicEngineNode, SerializedMusicEngineNode } from "../../../nodes/MusicEngineNode";
import { MidiSendPort } from "../../../ports/MidiSendPort";
import { MidiMessageBuilder } from "../message/MidiMessageBuilder";

const TYPE = "midi_input_node";

export type SerializedMidiInputNode = SerializedMusicEngineNode & {
  type: typeof TYPE,
}

export class MidiInputNode extends MusicEngineNode {
  private readonly inputMidiMap: Map<string, MidiSendPort> = new Map();
  constructor(
    private readonly midiAccess: MIDIAccess,
    context: AudioContext,
    name: string,
    id: string = nanoid(),
    labels: string[] = []
  ) {
    super(context, name, id, TYPE, labels);

    // Generate Midi Ports based on Midi Map
    for (const entry of (this.midiAccess.inputs as unknown as Map<any, MIDIPort>)) {
      const p = this.buildMidiPort(entry[1]);
      this.inputMidiMap.set(entry[0], p);
      this.ports.push(p);
    }

    // Listen for State Changes
    midiAccess.addEventListener("statechange", (event: Event) => {
      if (event && (event as MIDIConnectionEvent).port) {
        const port = (event as MIDIConnectionEvent).port;
        if (!port) return;
        if (port.state === "connected" && !this.inputMidiMap.has(port.id)) {
          const toAdd = this.buildMidiPort(port);
          this.inputMidiMap.set(port.id, toAdd);
          this.ports.push(toAdd);
        } else if (port.state !== "connected") {
          const toDelete = this.inputMidiMap.get(port.id);
          if (toDelete) {
            toDelete.disconnectAll();
            this.inputMidiMap.delete(port.id);
            this.ports.splice(this.ports.findIndex(p => p.id === toDelete.id), 1);
          }
        }
      }
    });
  }

  public getMidiPorts(): MidiSendPort[] {
    return Array.from(this.inputMidiMap.values());
  }

  private buildMidiPort(port: MIDIPort): MidiSendPort {
    const sendPort = new MidiSendPort(nanoid(), this, port.name || port.id, port.id);
    port.addEventListener('midimessage', this.handleMidiMessage.bind(this));
    return sendPort;
  }

  private handleMidiMessage(event: Event) {
    const midiEvent = (event as MIDIMessageEvent);
    const sendPort = this.inputMidiMap.get((event.target as MIDIPort).id)
    if (sendPort && midiEvent.data) {
      const now = performance.now();
      const diff = now - midiEvent.timeStamp;
      console.log(`Timestamp ${midiEvent.timeStamp}, now: ${now}. diff: ${diff}`);
      sendPort.send(MidiMessageBuilder.fromBytes(midiEvent.data));
    }
  }

  /**
   * NOTE: building this port from JSON isn't going to work due to the MidiAccess requirement
   * @returns SerializedMidiInputNode
   */
  public toJSON(): SerializedMidiInputNode {
    return {
      type: TYPE,
      name: this.name,
      id: this.id,
      labels: this.labels
    };
  }
}
