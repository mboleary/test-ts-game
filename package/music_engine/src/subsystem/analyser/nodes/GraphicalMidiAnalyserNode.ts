import { nanoid } from "nanoid/non-secure";
import { SerializedMusicEngineNode } from "../../../nodes";
import { MidiReceivePort } from "../../../ports";
import { MusicEngineMidiMessageType } from "../../../types";
import { CanvasNode } from "./CanvasNode";
import { MidiNoteOffMessage, MidiNoteOnMessage, MusicEngineMidiMessage } from "../../midi";

const TYPE = 'graphical_midi_analyser_node';

export type GraphicalMidiAnalyserNodeDrawingOptions = {
    midiRange: {
        start: number,
        end: number,
    },
    midiColors?: {
        start: number,
        end: number,
        fillStyle: string
    }[],
    timeWidth: number,
    defaultFillStyle: string,
}

export type SerializedGraphicalMidiAnalyserNode = SerializedMusicEngineNode & {
    drawingOptions: GraphicalMidiAnalyserNodeDrawingOptions
};

const defaultDrawingOptions = {
    midiRange: {
        start: 60, // (Middle) C4
        end: 84, // C6
    },
    timeWidth: 10,
    defaultFillStyle: "red",
    midiColors: [
        {
            start: 72,
            end: 84,
            fillStyle: "orange"
        }
    ]
};

type DrawNote = {
    note: number,
    velocity: number,
    startTime: number,
    endTime: number | null,
    fillStyle?: string;
}

export class GraphicalMidiAnalyserNode extends CanvasNode {
    static type = TYPE;

    constructor(
        context: AudioContext,
        canvasElement: HTMLCanvasElement | null,
        private readonly drawingOptions: GraphicalMidiAnalyserNodeDrawingOptions = Object.assign({}, defaultDrawingOptions),
        name: string = '',
        id: string = nanoid(),
        labels: string[] = [],
    ) {
        super(TYPE, context, canvasElement, name, id, labels);
        this.ports.push(this.midiIn);

        if (canvasElement) {
            this.start();
        }
    }

    public readonly midiIn: MidiReceivePort = new MidiReceivePort('midi', this, 'Midi In', this.handleMidi.bind(this));

    private readonly notes: DrawNote[] = [
        // @TODO this is for testing
        {note: 69, velocity: 127, startTime: 5, endTime: 7}
    ];

    private handleMidi(message: MusicEngineMidiMessage) {
        console.log("midi message", message);
        switch(message.type) {
            case MusicEngineMidiMessageType.NOTE_ON:
                this.noteOn(message as MidiNoteOnMessage);
                break;
            case MusicEngineMidiMessageType.NOTE_OFF:
                this.noteOff(message as MidiNoteOffMessage);
                break;
            default:
        }
    }

    private noteOn(message: MidiNoteOnMessage) {
        const note: DrawNote = {
            note: message.key,
            velocity: message.velocity,
            // If the time is 0, it likely came from the midi input system
            startTime: message.time === 0 ? 
                window.performance.now() / 1000 : 
                message.time,
            endTime: null
        };

        if (this.drawingOptions.midiColors) {
            for (const range of this.drawingOptions.midiColors) {
                if (message.key >= range.start && message.key <= range.end) {
                    note.fillStyle = range.fillStyle;
                    break;
                }
            }
        }

        this.notes.push(note);
        this.cullOldNotes();
        this.notes.sort((a, b) => b.startTime - a.startTime); // Sort so that newest message is at the end
    }

    private noteOff(message: MidiNoteOffMessage) {
        const note = this.notes.findLast((note: DrawNote) => note.note === message.key && note.endTime === null);
        if (note) {
            // If the time is 0, it likely came from the midi input system
            note.endTime = message.time === 0 ? 
                window.performance.now() / 1000 : 
                message.time;
        }
        console.log("updated note:", note);
    }

    private cullOldNotes() {
        const now = window.performance.now() / 1000;
        const timeLimit = now - this.drawingOptions.timeWidth;
        for (let i = 0; i < this.notes.length; i++) {
            const note = this.notes[i];

            if (note.endTime && note.endTime < timeLimit) {
                this.notes.splice(i, 1);
                i--;
            }
        }
    }

    protected initDraw(drawCtx: CanvasRenderingContext2D) {
        // this.notes.splice(0, this.notes.length);
        drawCtx.fillStyle = "red";
        console.log("midi draw init");
    }

    protected draw(drawCtx: CanvasRenderingContext2D, canvasElement: HTMLCanvasElement) {
        let initialFillStyle = drawCtx.fillStyle;
        const noteHeightPx = canvasElement.height / (this.drawingOptions.midiRange.end - this.drawingOptions.midiRange.start);
        const noteWidthPx = canvasElement.width / this.drawingOptions.timeWidth;
        const now = window.performance.now() / 1000;

        for (const note of this.notes) {
            const x = canvasElement.width - ((now - note.startTime) * noteWidthPx);
            const w = note.endTime ? 
                canvasElement.width - ((now - note.endTime) * noteWidthPx) - x:
                canvasElement.width - x; 
            const y = canvasElement.height - ((note.note - this.drawingOptions.midiRange.start) * noteHeightPx);
            if (note.fillStyle) {
                drawCtx.fillStyle = note.fillStyle;
            }
            // console.log('draw', x, y, w, noteHeightPx);
            drawCtx.fillRect(x, y, w, noteHeightPx);
            // Change the fill style back to the initial fill style
            if (note.fillStyle) {
                drawCtx.fillStyle = initialFillStyle;
            }
        }

        drawCtx.fillStyle = initialFillStyle;
    }

    public toJSON(): SerializedGraphicalMidiAnalyserNode {
        return {
            type: TYPE,
            name: this.name,
            id: this.id,
            labels: this.labels,
            drawingOptions: this.drawingOptions
        };
    }

    /**
     * Note: This requires a canvas element to draw the line, which could be a problem here
     * @param json 
     * @param audioContext 
     * @returns 
     */
    static fromJSON(json: SerializedGraphicalMidiAnalyserNode, audioContext: AudioContext): GraphicalMidiAnalyserNode {
        return new GraphicalMidiAnalyserNode(audioContext, null, json.drawingOptions, json.name, json.id, json.labels);
    }
}