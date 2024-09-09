import { nanoid } from "nanoid/non-secure";
import { MusicEngineNode } from "../../../nodes/MusicEngineNode";
import { MidiSendPort } from "../../../ports/MidiSendPort";
import { MidiMessageBuilder } from "../message/MidiMessageBuilder";

const TYPE = "midi_input_node";

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
      this.inputMidiMap.set(entry[0], this.buildMidiPort(entry[1]));
    }

    // Listen for State Changes
    midiAccess.addEventListener("statechange", (event: Event) => {
      if (event && (event as MIDIConnectionEvent).port) {
        const port = (event as MIDIConnectionEvent).port;
        if (port.state === "connected" && !this.inputMidiMap.has(port.id)) {
          const toAdd = this.buildMidiPort(port);
          this.inputMidiMap.set(port.id, toAdd);
        } else if (port.state !== "connected") {
          const toDelete = this.inputMidiMap.get(port.id);
          if (toDelete) {
            toDelete.disconnectAll();
          }
        }
      }
    });
  }

  public getMidiPorts(): MidiSendPort[] {
    return Array.from(this.inputMidiMap.values());
  }

  private buildMidiPort(port: MIDIPort): MidiSendPort {
    const sendPort = new MidiSendPort(port.name || port.id, port.id);
    port.addEventListener('midimessage', this.handleMidiMessage.bind(this));
    return sendPort;
  }

  private handleMidiMessage(event: Event) {
    const midiEvent = (event as MIDIMessageEvent);
    const sendPort = this.inputMidiMap.get((event.target as MIDIPort).id)
    if (sendPort) {
      const now = performance.now();
      const diff = now - midiEvent.timeStamp;
      console.log(`Timestamp ${midiEvent.timeStamp}, now: ${now}. diff: ${diff}`);
      sendPort.send(MidiMessageBuilder.fromBytes(midiEvent.data));
    }
  }
}
