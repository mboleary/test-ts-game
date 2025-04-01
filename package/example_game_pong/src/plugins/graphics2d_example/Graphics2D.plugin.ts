import { ContainerModule, inject, injectable, interfaces } from "inversify";
import { Graphics2DOptions } from "./tokens/tokens";
import { BuiltPlugin, PluginOptions, Plugin } from "game_core";
import { CanvasManager } from "./g2d/CanvasManager";
import { Graphics2D } from "./g2d/Graphics2D";

export type Graphics2DPluginOptions = {
  lifecycleOptions?: PluginOptions;
  canvasTarget: HTMLCanvasElement;
  overlayTarget?: HTMLDivElement;
}

@injectable()
export class Graphics2DPlugin extends Plugin {
  constructor(
    @inject(Graphics2DOptions) options: Graphics2DPluginOptions,
    @inject(CanvasManager) private readonly canvasManager: CanvasManager,
    @inject(Graphics2D) private readonly graphics2d: Graphics2D
  ) {
    console.log('construct g2d');
    super(options.lifecycleOptions);
    this.canvasManager.setCanvas(options.canvasTarget);
    if (options.overlayTarget) {
      this.canvasManager.setOverlay(options.overlayTarget);
      this.canvasManager.showOverlay(false);
    } 
  }

  // public async init(): Promise<void> {
  //   console.log('init');
  // }

  // public async start(): Promise<void> {
  //   // Setup systems on world
  //   console.log('start');
  // }

  // public async loop() {
  //   console.log('Plugin Loop');
  // }

  static build(options: Graphics2DPluginOptions): BuiltPlugin {
    const containerModule = new ContainerModule((bind: interfaces.Bind) => {
      bind(Graphics2DOptions).toConstantValue(options);
      bind(Graphics2DPlugin).toSelf();

      const canvasManager = new CanvasManager();
      bind(CanvasManager).toConstantValue(canvasManager);
      bind(Graphics2D).toConstantValue(new Graphics2D(canvasManager));
    });

    return {
      plugin: Graphics2DPlugin,
      containerModule
    }
  }
}