import { Engine } from "../Engine"
import { GameTimeManager, GameWorldManager } from "../managers";

export type EngineInternals = {
    get<T>(token: Symbol): T | null,
    engine: Engine,
    timeManager: GameTimeManager,
    worldManager: GameWorldManager
};
