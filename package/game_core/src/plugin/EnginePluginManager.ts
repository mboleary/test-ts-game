// import { Container } from "inversify";
import { Engine } from "../Engine";
import { GameTimeManager, GameWorldManager } from "../managers";
import { EngineSystemManager } from "../system/EngineSystemManager";
import { EngineInternals } from "./EngineInternals.type";
import { Plugin, PluginWithLoop } from "./Plugin";

export class EnginePluginManager {

    constructor(
        private readonly engine: Engine,
        private readonly timeManager: GameTimeManager,
        private readonly worldManager: GameWorldManager,
        private readonly globalSystemManager: EngineSystemManager,
    ) {

    }

    public readonly preinitFunctions: Function[] = [];
    public readonly initFunctions: Function[] = [];
    public readonly postinitFunctions: Function[] = [];
    public readonly prestartFunctions: Function[] = [];
    public readonly startFunctions: Function[] = [];
    public readonly poststartFunctions: Function[] = [];
    public readonly preloopFunctions: Function[] = [];
    public readonly loopFunctions: Function[] = [];
    public readonly postloopFunctions: Function[] = [];
    public readonly predestroyFunctions: Function[] = [];
    public readonly destroyFunctions: Function[] = [];
    public readonly postdestroyFunctions: Function[] = [];

    // public readonly container: Container = new Container({ defaultScope: "Singleton" });
    private readonly pluginsMap: Map<Symbol, Plugin<any>> = new Map();

    private _allowPluginLoading = false;

    public get allowPluginLoading(): boolean {
        return this._allowPluginLoading;
    }

    public addPlugin<T>(plugin: Plugin<T> | PluginWithLoop<T>): void {
        // this.container.bind<T>(plugin.instance);
        this.pluginsMap.set(plugin.token, plugin);

        if (plugin.preinit) {
            this.preinitFunctions.push(plugin.preinit.bind(plugin));
        }
        if (plugin.init) {
            this.initFunctions.push(plugin.init.bind(plugin));
        }
        if (plugin.postinit) {
            this.postinitFunctions.push(plugin.postinit.bind(plugin));
        }
        if (plugin.prestart) {
            this.prestartFunctions.push(plugin.prestart.bind(plugin));
        }
        if (plugin.start) {
            this.startFunctions.push(plugin.start.bind(plugin));
        }
        if (plugin.poststart) {
            this.poststartFunctions.push(plugin.poststart.bind(plugin));
        }
        if (plugin instanceof PluginWithLoop && plugin.preloop) {
            this.preloopFunctions.push(plugin.preloop.bind(plugin));
        }
        if (plugin instanceof PluginWithLoop && plugin.loop) {
            this.loopFunctions.push(plugin.loop.bind(plugin));
        }
        if (plugin instanceof PluginWithLoop && plugin.postloop) {
            this.postloopFunctions.push(plugin.postloop.bind(plugin));
        }
        if (plugin.predestroy) {
            this.predestroyFunctions.push(plugin.predestroy.bind(plugin));
        }
        if (plugin.destroy) {
            this.destroyFunctions.push(plugin.destroy.bind(plugin));
        }
        if (plugin.postdestroy) {
            this.postdestroyFunctions.push(plugin.postdestroy.bind(plugin));
        }

        plugin.build(this.getEngineInternals());
    }

    public lockPlugins(): void {
        this._allowPluginLoading = false;
    }

    public getPluginInstanceByToken<T>(token: Symbol): T | null {
        // this.container.get<T>(token);
        const plugin = this.pluginsMap.get(token);
        if (plugin === undefined) return null;

        if (!plugin.instance) {
            return plugin.build(this.getEngineInternals());
        }

        return plugin.instance;
    }

    /**
     * Clears all plugins from the Plugin Manager
     */
    public clear() {
        this.preinitFunctions.splice(0, this.preinitFunctions.length);
        this.initFunctions.splice(0, this.initFunctions.length);
        this.postinitFunctions.splice(0, this.postinitFunctions.length);
        this.prestartFunctions.splice(0, this.prestartFunctions.length);
        this.startFunctions.splice(0, this.startFunctions.length);
        this.poststartFunctions.splice(0, this.poststartFunctions.length);
        this.preloopFunctions.splice(0, this.preloopFunctions.length);
        this.loopFunctions.splice(0, this.loopFunctions.length);
        this.postloopFunctions.splice(0, this.postloopFunctions.length);
        this.predestroyFunctions.splice(0, this.predestroyFunctions.length);
        this.destroyFunctions.splice(0, this.destroyFunctions.length);
        this.postdestroyFunctions.splice(0, this.postdestroyFunctions.length);

        this.pluginsMap.clear();
    }

    private getEngineInternals(): EngineInternals {
        return {
            get: (token: Symbol) => {
                return this.getPluginInstanceByToken(token);
            },
            engine: this.engine,
            timeManager: this.timeManager,
            worldManager: this.worldManager,
        }
    }
}
