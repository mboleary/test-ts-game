import { injectable } from "inversify";

@injectable()
export class CanvasManager {
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;

  constructor() {

  }

  public setCanvas(canvas: HTMLCanvasElement) {
    if (this.canvas) {
      this.unbindEvents(this.canvas);
    }
    this.canvas = canvas;
    this.bindEvents(canvas);

    this.context = canvas.getContext("2d");
  }

  public getContext() {
    return this.context;
  }

  private bindEvents(canvas: HTMLCanvasElement) {
    window.addEventListener("resize", this.handleResize);
  }

  private unbindEvents(canvas: HTMLCanvasElement) {
    window.removeEventListener("resize", this.handleResize);
  }

  private handleResize(e: Event) {
    if (!this.canvas) return;

    const width = Math.max(document.documentElement.clientWidth, window.innerWidth);
    const height = Math.max(document.documentElement.clientHeight, window.innerHeight);
    console.log("Screen:", width, height);
    this.canvas.setAttribute("width", width.toString());
    this.canvas.setAttribute("height", height.toString());
  }

}
