import { Component } from "../Component";

export class TagComponent extends Component<string> {
    constructor(id: string, tag: string) {
        super(id, Symbol.for("tag"), tag);
    }
}