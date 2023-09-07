import { EngineInternals, PluginWithLoop } from "game_core";
import { Input, destroy, init } from "./Input";

export class InputPlugin extends PluginWithLoop<Input> {
    token = Symbol.for("plugin:input");
    protected _build(engineInternals: EngineInternals): Input {
        return new Input();
    }

    async init(): Promise<void> {
        init();
    }

    async destroy(): Promise<void> {
        destroy();
    }
}