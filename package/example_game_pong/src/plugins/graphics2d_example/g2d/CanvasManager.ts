import { injectable } from "inversify";

@injectable()
export class CanvasManager {
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private overlay: HTMLDivElement | null = null;

  constructor() {

  }

  public setCanvas(canvas: HTMLCanvasElement) {
    if (this.canvas) {
      this.unbindEvents(this.canvas);
    }
    this.canvas = canvas;
    this.bindEvents(canvas);

    // Trigger event call to set canvas size
    this.handleResize(new Event("resize"));

    this.context = canvas.getContext("2d");
  }

  public setOverlay(overlay: HTMLDivElement) {
    this.overlay = overlay;
  }

  public getContext() {
    return this.context;
  }

  public showOverlay(show: boolean) {
    if (this.overlay) {
      this.overlay.style.display = show ? "block" : " none";
    }
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
