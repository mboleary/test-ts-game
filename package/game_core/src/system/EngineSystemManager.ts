import { System, SystemManager, SystemLifecycle } from "game_ecs";
import { Engine } from "../Engine";
import { GameTimeManager, GameWorldManager } from "../managers";

export enum GlobalSystemLifecycle {
    GLOBAL_INIT = "GLOBAL_INIT",
    GLOBAL_START = "GLOBAL_START",
    GLOBAL_LOOP = "GLOBAL_LOOP",
    GLOBAL_DESTROY = "GLOBAL_DESTROY",
};

export class EngineSystemManager {
    private systems: Map<string, System> = new Map();
    constructor(
        private readonly engine: Engine,
        private readonly timeManager: GameTimeManager,
        private readonly worldManager: GameWorldManager
    ) {

    }

    public add(systems: System[]) {
        for (const system of systems) {
            this.enrollSystem(system);
        }
    }

    private enrollSystem(system: System) {
        this.systems.set(system.id, system);
    }

    public getGlobalSystems() {
        return Array.from(this.systems.values());
    }

    public getAllSystems() {
        const sysMan = this.worldManager.world.getManager<SystemManager>(SystemManager);
        if (sysMan) {
            return this.sortSystems(this.getGlobalSystems().concat(sysMan.getSystems()));
        }
        return this.sortSystems(this.getGlobalSystems());
    }

    private sortSystems(systemsArr: System[]) {
        return systemsArr.sort((a, b) => {
            return b.priority - a.priority;
        });
    }
}
