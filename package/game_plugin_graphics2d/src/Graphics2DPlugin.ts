import { PluginWithLoop, Engine, EngineInternals } from "game_core";
import { Graphics2D } from "./Graphics2D";

export class Graphics2DPlugin extends PluginWithLoop<any> {
    protected _build(engineInternals: EngineInternals) {
        throw new Error("Method not implemented.");
    }
    public token: Symbol = Symbol.for("Graphics2D");
}