import { Engine } from "../Engine"
import { GameTimeManager, GameWorldManager } from "../managers";
import { ResourceManager } from "../resource/ResourceManager";

export type EngineInternals = {
    get<T>(token: Symbol): T | null,
    engine: Engine,
    timeManager: GameTimeManager,
    worldManager: GameWorldManager,
    resourceManager: ResourceManager<symbol>,
};
