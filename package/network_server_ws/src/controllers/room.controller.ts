import { inject, injectable } from "inversify";
import { Controller, Delete, Get, Param, Post, Put } from "routing-controllers";
import { Config } from "../components/config/Config";
import { CONFIG_TOKEN } from "../components/config/tokens";
import { Logger } from "../components/logger/Logger";

@injectable()
@Controller()
export class RoomController {
  constructor(
    @inject(CONFIG_TOKEN) private readonly config: Config,
    @inject(Logger) private readonly logger: Logger
  ) {}

  @Get('/')
  public getAll() {
    return [];
  }

  @Get('/:id')
  public getOne(
    @Param('id') id: string,
  ) {
    return null;
  }

  @Get('/:id/ws')
  public connectWebsocket(
    @Param('id') id: string,
  ) {
    return null;
  }

  @Post('/')
  public create(
    @Param('id') id: string,
  ) {
    return null;
  }

  @Put('/:id')
  public update(
    @Param('id') id: string,
  ) {
    return null;
  }

  @Delete('/:id')
  public destroy(
    @Param('id') id: string,
  ) {
    return null;
  }
}
