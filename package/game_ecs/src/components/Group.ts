import { Component } from "../Component";

export class GroupComponent extends Component<string> {
    constructor(id: string, group: string) {
        super(id, Symbol.for("group"), group);
    }
}