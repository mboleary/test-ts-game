import { EngineInternals, PluginWithLoop } from "game_core";
import { Graphics2D } from "./Graphics2D";


export class Graphics2DPlugin extends PluginWithLoop<Graphics2D> {
    token = Symbol.for("plugin:g2d");
    protected _build(engineInternals: EngineInternals): Graphics2D {
        return new Graphics2D();
    }

    async init(): Promise<void> {
        init();
    }

    async destroy(): Promise<void> {
        destroy();
    }
}
