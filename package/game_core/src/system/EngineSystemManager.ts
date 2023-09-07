import { SystemLifecycle } from "game_ecs";
import { Engine } from "../Engine";
import { GameTimeManager, GameWorldManager } from "../managers";

export enum GlobalSystemLifecycle {
    GLOBAL_INIT = "GLOBAL_INIT",
    GLOBAL_START = "GLOBAL_START",
    GLOBAL_LOOP = "GLOBAL_LOOP",
    GLOBAL_DESTROY = "GLOBAL_DESTROY",
  };

export class EngineSystemManager {
    constructor(
        private readonly engine: Engine,
        private readonly timeManager: GameTimeManager,
        private readonly worldManager: GameWorldManager
    ) {

    }

    private 
}