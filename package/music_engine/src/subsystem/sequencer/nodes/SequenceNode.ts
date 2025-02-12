/**
 * This node has an array to define the notes that will be played
 */

import { nanoid } from "nanoid/non-secure";
import { MusicEngineNode, SerializedMusicEngineNode } from "../../../nodes/MusicEngineNode";
import { MidiSendPort } from "../../../ports/MidiSendPort";
import { TriggerReceivePort } from "../../../ports/TriggerReceivePort";
import { MusicEngineMidiMessageType } from "../../../types/MusicEngineMidiMessage.type";
import { MidiMessageBuilder } from "../../midi/message/MidiMessageBuilder";
import { MidiNoteOnMessage } from "../../midi/message/MidiNoteOnMessage";
import { MusicEngineMidiMessage } from "../../midi/message/MusicEngineMidiMessage";

const TYPE = "sequencer_node";

export type SerializedSequenceNode = SerializedMusicEngineNode & {
  type: typeof TYPE,
  noteArr: number[],
}

export class SequenceNode extends MusicEngineNode {
  static type = TYPE;
  
  constructor(
    context: AudioContext,
    public readonly noteArr: number[],
    name: string = '',
    id: string = nanoid(),
    labels: string[] = []
  ) {
    super(context, name, id, TYPE, labels);
  }

  private currIndex = 0;

  public readonly noteTriggerPort = new TriggerReceivePort(nanoid(), this, 'in', this.noteTriggerPortHandler.bind(this));

  public readonly midiOutPort = new MidiSendPort(nanoid(), this, 'out');

  // @TODO make this a parameter
  public velocity: number = 127;

  private noteTriggerPortHandler(time: number) {
    if (this.noteArr.length === 0) {
      return;
    }
    if (this.currIndex >= this.noteArr.length) {
      this.currIndex = 0;
      
    }
    this.midiOutPort.send(new MidiNoteOnMessage(this.noteArr[this.currIndex], this.velocity, time));
    this.currIndex = (this.currIndex + 1) % this.noteArr.length;
  }

  public toJSON(): SerializedSequenceNode {
    return {
      type: TYPE,
      name: this.name,
      id: this.id,
      labels: this.labels,
      noteArr: this.noteArr
    };
  }

  static fromJSON(json: SerializedSequenceNode, audioContext: AudioContext): SequenceNode {
    return new SequenceNode(audioContext, json.noteArr, json.name, json.id, json.labels);
  }
}
