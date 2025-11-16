import { nanoid } from "nanoid/non-secure";
import { MusicEngineNode } from "../../../nodes";

export abstract class CanvasNode extends MusicEngineNode {
    protected canvasElement: HTMLCanvasElement | null;
    protected drawRef: number | null = null;

    constructor(
        type: string,
        context: AudioContext,
        canvasElement: HTMLCanvasElement | null,
        name: string = '',
        id: string = nanoid(),
        labels: string[] = [],
    ) {
        super(context, name, id, type, labels);

        this.canvasElement = canvasElement;

        if (canvasElement) {
            this.start();
        }
    }

    /**
     * This method is called before drawing is started
     */
    protected abstract initDraw(canvasCtx: CanvasRenderingContext2D, canvasElement: HTMLCanvasElement): void;

    /**
     * This method is called to draw things to the canvas
     */
    protected abstract draw(canvasCtx: CanvasRenderingContext2D, canvasElement: HTMLCanvasElement): void;

    public setCanvas(canvasElement: HTMLCanvasElement) {
        this.stop();
        this.canvasElement = canvasElement;
    }

    public start() {
        if (!this.canvasElement) return;

        const canvasCtx = this.canvasElement.getContext("2d");

        if (!canvasCtx) return;

        // Pre-emptively stop drawing if necessary
        this.stop();

        this.initDraw(canvasCtx, this.canvasElement);

        const draw = () => {
            if (!this.canvasElement) {
                this.stop();
                return;
            }

            canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

            this.draw(canvasCtx, this.canvasElement);

            this.drawRef = requestAnimationFrame(draw);
        }

        draw();
    }

    public stop() {
        if (this.drawRef !== null) {
            cancelAnimationFrame(this.drawRef);
        }
    }
}