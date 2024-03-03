import { inject, injectable } from "inversify";
// import { Logger as WinstonLogger, createLogger, format } from "winston";
// import BrowserConsole from "winston-transport-browserconsole";
import { Types } from "../../containerTypes.enum";
import { Config } from "../config/config";

@injectable()
export class Logger {
  // public readonly logger: WinstonLogger;
  constructor(
    @inject(Types.CONFIG) private readonly config: Config
  ) {
    // this.logger = createLogger({
    //   level: this.config.logLevel,
    //   transports: [
    //     new BrowserConsole({
    //       format: format.simple()
    //     }),
    //   ]
    // });
  }

  debug(message: string) {
    console.log(message);
  }
}
