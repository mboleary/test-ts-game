// import { Container } from "inversify";
import { Engine } from "../Engine";
import { EngineInternals } from "./EngineInternals.type";
import { Plugin, PluginWithLoop } from "./Plugin";

export class EnginePluginManager {

    constructor(
        public readonly engine: Engine
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

    private getEngineInternals(): EngineInternals {
        return {
            get: (token: Symbol) => {
                return this.getPluginInstanceByToken(token);
            },
            engine: this.engine
        }
    }
}
