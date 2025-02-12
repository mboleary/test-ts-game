import { World } from "game_ecs";
import { GameTimeManager, /*GameWorldManager*/ } from "./managers";
import { EnginePluginManager } from "./plugin";
import { BuiltPlugin } from "./plugin/Plugin";
// import { EngineSystemManager } from "./system/EngineSystemManager";
import { Container } from "inversify";
import { Time } from "./time";
import { EngineLifecycleManager } from "./managers/EngineLifecycleManager";

export class Engine {

    private readonly container: Container;
    // private readonly worldManager: GameWorldManager;
    private readonly pluginManager: EnginePluginManager;
    private readonly lifecycleManager: EngineLifecycleManager;

    private initialized = false;
    private started = false;

    constructor(container?: Container) {
        if (container) {
            this.container = container;
        } else {
            this.container = new Container();
        }

        this.container.bind(EnginePluginManager).toSelf();
        // this.container.bind(EngineSystemManager).toSelf();
        // this.container.bind(GameWorldManager).toSelf();
        this.container.bind(GameTimeManager).toSelf();
        this.container.bind(Time).toSelf();
        this.container.bind(EngineLifecycleManager).toSelf();

        this.pluginManager = this.container.get(EnginePluginManager);
        // this.worldManager = this.container.get(GameWorldManager);
        this.lifecycleManager = this.container.get(EngineLifecycleManager);
    }

    public initialize(plugins: BuiltPlugin[]) {
        if (this.initialized) return;

        for (const pluginModule of plugins) {
            this.container.load(pluginModule.containerModule);
            this.pluginManager.addPlugin(this.container.get(pluginModule.plugin));
        }


        this.pluginManager.lockPlugins();

        this.lifecycleManager.init();

        this.initialized = true;
    }

    public start() {

        if (!this.initialized) throw new Error('Engine not initialized!');
        
        this.lifecycleManager.start();

        this.started = true;

        
    }

    public destroy() {

        if (!this.started) throw new Error('Engine not started!');

        this.lifecycleManager.destroy();

        this.pluginManager.clear();

        this.initialized = false;
        this.started = false;

    }

    // Utility functions
    // public setCurrentScene(scene: Scene) {
    //     this.worldManager.setCurrentScene(scene);
    // }

    // public getWorld(): World {
    //     return this.worldManager.world;
    // }
}
