import { System } from "../System";
import { ECSDB } from "../db";

export class SystemManager {
    constructor(
        private readonly ecsDB: ECSDB
    ) {}

    public add(systems: System[]) {
        for (const system of systems) {
            this.enrollSystem(system);
        }
    }

    private enrollSystem(system: System) {

    }
}