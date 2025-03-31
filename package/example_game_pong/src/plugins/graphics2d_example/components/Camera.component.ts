import { DrawableComponent } from "./Drawable.component";
import { PointComponent } from "./Point.component";

export class CameraComponent extends DrawableComponent {
  static key = "CameraComponent";

  constructor(point: PointComponent, public zoom: number = 1) {
    super(point);
  }
}