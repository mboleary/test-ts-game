import { injectable } from "inversify";
import winston from "winston";

@injectable()
export class Config {
  constructor() {
    
  }

  public get logLevel(): string {
    return "debug";
  }
}
