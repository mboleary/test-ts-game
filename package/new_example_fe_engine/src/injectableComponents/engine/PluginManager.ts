import { Container, injectable } from "inversify";
import { Plugin } from "../../engine/Plugin";

export const PLUGIN_MANAGER = "PLUGIN_MANAGER";

type Lifecycle = {
    plugin: Plugin,
    priority: number
};

@injectable()
export class PluginManager {
    constructor(
    ) {}

    private readonly initLifecycle: Lifecycle[] = [];
    private readonly startLifecycle: Lifecycle[] = [];
    private readonly loopLifecycle: Lifecycle[] = [];
    private readonly destroyLifecycle: Lifecycle[] = [];

    private readonly plugins: Map<Function, Plugin> = new Map();

    public addPlugin(plugin: Plugin) {
        if (this.plugins.has(plugin.constructor)) {
            throw new Error(`Already loaded plugin ${String(plugin.constructor.name)}`);
        }

        console.log('Adding plugin', plugin);
        
        if (plugin.init) {
            this.initLifecycle.push({
                plugin,
                priority: plugin.initPriority
            });
        }
        if (plugin.start) {
            this.startLifecycle.push({
                plugin,
                priority: plugin.startPriority
            });
        }
        if (plugin.loop) {
            this.loopLifecycle.push({
                plugin,
                priority: plugin.loopPriority
            });
        }
        if (plugin.destroy) {
            this.destroyLifecycle.push({
                plugin,
                priority: plugin.destroyPriority
            });
        }
        this.plugins.set(plugin.constructor, plugin);
    }

    public clear() {
        this.initLifecycle.splice(0, this.initLifecycle.length);
        this.startLifecycle.splice(0, this.startLifecycle.length);
        this.loopLifecycle.splice(0, this.loopLifecycle.length);
        this.destroyLifecycle.splice(0, this.destroyLifecycle.length);
    }

    public get initFunctions(): Function[] {
        return this.initLifecycle
            .sort((a, b) => a.priority - b.priority)
            .filter(lc => lc.plugin.init !== undefined)
            .map(
                (lc) => (lc.plugin as Plugin & {init: Function}).init.bind(lc.plugin)
            );
    }

    public get startFunctions(): Function[] {
        return this.startLifecycle
            .sort((a, b) => a.priority - b.priority)
            .filter(lc => lc.plugin.start !== undefined)
            .map(
                (lc) => (lc.plugin as Plugin & {start: Function}).start.bind(lc.plugin)
            );
    }

    public get loopFunctions(): Function[] {
        return this.loopLifecycle
            .sort((a, b) => a.priority - b.priority)
            .filter(lc => lc.plugin.loop !== undefined)
            .map(
                (lc) => (lc.plugin as Plugin & {loop: Function}).loop.bind(lc.plugin)
            );
    }

    public get destroyFunctions(): Function[] {
        return this.destroyLifecycle
            .sort((a, b) => a.priority - b.priority)
            .filter(lc => lc.plugin.destroy !== undefined)
            .map(
                (lc) => (lc.plugin as Plugin & {destroy: Function}).destroy.bind(lc.plugin)
            );
    }
}