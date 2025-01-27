import { nanoid } from "nanoid/non-secure";
import { MusicEngineNode, SerializedMusicEngineNode } from "../../../nodes";
import { AudioPort } from "../../../ports";
import { PortDirection } from "../../../types";

const TYPE = 'graphical_analyser_node';

export type GraphicalAnalyserNodeDrawingOptions = {
    lineWidth: number,
    strokeStyle: string,
    // fillStyle: string,
};

export const defaultDrawingOptions: GraphicalAnalyserNodeDrawingOptions = {
    lineWidth: 2,
    strokeStyle: "#a6e22e",
    // fillStyle: 'inherit'
};

export enum GraphicalDataType {
    FREQUENCY = 'FREQUENCY',
    WAVEFORM = 'WAVEFORM',
};

export type SerializedGraphicalAnalyserNode = SerializedMusicEngineNode & {
    dataType: GraphicalDataType,
    drawingOptions: GraphicalAnalyserNodeDrawingOptions
};

export class GraphicalAnalyserNode extends MusicEngineNode {
    static type = TYPE;

    private readonly analyserNode: AnalyserNode;
    private canvasElement: HTMLCanvasElement | null;
    private drawRef: number | null = null;

    constructor(
        context: AudioContext,
        canvasElement: HTMLCanvasElement | null,
        private readonly dataType: GraphicalDataType = GraphicalDataType.WAVEFORM,
        private readonly drawingOptions: GraphicalAnalyserNodeDrawingOptions = defaultDrawingOptions,
        name: string = '',
        id: string = nanoid(),
        labels: string[] = [],
    ) {
        super(context, name, id, TYPE, labels);
        this.ports.push(this.audioIn);

        this.canvasElement = canvasElement;
        this.analyserNode = context.createAnalyser();

        if (canvasElement) {
            this.start();
        }
    }

    public readonly audioIn: AudioPort = new AudioPort('audio', this, 'Audio In', PortDirection.IN);

    private initDraw() {
        const bufferLength = this.analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyserNode.getByteTimeDomainData(dataArray);

        if (!this.canvasElement) return;

        const canvasCtx = this.canvasElement.getContext("2d");

        if (!canvasCtx) return;

        // Pre-emptively stop drawing if necessary
        this.stop();

        const draw = () => {
            if (!this.canvasElement) {
                this.stop();
                return;
            }

            if (this.dataType === GraphicalDataType.FREQUENCY) {
                this.analyserNode.getByteFrequencyData(dataArray);
            } else {
                this.analyserNode.getByteTimeDomainData(dataArray);
            }
    
            canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    
            canvasCtx.lineWidth = this.drawingOptions.lineWidth || 2;
            canvasCtx.strokeStyle = this.drawingOptions.strokeStyle || "#fff";
    
            canvasCtx.beginPath();
    
            const sliceWidth = (this.canvasElement.width * 1.0) / bufferLength;
            let x = 0;
    
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * this.canvasElement.height) / 2;
    
                if (i === 0) {
                canvasCtx.moveTo(x, y);
                } else {
                canvasCtx.lineTo(x, y);
                }
    
                x += sliceWidth;
            }
    
            canvasCtx.lineTo(this.canvasElement.width, this.canvasElement.height / 2);
            canvasCtx.stroke();

            this.drawRef = requestAnimationFrame(draw);
        }

        draw();
    }

    

    public setCanvas(canvasElement: HTMLCanvasElement) {
        this.stop();
        this.canvasElement = canvasElement;
    }

    public start() {
        this.initDraw();
    }

    public stop() {
        if (this.drawRef !== null) {
            cancelAnimationFrame(this.drawRef);
        }
    }

    public toJSON(): SerializedGraphicalAnalyserNode {
        return {
            type: TYPE,
            name: this.name,
            id: this.id,
            labels: this.labels,
            dataType: this.dataType,
            drawingOptions: this.drawingOptions
        };
    }

    /**
     * Note: This requires a canvas element to draw the line, which could be a problem here
     * @param json 
     * @param audioContext 
     * @returns 
     */
    static fromJSON(json: SerializedGraphicalAnalyserNode, audioContext: AudioContext): GraphicalAnalyserNode {
        return new GraphicalAnalyserNode(audioContext, null, json.dataType, json.drawingOptions, json.name, json.id, json.labels);
    }
}