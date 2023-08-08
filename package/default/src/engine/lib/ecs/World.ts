import { ECSDB } from "./ECSDB";
import { EntityManager } from "./EntityManager";
// import { QueryManager } from "./QueryManager";

export class World /*implements Serializable, Subscribable*/ {
  private readonly ecsDB: ECSDB;
  public readonly entityManager: EntityManager;
  // public readonly queryManager: QueryManager;

  constructor() {
    this.ecsDB = new ECSDB();
    this.entityManager = new EntityManager(this.ecsDB);
  }

  public serialize() {
    // @TODO serialize the ECS World into Structured Data
  }

  public deserialize() {
    // @TODO read serialized data into the ECSDB
  }
}
