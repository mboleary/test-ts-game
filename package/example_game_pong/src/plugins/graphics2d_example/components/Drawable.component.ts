import { PointComponent } from "./Point.component";

export abstract class DrawableComponent {
  constructor(public readonly point: PointComponent) {}
}