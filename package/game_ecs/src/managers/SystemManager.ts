import { System } from "../System";
import { ECSDB } from "../db";
import { Manager } from "./Manager";
import { World } from "../World";

export class SystemManager extends Manager {
  private systems: Map<string, System> = new Map();
  constructor(
    ecsDB: ECSDB,
    world: World
  ) {
    super(ecsDB, world);
  }

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
