import { EngineInternals } from "../../plugin";
import { PluginWithLoop } from "../../plugin/Plugin";

export class BehaviorHandlerPlugin extends PluginWithLoop<object> {
    protected _build(engineInternals: EngineInternals): object {
        return {};
    }
    public token: Symbol = Symbol.for("Behavior");
    constructor(
        // private engine;
    ) {
        super();
    }
    public preloop?(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public loop?(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public postloop?(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public preinit?(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public init?(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public postinit?(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public prestart?(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public start?(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public poststart?(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public predestroy?(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public destroy?(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public postdestroy?(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
