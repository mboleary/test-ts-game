import { Point } from "../type/Point.interface";

export class PointComponent implements Point {
  static key = "PointComponent";
  constructor(public x: number, public y: number) {}
}