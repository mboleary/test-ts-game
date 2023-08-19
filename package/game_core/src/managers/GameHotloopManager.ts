import {EnginePluginManager} from "../plugin/EnginePluginManager";
import { TARGET_MILLIS_PER_FRAME } from "../time";
import { GameTimeManager } from "./GameTimeManager";

export class EngineHotloopManager {
    constructor(
        private readonly time: GameTimeManager,
        private readonly pluginManager: EnginePluginManager
    ) {}

    private _loopRunning: boolean = false;
    private stopReference: number | null = null;
    private loopFunctions: Function[] = [];

    public get loopRunning(): boolean {
        return this._loopRunning;
    }

    /**
     * Starts the game loop if not already started
     */
    public startLoop(): void {
        if (!this._loopRunning) {
            this._loopRunning = true;
            this.loopFunctions = ([] as Function[]).concat(this.pluginManager.preloopFunctions, this.pluginManager.loopFunctions, this.pluginManager.postloopFunctions);
            if (this.time.paused) {
                this.time.unpauseTime();
            } else {
                this.time.initTime();
            }
            this.main();
        }
    }

    public stopLoop(): void {
        if (this._loopRunning && this.stopReference) {
            window.cancelAnimationFrame(this.stopReference);
            this._loopRunning = false;
            this.time.pauseTime();
        }
    }

    /**
     * Run the GameLoop Once
     * @param {Number} fakeDelta If provided, will set the deltaTime
     */
    public stepLoop(fakeDelta: number): void {
        if (fakeDelta || fakeDelta === 0) {
            this.time.advanceTime(fakeDelta);
        } else {
            this.time.advanceTime(TARGET_MILLIS_PER_FRAME);
        }
        this.loop();
    }

    /**
     * This calls the hotloop and registers the callback for the next animation frame
     */
    private main(): void {
        try {
            this.loop();
        } catch (err) {
            console.error("Error thrown in main loop:", err);
            this.stopLoop();
        }
        this.stopReference = window.requestAnimationFrame(this.main.bind(this));
    }

    /**
     * Runs all loop functions
     */
    private loop(): void {
        this.time.updateDeltaTime();

        for (const func of this.loopFunctions) {
            func();
        }
    }
}
