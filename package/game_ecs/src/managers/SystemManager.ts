import { System } from "../System";
import { ECSDB } from "../db";
import { Manager } from "./Manager";

export class SystemManager implements Manager {
    private systems: Map<string, System> = new Map();
    constructor(
        private readonly ecsDB: ECSDB
    ) {}

    public add(systems: System[]) {
        for (const system of systems) {
            this.enrollSystem(system);
        }
    }

    private enrollSystem(system: System) {
        this.systems.set(system.id, system);
    }

    public getSystems() {
        return Array.from(this.systems.values());
    }
}
