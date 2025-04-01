import { Point } from "../type/Point.interface";
import { PointComponent } from "./Point.component";

export abstract class DrawableComponent {
  constructor(
    public readonly point: Point,
    public fillStyle: string = "black",
    public strokeStyle: string = "black",
  ) {}

  abstract draw(ctx: CanvasRenderingContext2D): void;
}