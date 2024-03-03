import {EnginePluginManager} from "../plugin/EnginePluginManager";
import { GameTimeManager } from "./GameTimeManager";

export abstract class EngineHotloopManager {
    constructor(
        protected readonly time: GameTimeManager,
        protected readonly pluginManager: EnginePluginManager
    ) {}

    public abstract get loopRunning(): boolean;

    /**
     * Starts the game loop if not already started
     */
    public abstract startLoop(): void ;

    public abstract stopLoop(): void;

    /**
     * Run the GameLoop Once
     * @param {Number} fakeDelta If provided, will set the deltaTime
     */
    public abstract stepLoop(fakeDelta: number): void;
}
