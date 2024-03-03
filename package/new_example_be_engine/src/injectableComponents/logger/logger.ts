import { inject, injectable } from "inversify";
import winston from "winston";
import { Types } from "../../containerTypes.enum";
import { Config } from "../config/config";

@injectable()
export class Logger {
  public readonly logger: winston.Logger;
  constructor(
    @inject(Types.CONFIG) private readonly config: Config
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
}
