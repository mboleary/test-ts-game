import { inject, injectable } from "inversify";
import winston from "winston";
import { Config } from "../config/Config";
import { CONFIG_TOKEN } from "../config/tokens";

@injectable()
export class Logger {
  public readonly logger: winston.Logger;
  constructor(
    @inject(CONFIG_TOKEN) private readonly config: Config
  ) {
    this.logger = winston.createLogger({
      level: this.config.logLevel,
      transports: [
        new winston.transports.Console(),
      ]
    });
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }
}
