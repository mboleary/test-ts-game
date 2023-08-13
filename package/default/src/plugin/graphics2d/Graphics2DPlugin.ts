import { PluginWithLoop } from "../../core/baseClasses/Plugin";
import { Engine } from "../../core/engine/Engine";
import { Graphics2D } from "./Graphics2D";

export class Graphics2DPlugin extends PluginWithLoop<any> {
    public instance: any;
    public token: Symbol = Symbol.for("Graphics2D");
    constructor(
        canvasTarget: HTMLElement
        // private Engine: Engine
    ) {
        super();

        this.instance = new Graphics2D(canvasTarget);
    }
    public loop(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public postloop(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public preinit(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public init(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public postinit(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public prestart(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public start(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public poststart(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public predestroy(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public destroy(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public postdestroy(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}