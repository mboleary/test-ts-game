import { ECSDB } from "./db/ECSDB";
import { World } from "./World";
import { Entity } from "./Entity";

export class Scene extends Entity {

  public readonly world: World;

  constructor(
    id: string,
    ecsdb?: ECSDB
  ) {
    super(ecsdb || new ECSDB(), id, []);
    this.world = new World(this.ecsdb);
  }
}
