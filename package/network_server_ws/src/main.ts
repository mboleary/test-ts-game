import { Container } from "inversify";
import "reflect-metadata";
import { createExpressServer, useContainer, useExpressServer } from "routing-controllers";
import { Config } from "./components/config/Config";
import { getConfigObject } from "./components/config/main";
import { CONFIG_TOKEN } from "./components/config/tokens";
import { Logger } from "./components/logger/Logger";
import { RoomController } from "./controllers/room.controller";
import { createServer as createHTTPServer } from "http";
import express from "express";
import { InversifyAdapter } from "./components/routingControllers/InversifyAdapter";

export async function main() {
  const config = await getConfigObject(Config);

  const container = new Container();

  container.bind(CONFIG_TOKEN).toConstantValue(config);
  container.bind(Logger).toSelf();

  const httpServer = createHTTPServer();
  const app = express();
  httpServer.on('request', app);

  // container.bind(RoomController).toSelf();
  // const roomController = container.get(RoomController);

  // console.log(roomController);

  useExpressServer(app, {
    controllers: [RoomController]
  });

  useContainer(new InversifyAdapter(container));

  app.listen(config.port);
}

main();
