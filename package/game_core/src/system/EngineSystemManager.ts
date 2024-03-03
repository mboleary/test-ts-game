import { System, SystemManager, SystemLifecycle } from "game_ecs";
import { Engine } from "../Engine";
import { GameTimeManager, GameWorldManager } from "../managers";
import { inject, injectable } from "inversify";

export enum GlobalSystemLifecycle {
    GLOBAL_INIT = "GLOBAL_INIT",
    GLOBAL_START = "GLOBAL_START",
    GLOBAL_LOOP = "GLOBAL_LOOP",
    GLOBAL_DESTROY = "GLOBAL_DESTROY",
};

@injectable()
export class EngineSystemManager {
    private systems: Map<string, System> = new Map();
    constructor(
        @inject(GameWorldManager) private readonly worldManager: GameWorldManager
    ) {

    }

    /**
     * @TODO create an observer on the world to get all new entities, also get the world's querymanager to read all cached queries.
     * This will give us all of the entities that need to be fed into the systems and also which systems need to be run
     */

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

    // @TODO might remove this
    public getAllSystems() {
        const sysMan = this.worldManager.world.getManager<SystemManager>(SystemManager);
        if (sysMan) {
            return this.sortSystems(this.getGlobalSystems().concat(sysMan.getSystems()));
        }
        return this.sortSystems(this.getGlobalSystems());
    }

    public getSystemsToRunThisFrame() {
        // **Get all systems that need to be run this frame**
        // Get 
    }

    private sortSystems(systemsArr: System[]) {
        return systemsArr.sort((a, b) => {
            return b.priority - a.priority;
        });
    }
}
