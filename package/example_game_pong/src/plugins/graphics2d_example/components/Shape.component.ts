import { Shapes } from "../g2d/Shape.enum";
import { Point } from "../type/Point.interface";
import { DrawableComponent } from "./Drawable.component";

export class Shape extends DrawableComponent {
    static key = "Shape";

    constructor(
      point: Point,
      public readonly type: Shapes,
      public readonly width: number, 
      public readonly height: number
    ) {
      super(point);
    }

    draw(ctx: CanvasRenderingContext2D): void {
      if (this.type === Shapes.RECTANGLE) {
        ctx.fillRect(this.point.x, this.point.y, this.width, this.height);
      } else if (this.type === Shapes.CIRCLE) {
        ctx.arc(this.point.x, this.point.y, this.width, 0, Math.PI * 2);
      }
    }
}