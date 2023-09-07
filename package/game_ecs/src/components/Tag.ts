import { Component } from "../Component";
import { ECSDB } from "../db";

export class TagComponent extends Component<string> {
    constructor(id: string, tag: string, ecsdb: ECSDB) {
        super(id, Symbol.for("tag"), tag, ecsdb);
    }
}