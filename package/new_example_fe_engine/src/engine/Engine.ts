/**
 * Public-facing initialization class
 */

import { Container, ContainerModule } from "inversify";
import { BuiltPlugin, Plugin } from "./Plugin";
import { PluginManager } from "../injectableComponents/engine/PluginManager";

export class Engine {
    public readonly container: Container;
    private readonly pluginManager: PluginManager;

    private initialized = false;
    private started = false;

    constructor(
        container?: Container
    ) {
        if (container) {
            this.container = container;
        } else {
            this.container = new Container();
        }

        this.container.bind(PluginManager).toSelf();

        this.pluginManager = this.container.get(PluginManager);
    }

    public initialize(plugins: BuiltPlugin[]) {
        if (this.initialized) return;

        for (const pluginModule of plugins) {
            this.container.load(pluginModule.containerModule);
            this.pluginManager.addPlugin(this.container.get(pluginModule.plugin));
        }

        // @TODO put into hotloop manager
        for (const func of this.pluginManager.initFunctions) {
            func();
        }

        this.initialized = true;
    }

    public start() {

        if (!this.initialized) throw new Error('Engine not initialized!');

        // @TODO put into hotloop manager
        for (const func of this.pluginManager.startFunctions) {
            func();
        }

        this.startLoop();

        this.started = true;
    }

    private stopReference: number | null = null;
    private loopFuncs: Function[] = [];

    private startLoop() {
        this.loopFuncs = this.pluginManager.loopFunctions;
        console.log('loopFuncs', this.loopFuncs);
        this.main();
    }

    private main(): void {
        try {
            this.loop();
        } catch (err) {
            console.error("Error thrown in main loop:", err);
            this.stopLoop();
        }
        this.stopReference = window.requestAnimationFrame(this.main.bind(this));
    }

    private stopLoop(): void {
        if (this.stopReference) {
            window.cancelAnimationFrame(this.stopReference);
        }
    }

    private loop() {
        for (const func of this.loopFuncs) {
            func();
        }
    }
}