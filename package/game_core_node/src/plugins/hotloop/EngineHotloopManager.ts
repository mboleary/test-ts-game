import { EnginePluginManager, EngineHotloopManager as CoreEngineHotloopManager } from "game_core";
import { TARGET_MILLIS_PER_FRAME } from "game_core";
import { GameTimeManager } from "game_core";
import { inject, injectable } from "inversify";

@injectable()
export class EngineHotloopManager extends CoreEngineHotloopManager {
    constructor(
        @inject(GameTimeManager) time: GameTimeManager,
        @inject(EnginePluginManager) pluginManager: EnginePluginManager
    ) {
        super(time, pluginManager)
    }

    private _loopRunning: boolean = false;
    private stopReference: NodeJS.Timeout | null = null;
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
            this.loopFunctions = this.pluginManager.loopFunctions;
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
            clearInterval(this.stopReference);
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
        this.stopReference = setInterval(this.main.bind(this), TARGET_MILLIS_PER_FRAME);
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
