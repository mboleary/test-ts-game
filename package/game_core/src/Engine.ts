import { Scene, World } from "game_ecs";
import { EngineHotloopManager, GameTimeManager, GameWorldManager } from "./managers";
import { EnginePluginManager } from "./plugin";
import { Plugin } from "./plugin/Plugin";

export class Engine {

    private readonly pluginManager = new EnginePluginManager(this);
    private readonly timeManager = new GameTimeManager();
    private readonly hotloopManager = new EngineHotloopManager(this.timeManager, this.pluginManager);
    private readonly worldManager = new GameWorldManager();

    private initialized = false;

    constructor(debug = false) {
        
    }

    public initialize(plugins: Plugin<any>[]) {
        if (this.initialized) return;

        for (const plugin of plugins) {
            this.pluginManager.addPlugin(plugin);
        }

        this.pluginManager.lockPlugins();

        // init
        for (const initFunc of this.pluginManager.preinitFunctions) {
            initFunc();
        }

        for (const initFunc of this.pluginManager.initFunctions) {
            initFunc();
        }

        for (const initFunc of this.pluginManager.postinitFunctions) {
            initFunc();
        }
    }

    public start() {
        
        // start
        for (const startFunc of this.pluginManager.prestartFunctions) {
            startFunc();
        }

        for (const startFunc of this.pluginManager.startFunctions) {
            startFunc();
        }

        for (const startFunc of this.pluginManager.poststartFunctions) {
            startFunc();
        }

        // begin loop
        this.hotloopManager.startLoop();
    }

    // Utility functions
    public setCurrentScene(scene: Scene) {
        this.worldManager.setCurrentScene(scene);
    }

    public getWorld(): World {
        return this.worldManager.world;
    }
}
