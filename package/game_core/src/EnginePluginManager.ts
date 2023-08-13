import { Container } from "inversify";
import { Plugin } from "../baseClasses/Plugin";

export class EnginePluginManager {
    public readonly preinitFunctions: Function[] = [];
    public readonly initFunctions: Function[] = [];
    public readonly postinitFunctions: Function[] = [];
    public readonly prestartFunctions: Function[] = [];
    public readonly startFunctions: Function[] = [];
    public readonly poststartFunctions: Function[] = [];
    public readonly preloopFunctions: Function[] = [];
    public readonly loopFunctions: Function[] = [];
    public readonly postloopFunctions: Function[] = [];
    public readonly predestroyFunctions: Function[] = [];
    public readonly destroyFunctions: Function[] = [];
    public readonly postdestroyFunctions: Function[] = [];

    public readonly container: Container = new Container();

    private _allowPluginLoading = false;

    public get allowPluginLoading(): boolean {
        return this._allowPluginLoading;
    }

    public add<T>(plugin: Plugin<T>): void {
        // this.container.bind()
    }

    public lockPlugins(): void {
        this._allowPluginLoading = false;
    }


}