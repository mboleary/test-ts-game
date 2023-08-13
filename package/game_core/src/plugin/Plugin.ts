/**
 * Base class for implementing a plugin
 */

export abstract class Plugin<T> {
    constructor() {}

    public abstract readonly instance: T;
    public abstract readonly token: Symbol;

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