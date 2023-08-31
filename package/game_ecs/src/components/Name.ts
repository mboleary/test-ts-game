import { Component } from "../Component";

export class NameComponent extends Component<string> {
    constructor(id: string, name: string) {
        super(id, Symbol.for("name"), name);
    }
}