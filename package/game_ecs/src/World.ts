import { ECSDB } from "./db/ECSDB";
import { Entity } from "./Entity";
import { EntityManager } from "./managers/EntityManager";
import { Manager } from "./managers/Manager";
// import { QueryManager } from "./QueryManager";

export type ManagerBuilder<T extends Manager> = (ecsdb: ECSDB, world: World) => T;

export class World /*implements Serializable, Subscribable*/ {
  private readonly ecsDB: ECSDB;
  public readonly entityManager: EntityManager;
  // public readonly queryManager: QueryManager;
  private readonly managerMap: Map<Function, Manager> = new Map();

  constructor(ecsdb?: ECSDB, managers?: ManagerBuilder<any>[]) {
    this.ecsDB = ecsdb || new ECSDB();
    this.entityManager = new EntityManager(this.ecsDB, this);
    if (managers) {
      for (const man of managers) {
        this.managerMap.set(man.constructor, this.buildManager(man));
      }
    }
  }

  public get root(): Entity | null {
    // @TODO implement this when adding flags
    return null;
    // return this.ecsDB.
  }

  // public merge(world: World) {
  //   // @TODO merge into our ECSDB
  // }

  private buildManager<T extends Manager>(managerBuilder: ManagerBuilder<T>): Manager {
    return managerBuilder(this.ecsDB, this);
  }

  public addManager<T extends Manager>(managerBuilder: ManagerBuilder<T>) {
    const manager = this.buildManager(managerBuilder);
    this.managerMap.set(manager.constructor, manager);
  }

  public getManager<T extends Manager>(managerConstructor: Function): T | null {
    return this.managerMap.get(managerConstructor) as T || null;
  }

  public getAllManagers() {
    return Array.from(this.managerMap.values());
  }
}
