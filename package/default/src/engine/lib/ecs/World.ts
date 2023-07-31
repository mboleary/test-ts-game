import { ECSDB } from "./ECSDB";
import { EntityManager } from "./EntityManager";

export class World /*implements Serializable, Subscribable*/ {
  private readonly ecsDB: ECSDB;
  public readonly entityManager: EntityManager;

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
