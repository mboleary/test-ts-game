import { Scene, World } from "game_ecs";
import { EngineHotloopManager, GameTimeManager, GameWorldManager } from "./managers";
import { EnginePluginManager } from "./plugin";
import { Plugin } from "./plugin/Plugin";
import { EngineSystemManager } from "./system/EngineSystemManager";

export class Engine {

    protected readonly timeManager = new GameTimeManager();
    // protected readonly hotloopManager = new EngineHotloopManager(this.timeManager, this.pluginManager);
    protected readonly worldManager = new GameWorldManager();
    protected readonly systemManager = new EngineSystemManager(this, this.timeManager, this.worldManager);
    protected readonly pluginManager = new EnginePluginManager(this, this.timeManager, this.worldManager, this.systemManager);

    private initialized = false;
    private started = false;

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

        this.initialized = true;
    }

    public start() {

        if (!this.initialized) throw new Error('Engine not initialized!');
        
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

        this.started = true;

        
    }

    public destroy() {

        if (!this.started) throw new Error('Engine not started!');

        // destroy
        for (const destroyFunc of this.pluginManager.predestroyFunctions) {
            destroyFunc();
        }

        for (const destroyFunc of this.pluginManager.destroyFunctions) {
            destroyFunc();
        }

        for (const destroyFunc of this.pluginManager.postdestroyFunctions) {
            destroyFunc();
        }

        this.pluginManager.clear();

        this.initialized = false;
        this.started = false;

    }

    // Utility functions
    public setCurrentScene(scene: Scene) {
        this.worldManager.setCurrentScene(scene);
    }

    public getWorld(): World {
        return this.worldManager.world;
    }
}
