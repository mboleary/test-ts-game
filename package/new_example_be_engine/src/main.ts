import "reflect-metadata";
import { buildContainer } from "./container";
import { Types } from "./containerTypes.enum";
import { Logger } from "./injectableComponents/logger/logger";

async function main() {
  const container = buildContainer();

  const logger = container.get<Logger>(Types.LOGGER);

  logger.debug("Hello World");
}

main();
