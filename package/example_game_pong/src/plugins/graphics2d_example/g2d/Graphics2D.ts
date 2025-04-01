import { injectable } from "inversify";
import { DrawableComponent } from "../components/Drawable.component";
import { CanvasManager } from "./CanvasManager";

@injectable()
export class Graphics2D {
  constructor(
    private readonly canvasManager: CanvasManager
  ) {}

  public render(components: DrawableComponent[]) {
    const ctx = this.canvasManager.getContext();
    if (!ctx) return;

    let fillStyle = ctx.fillStyle;
    let strokeStyle = ctx.strokeStyle;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const comp of components) {
      if (comp.fillStyle) {
        fillStyle = ctx.fillStyle;
        ctx.fillStyle = comp.fillStyle;
      }

      if (comp.strokeStyle) {
        strokeStyle = ctx.strokeStyle;
        ctx.strokeStyle = comp.strokeStyle;
      }

      comp.draw(ctx);
      
      if (comp.fillStyle) {
        ctx.fillStyle = fillStyle;
      }

      if (comp.strokeStyle) {
        ctx.strokeStyle = strokeStyle;
      }
    }
  }
}