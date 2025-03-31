import { ContainerModule, inject, injectable, interfaces } from "inversify";
import { Graphics2DOptions } from "./tokens/tokens";
import { BuiltPlugin, PluginOptions, Plugin } from "game_core";

export type Graphics2DPluginOptions = {
    lifecycleOptions?: PluginOptions;
    canvasTarget: HTMLCanvasElement;
}

@injectable()
export class Graphics2DPlugin extends Plugin {
    private readonly canvas: HTMLCanvasElement;
    private readonly context2d: CanvasRenderingContext2D;
    constructor(
        @inject(Graphics2DOptions) options: Graphics2DPluginOptions,
    ) {
        console.log('construct g2d');
        super(options.lifecycleOptions);
        this.canvas = options.canvasTarget;
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Couldn\'t create 2D Context');
        }
        this.context2d = ctx;
    }

    public async init(): Promise<void> {
        console.log('init');
    }

    public async start(): Promise<void> {
        // Setup systems on world
        console.log('start');
    }

    public async loop() {
        console.log('Plugin Loop');
    }

    static build(options: Graphics2DPluginOptions): BuiltPlugin {
        const containerModule = new ContainerModule((bind: interfaces.Bind) => {
            bind(Graphics2DOptions).toConstantValue(options);
            bind(Graphics2DPlugin).toSelf();
        });

        return {
            plugin: Graphics2DPlugin,
            containerModule
        }
    }
}