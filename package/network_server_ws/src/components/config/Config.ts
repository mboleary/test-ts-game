import { IsDefined, isDefined, IsIP, IsNumber, IsString } from "class-validator";
import { injectable } from "inversify";

@injectable()
export class Config {
  @IsDefined()
  @IsString()
  logLevel: string;

  @IsDefined()
  @IsNumber()
  port: number;

  @IsDefined()
  @IsIP()
  listenAddr: string = "127.0.0.1";
}
