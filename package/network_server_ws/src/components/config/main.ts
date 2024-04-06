import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { readFile } from "fs/promises";
import { parse } from "yaml";
import { Config } from "./Config";
import { FormatType } from "./formatType.enum";

export async function readConfigFile(path: string, format: FormatType, context: any = {}) {
  const importText = (await readFile(path)).toString();

  let result: any;

  if (format === "yaml") {
    result = parse(importText);
  } else if (format === "json") {
    result = JSON.parse(importText);
  } else {
    throw new Error(`Unknown config format ${format}`);
  }

  return result || {};
}

export async function getConfigObject<T>(ConfigClassConstructor: new () => T): Promise<T> {
  const importPath = process.env.CONFIG_PATH || "./config.yaml";
  const importFormat = process.env.CONFIG_FORMAT as FormatType || FormatType.YAML;

  const configContent = await readConfigFile(importPath, importFormat);

  console.log("content:", configContent)

  const instance = plainToInstance<T, object>(ConfigClassConstructor, configContent);
  // await validateOrReject(instance as object);

  console.log(instance);

  return instance as T;
}
