import { Shapes } from "../Shape.enum";

export class ShapePrimative {
    constructor(
        public shape: Shapes,
    ) {}

    public color: string = '';
}