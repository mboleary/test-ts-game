import { AudioPort } from "../ports";
import { PortDirection } from "../types";
import { MusicEngineNode, SerializedMusicEngineNode } from "./MusicEngineNode";

const TYPE = 'audio_output_node';

export class AudioOutputNode extends MusicEngineNode {
    static type = TYPE;

    public readonly out = new AudioPort('out', this, 'Audio Out', PortDirection.IN);

    constructor(
        context: AudioContext,
        name: string = '',
        id: string = TYPE,
        labels: string[] = []
    ) {
        super(context, name, id, TYPE, labels);
        this.ports.push(this.out);
        this.out.registerAudioNode(context.destination);
    }

    public toJSON(): SerializedMusicEngineNode {
        return {
            type: TYPE,
            name: this.name,
            id: this.id,
            labels: this.labels
        }
    }
}