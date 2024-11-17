import { v4 as uuidv4 } from "uuid";
import { Entity } from "./Entity";
import { ComponentAndKey, ECSWorldInternals } from "./db/ECSWorldInternals";
import { QueryManager } from "./query/QueryManager";
import { QueryObject } from "./query/type/Query.type";
import { EntityRelationshipManager } from "./db";

export class World {
  protected readonly internals = new ECSWorldInternals();
  protected readonly queryManager = new QueryManager(this.internals);

  constructor() {
    
  }

  public get root(): Entity | null {
    // @TODO implement this when adding flags
    return null;
    // return this.ecsDB.
  }

  public createEntity(id?: string, components?: ComponentAndKey[]): Entity {
    return this.internals.entityCreate(id || uuidv4(), components || []);
  }

  public getEntity(id: string): Entity | undefined {
    return this.internals.entityGet(id || uuidv4());
  }

  public deleteEntity(id: string) {
    this.internals.entityDelete(id);
  }

  public query(queryObject: QueryObject): Entity[] {
    return this.queryManager.runQuery(queryObject);
  }
}
