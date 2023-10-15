import { ECSDB } from "./db/ECSDB";
import { Entity } from "./Entity";
import { EntityManager } from "./managers/EntityManager";
import { Manager } from "./managers/Manager";
// import { QueryManager } from "./QueryManager";

export class World /*implements Serializable, Subscribable*/ {
  private readonly ecsDB: ECSDB;
  public readonly entityManager: EntityManager;
  // public readonly queryManager: QueryManager;
  private readonly managerMap: Map<Function, Manager> = new Map();

  constructor(ecsdb?: ECSDB, managers?: Manager[]) {
    this.ecsDB = ecsdb || new ECSDB();
    this.entityManager = new EntityManager(this.ecsDB);
    if (managers) {
      for (const man of managers) {
        this.managerMap.set(man.constructor, man);
      }
    }
  }

  public get root(): Entity | null {
    return this.ecsDB.entityDB.getRootEntity();
  }

  public merge(world: World) {
    // @TODO merge into our ECSDB
  }

  public addManager(manager: Manager) {
    this.managerMap.set(manager.constructor, manager);
  }

  public getManager<T extends Manager>(managerConstructor: Function): T | null {
    return this.managerMap.get(managerConstructor) as T || null;
  }

  public getAllManagers() {
    return Array.from(this.managerMap.values());
  }
}
