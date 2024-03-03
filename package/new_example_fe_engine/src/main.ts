import "reflect-metadata";
import { buildContainer } from "./container";
import { Types } from "./containerTypes.enum";
import { Logger } from "./injectableComponents/logger/logger";
import { Engine } from "./engine/Engine";
import { Graphics2DPlugin } from "./plugins/graphics2d_example/Graphics2D.plugin";

async function main() {
  console.log('test');
  const container = buildContainer();

  const logger = container.get<Logger>(Types.LOGGER);

  logger.debug("Hello World");

  const engine = new Engine(container);

  const canvasEl = document.getElementById('canvas');

  if (!canvasEl) {
    throw new Error('no canvas');
  }

  engine.initialize([
    Graphics2DPlugin.build({
      canvasTarget: canvasEl as HTMLCanvasElement
    }),
  ]);

  engine.start();
}

main();
