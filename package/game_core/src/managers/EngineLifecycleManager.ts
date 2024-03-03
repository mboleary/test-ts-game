import { inject, injectable } from "inversify";
import { EnginePluginManager } from "../plugin";

@injectable()
export class EngineLifecycleManager {
    constructor(
        @inject(EnginePluginManager) private readonly pluginManager: EnginePluginManager,
    ) {}

    public init() {
        for (const func of this.pluginManager.initFunctions) {
            func();
        }
    }

    public start() {
        for (const func of this.pluginManager.startFunctions) {
            func();
        }
    }

    public pause() {
        // for (const func of this.pluginManager.pauseFunctions) {
        //     func();
        // }
    }

    public destroy() {
        for (const func of this.pluginManager.destroyFunctions) {
            func();
        }
    }
}