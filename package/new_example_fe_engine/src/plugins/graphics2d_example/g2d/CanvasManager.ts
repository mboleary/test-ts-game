import { injectable } from "inversify";

@injectable()
export class CanvasManager {
    private canvas: HTMLCanvasElement | null = null;
    constructor() {

    }

    public setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    
}