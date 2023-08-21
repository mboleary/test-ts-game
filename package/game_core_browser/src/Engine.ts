import { Engine as CoreEngine } from "game_core";
import { EngineHotloopManager } from "./managers/EngineHotloopManager";

export class Engine extends CoreEngine {
    protected readonly hotloopManager = new EngineHotloopManager(this.timeManager, this.pluginManager);

    constructor(debug = false) {
        super();
    }

    public start() {
        super.start();
        this.hotloopManager.startLoop();
    }

    public destroy() {
        this.hotloopManager.stopLoop();
        super.destroy()
    }
}