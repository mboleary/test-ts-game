import { Plugin, PluginOptions } from "game_core";
import { ContainerModule, inject, injectable } from "inversify";
import { HOTLOOP_OPTIONS } from "./tokens";
import { EngineHotloopManager } from "./EngineHotloopManager";

@injectable()
export class Hotloop extends Plugin {
    constructor(
        @inject(HOTLOOP_OPTIONS) options: PluginOptions,
        @inject(EngineHotloopManager) private readonly engineHotloopManager: EngineHotloopManager,
    ) {
        super(options);
    }

    start(): void {
        this.engineHotloopManager.startLoop();
    }

    pause(): void {
        this.engineHotloopManager.stopLoop();
    }

    static build(options: PluginOptions = {}) {
        const containerModule = new ContainerModule((bind) => {
            bind(Hotloop).toSelf();
            bind(HOTLOOP_OPTIONS).toConstantValue(options);
            bind(EngineHotloopManager).toSelf();
        });

        return {
            containerModule,
            plugin: Hotloop
        };
    }
}
