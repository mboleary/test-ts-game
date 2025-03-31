import { ContainerModule, inject, injectable, interfaces } from "inversify";
import { BuiltPlugin, PluginOptions, Plugin } from "game_core";
import { ECSPluginOptions } from "./tokens.const";
import { SystemLifecycle, World } from "game_ecs";

export type ECSPluginOptions = {
  lifecycleOptions?: PluginOptions;
  initCallback: () => Promise<World>;
}

@injectable()
export class ECSPlugin extends Plugin {
  private world: World | null = null;

  constructor(
    @inject(ECSPluginOptions) private readonly options: ECSPluginOptions,
  ) {
    console.log('construct input');
    super(options.lifecycleOptions);
  }

  public async init(): Promise<void> {
    console.log('init ecs');
    this.world = await this.options.initCallback();
    this.world.enableEventDrivenLifecycles();
  }

  public async start(): Promise<void> {
    if (this.world) {
      this.world.runLifecycle(SystemLifecycle.INIT);
    }
  }

  public async loop() {
    if (this.world) {
      this.world.runLifecycle(SystemLifecycle.LOOP);
    }
  }

  public async destroy() {
    if (this.world) {
      this.world.runLifecycle(SystemLifecycle.DESTROY);
    }
  }

  static build(options: ECSPluginOptions): BuiltPlugin {
    const containerModule = new ContainerModule((bind: interfaces.Bind) => {
      bind(ECSPluginOptions).toConstantValue(options);
      bind(ECSPlugin).toSelf();
    });

    return {
      plugin: ECSPlugin,
      containerModule
    }
  }
}