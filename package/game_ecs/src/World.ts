import { ECSDB } from "./db/ECSDB";
import { EntityManager } from "./managers/EntityManager";
// import { QueryManager } from "./QueryManager";

export class World /*implements Serializable, Subscribable*/ {
  private readonly ecsDB: ECSDB;
  public readonly entityManager: EntityManager;
  // public readonly queryManager: QueryManager;

  constructor(ecsdb?: ECSDB) {
    this.ecsDB = ecsdb || new ECSDB();
    this.entityManager = new EntityManager(this.ecsDB);
  }

  public merge(world: World) {
    // @TODO merge into our ECSDB
  }

  public serialize() {
    // @TODO serialize the ECS World into Structured Data
  }

  public deserialize() {
    // @TODO read serialized data into the ECSDB
  }
}
