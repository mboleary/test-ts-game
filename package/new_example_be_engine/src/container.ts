import { Container } from "inversify";
import { Types } from "./containerTypes.enum";
import { Config } from "./injectableComponents/config/config";
import { ECSComponent } from "./injectableComponents/ecs/ecsComponent";
import { Logger } from "./injectableComponents/logger/logger";

export function buildContainer(): Container {
  const container = new Container({ defaultScope: "Singleton" });
  container.bind<ECSComponent>(Types.ECS).to(ECSComponent);
  container.bind<Logger>(Types.LOGGER).to(Logger);
  container.bind<Config>(Types.CONFIG).to(Config);
  return container;
}
