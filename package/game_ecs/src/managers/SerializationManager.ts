import { ECSDB } from "../db";
import { Manager } from "./Manager";

export class SerializationManager implements Manager {
  constructor(private readonly ecsdb: ECSDB) {

  }

  public serialize() {

  }

  public deserialize() {}
}
