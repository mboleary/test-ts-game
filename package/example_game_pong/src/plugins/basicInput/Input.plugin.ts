import { ContainerModule, inject, injectable, interfaces } from "inversify";
import { BuiltPlugin, PluginOptions, Plugin } from "game_core";
import { InputOptionsToken } from "./tokens.const";
import { InputBinding } from "./binding.type";
import { Input } from "./Input";

export type InputPluginOptions = {
  lifecycleOptions?: PluginOptions;
  bindings: InputBinding[];
}

@injectable()
export class InputPlugin extends Plugin {
  constructor(
    @inject(InputOptionsToken) private readonly options: InputPluginOptions,
    @inject(Input) private readonly input: Input
  ) {
    console.log('construct input');
    super(options.lifecycleOptions);
  }

  public async init(): Promise<void> {
    console.log('init');
    // Set and define keybindings
    for (const binding of this.options.bindings) {
      this.input.defineKey(binding.name);
      this.input.bindKey(binding.name, binding.key);
    }
  }

  static build(options: InputPluginOptions): BuiltPlugin {
    const containerModule = new ContainerModule((bind: interfaces.Bind) => {
      bind(InputOptionsToken).toConstantValue(options);
      bind(InputPlugin).toSelf();
      bind(Input).toConstantValue(new Input());
    });

    return {
      plugin: InputPlugin,
      containerModule
    }
  }
}