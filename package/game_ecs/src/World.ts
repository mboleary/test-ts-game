import { v4 as uuidv4 } from "uuid";
import { Entity } from "./Entity";
import { ComponentAndKey, ECSWorldInternals } from "./db/ECSWorldInternals";
import { QueryManager } from "./query/QueryManager";
import { QueryObject } from "./query/type/Query.type";
import { SystemManager } from "./system/SystemManager";
import { CachedQueryManager } from "./query/CachedQueryManager";
import { System } from "./system/System";

export class World {
  protected readonly internals = new ECSWorldInternals();
  protected readonly queryManager = new QueryManager(this.internals);
  protected readonly cachedQueryManager = new CachedQueryManager(this.internals, this.queryManager);
  protected readonly systemManager = new SystemManager(this.internals, this.cachedQueryManager, this, []);

  constructor() {
    
  }

  /* Entity-related Methods */

  public createEntity(id?: string, components?: ComponentAndKey[]): Entity {
    return this.internals.entityCreate(id || uuidv4(), components || []);
  }

  public getEntity(id: string): Entity | undefined {
    return this.internals.entityGet(id);
  }

  public deleteEntity(id: string) {
    this.internals.entityDelete(id);
  }

  /* Query-related Methods */

  public query(queryObject: QueryObject): Entity[] {
    return this.queryManager.runQuery(queryObject);
  }

  /* System-related Methods */

  public addSystem(system: System) {
    this.systemManager.addSystem(system);
  }

  public getSystem(systemId: string) {
    this.systemManager.getSystem(systemId);
  }

  public removeSystem(systemId: string) {
    this.systemManager.removeSystem(systemId);
  }

  public runLifecycle(systemLifecycle: string) {
    this.systemManager.runLifecycle(systemLifecycle);
  }

  public enableEventDrivenLifecycles() {
    this.systemManager.enableEventDrivenLifecycles();
  }

  /* Misc */

  /**
   * Merges another world into this one. This has the effect of clearing out the old world and breaking any references to the old entities.
   * @param targetWorld World to merge into this one
   */
  public merge(targetWorld: World) {
    this.internals.merge(targetWorld.internals);
    this.systemManager.merge(targetWorld.systemManager);
  }

  public clear() {
    
  }
}
