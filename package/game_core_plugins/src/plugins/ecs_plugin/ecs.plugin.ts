import { ContainerModule, injectable, interfaces, inject } from "inversify";
import { BuiltPlugin, Plugin, PluginOptions } from "game_core";
import { ECSWorldManager } from "./ECSWorldManager";

export type ECSPluginOptions = PluginOptions & {something: any};

const ECSPluginOptionsToken = Symbol();

const defaultOptions = {
  something: false
};

@injectable()
export class ECSPlugin extends Plugin {
  constructor(
    @inject(ECSPluginOptionsToken) options: ECSPluginOptions,
    @inject(ECSWorldManager) private readonly ecsWorldManager: ECSWorldManager
  ) {
    super(options);
  }

  public async start() {

  }

  public loop(): void {
    const world = this.ecsWorldManager.world;
    if (!world) return;
    world.runLifecycle('loop');
  }

  static build(options: ECSPluginOptions = defaultOptions): BuiltPlugin {
    const containerModule = new ContainerModule((bind: interfaces.Bind) => {
      bind(ECSPluginOptionsToken).toConstantValue(options);
      bind(ECSWorldManager).toSelf();
      bind(ECSPlugin).toSelf();
    });

    return {
      plugin: ECSPlugin,
      containerModule
    }
  }
}
