import { v4 as uuidv4 } from "uuid";
import { Component } from "../Component";
import { ECSDB } from "../db";

export class NameComponent extends Component<string> {
    constructor(id: string, name: string, ecsdb: ECSDB) {
        super(id, Symbol.for("name"), name, ecsdb);
    }

    // static build(name: string): NameComponent {
    //     return new NameComponent(uuidv4(), name, new ECSDB(true));
    // }
}