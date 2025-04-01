import { DrawableComponent } from "./Drawable.component";
import { PointComponent } from "./Point.component";

export class CameraComponent extends DrawableComponent {
  draw(ctx: CanvasRenderingContext2D): void {
  }
  static key = "CameraComponent";

  constructor(point: PointComponent, public zoom: number = 1) {
    super(point);
  }
}