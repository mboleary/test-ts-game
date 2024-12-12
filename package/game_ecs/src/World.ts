import { v4 as uuidv4 } from "uuid";
import { Entity } from "./Entity";
import { ComponentAndKey, ECSWorldInternals } from "./db/ECSWorldInternals";
import { QueryManager } from "./query/QueryManager";
import { QueryObject } from "./query/type/Query.type";
import { EntityRelationshipManager } from "./db";
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

  public get root(): Entity | null {
    // @TODO implement this when adding flags
    return null;
    // return this.ecsDB.
  }

  /* Entity-related Methods */

  public createEntity(id?: string, components?: ComponentAndKey[]): Entity {
    return this.internals.entityCreate(id || uuidv4(), components || []);
  }

  public getEntity(id: string): Entity | undefined {
    return this.internals.entityGet(id || uuidv4());
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

  public clear() {
    
  }
}
