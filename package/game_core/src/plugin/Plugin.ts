/**
 * Base class for implementing a plugin
 */

import { EngineInternals } from "./EngineInternals.type";

export abstract class Plugin<T> {
    constructor() {}

    // public abstract readonly instance: T;
    public abstract readonly token: Symbol;
    public readonly debug = {};

    private _instance: T | null = null
    public get instance(): T {
        if (!this._instance) {
            throw new Error('Plugin instance not set!');
        }
        return this._instance;
    }
    // Builds the instance
    public build(engineInternals: EngineInternals): T {
        if (!this._instance) {
            this._instance = this._build(engineInternals);
        }
        return this._instance;
    }

    // Function that builds the instance and returns it
    protected abstract _build(engineInternals: EngineInternals): T;

    // Hooks
    public preinit? (): Promise<void>;
    public init?(): Promise<void>;
    public postinit?(): Promise<void>;
    public prestart? (): Promise<void>;
    public start?(): Promise<void>;
    public poststart?(): Promise<void>;
    public predestroy? (): Promise<void>;
    public destroy?(): Promise<void>;
    public postdestroy?(): Promise<void>;
}

export abstract class PluginWithLoop<T> extends Plugin<T> {
    constructor() {
        super();
    }

    // Hooks
    public preloop? (): Promise<void>;
    public loop?(): Promise<void>;
    public postloop?(): Promise<void>;
}