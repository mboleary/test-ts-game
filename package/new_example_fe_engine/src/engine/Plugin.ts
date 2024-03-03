/**
 * Plugins are responsible for running lifecycle methods used by parts of the engine to give it functionality
 */

import { ContainerModule, injectable } from "inversify";

export type BuiltPlugin = {
    plugin: Function,
    containerModule: ContainerModule
};

export type PluginOptions = {
    initPriority?: number,
    startPriority?: number,
    loopPriority?: number,
    destroyPriority?: number
}

@injectable()
export abstract class Plugin {
    constructor(options?: PluginOptions) {
        if (options) {
            if (options.initPriority) {
                this.initPriority = options.initPriority
            }
            if (options.startPriority) {
                this.startPriority = options.startPriority
            }
            if (options.loopPriority) {
                this.loopPriority = options.loopPriority
            }
            if (options.destroyPriority) {
                this.destroyPriority = options.destroyPriority
            }
        }
    }

    public readonly initPriority: number = 0;
    public readonly startPriority: number = 0;
    public readonly loopPriority: number = 0;
    public readonly destroyPriority: number = 0;

    // Hooks
    public async init?(): Promise<void>;
    public async start?(): Promise<void>;
    public async loop?(): Promise<void>;
    public async destroy?(): Promise<void>;

    // Inversify container module for the plugin
    // public abstract readonly module: ContainerModule;

    static build(options: any): BuiltPlugin {
        const containerModule = new ContainerModule((bind) => {
            bind(Plugin).toSelf();
        });

        return {
            plugin: Plugin,
            containerModule
        }
    }
}