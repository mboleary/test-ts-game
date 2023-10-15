import { Component } from "../Component";
import { ECSDB } from "../db";

export class GroupComponent extends Component<string> {
    constructor(id: string, group: string, ecsdb: ECSDB) {
        super(id, Symbol.for("group"), group, ecsdb);
    }
}