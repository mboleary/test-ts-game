import { v4 as uuidv4 } from "uuid";
import { Entity } from "./Entity";
import { ComponentAndKey, ECSWorldInternals } from "./db/ECSWorldInternals";

export class World {
  protected readonly internals = new ECSWorldInternals();

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
}
