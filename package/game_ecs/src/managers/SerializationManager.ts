import { ECSDB } from "../db";
import { World } from "../World";
import { Manager } from "./Manager";

export class SerializationManager extends Manager {
  constructor(ecsdb: ECSDB, world: World) {
    super(ecsdb, world);
  }

  public serialize() {

  }

  public deserialize() {}
}
