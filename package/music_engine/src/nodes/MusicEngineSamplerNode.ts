import { nanoid } from "nanoid";
import { MusicEngineInstrumentNode } from "./MusicEngineInstrumentNode";
import { SerializedMusicEngineNode } from "./MusicEngineNode";
import { AudioParamPort, AudioPort } from "../ports";
import { PortDirection } from "../types";
import { AssetManager } from "asset-manager";

const TYPE = 'sampler_node';

export type SerializedMusicEngineSamplerNode = SerializedMusicEngineNode & {
    type: typeof TYPE,
    samples: SampleDef[]
};

export type SampleDef = {
    start: number, // Start of note range
    end: number, // End of note range
    asset: string, // asset name
    // Options that can be pulled from metadata
    options?: {
        rootNote: number, // tuning note of sample, used to adjust detune value
        loop?: boolean, // loop the sample
        loopStart?: number, // Loop Start Time
        loopEnd?: number, // Loop End Time
    }
};

const defaultSampleDefOptions = {
    rootNotes: 69,
};

export class MusicEngineSamplerNode extends MusicEngineInstrumentNode {
    static type = TYPE as typeof TYPE;

    private readonly oscNodes: Map<number, AudioBufferSourceNode> = new Map();
    private readonly activeNotes: AudioBufferSourceNode[] = [];

    constructor(
        context: AudioContext,
        private readonly assetManager: AssetManager,
        private readonly samples: SampleDef[],
        name: string = '',
        id: string = nanoid(),
        labels: string[] = [],
    ) {
        super(context, name, id, TYPE, labels);
        this.gainNode = context.createGain();
        this.gain = this.gainNode.gain;
        this.audioOut.registerAudioNode(this.gainNode);

        // Ports
        this.ports.push(this.audioOut);
    }



    // public readonly volume: AudioParam = new AudioParamPort('volume', PortDirection.IN, 0.5);
    private readonly gainNode: GainNode;

    public readonly gain: AudioParam;
    //   public readonly detune: AudioParamPort = new AudioParamPort('detune', this, 'Detune', PortDirection.IN, 0);

    public readonly audioOut: AudioPort = new AudioPort('audio', this, 'Audio', PortDirection.OUT);

    private getSampleForNote(note: number): AudioBufferSourceNode {
        const sourceNode = this.context.createBufferSource();

        // Find range of note
        let sample: SampleDef | null = null;
        for (const sampleDef of this.samples) {
            if (sampleDef.start <= note && sampleDef.end >= note) {
                sample = sampleDef;
                break;
            }
        }

        if (!sample) {
            throw new Error(`No note defined for note ${note}`);
        }

        const audioBuffer = this.assetManager.getCachedAsset(sample.asset);
        const assetDef = this.assetManager.getAssetData(sample.asset);
        sourceNode.buffer = audioBuffer;

        const sampleOptions = Object.assign({}, defaultSampleDefOptions, sample.options, (assetDef?.meta as Partial<SampleDef['options']>));

        const detuneValue = (note - sampleOptions.rootNote) * 100;
        sourceNode.detune.value = detuneValue;

        if (sampleOptions.loop) {
            sourceNode.loop = true;
        }

        if (sampleOptions.loopStart) {
            sourceNode.loopStart = sampleOptions.loopStart;
        }

        if (sampleOptions.loopEnd) {
            sourceNode.loopEnd = sampleOptions.loopEnd;
        }

        return sourceNode;
    }

    protected noteOn(time: number, note: number): void {
        const node = this.getSampleForNote(note);
        this.activeNotes.push(node)
        this.oscNodes.set(note, node);
        node.addEventListener('ended', (e) => {
            const t = e.target as AudioBufferSourceNode;
            // remove node from active nodes
            const activeNoteIdx = this.activeNotes.indexOf(t);
            if (activeNoteIdx >= 0) {
                this.activeNotes.splice(activeNoteIdx, 1);
            }
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

    public toJSON(): SerializedMusicEngineSamplerNode {
        return {
            type: TYPE,
            name: this.name,
            id: this.id,
            labels: this.labels,
            samples: this.samples
        };
    }

    static fromJSON(json: SerializedMusicEngineSamplerNode, audioContext: AudioContext, assetManager: AssetManager): MusicEngineSamplerNode {
        return new MusicEngineSamplerNode(audioContext, assetManager, json.samples, json.name, json.id, json.labels);
    }

    /**
     * Creates a sample list for one sampled sound
     * @param assetName Name of the asset to use
     * @param rootNote (default 69) Root Note of sample, defaults to A4 (440)
     */
    static sample(asset: string, rootNote: number = 69): SampleDef[] {
        return [{
            asset,
            start: 0,
            end: 128,
            options: rootNote !== undefined ? {
                rootNote
            } : undefined
        }];
    }

}