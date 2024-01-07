import { Entity } from "../Entity";
import { ECSDB } from "../db/ECSDB";
import { Manager } from "./Manager";
import { World } from "../World";
import { Component } from "../Component";

export type AddEntityInput = {
  uuid?: string;
  components?: Component[];
  children?: Entity[];
  parent?: Entity;
}

/**
 * Provides functions to access data in the ECS DB to the rest of the engine
 */
export class EntityManager extends Manager {
  constructor(ecsDB: ECSDB, world: World) {
    super(ecsDB, world);
  }

  public getAllEntities(): Entity[] {
    const toRet: Entity[] = [];
    const archetypes = this.ecsdb.getArchetypes();
    for (const archetype of archetypes) {
      toRet.push(...archetype.getAllEntities());
    }
    return toRet;
  }

  public getEntityByID(uuid: string): Entity | null {
    return this.ecsdb.getEntity(uuid);
  }

  public hasEntity(uuid: string): boolean {
    return !!this.ecsdb.getEntity(uuid);
  }

  /**
   * Create a SINGLE new entity
   * @param input data to generate entity from
   */
  public createEntity(input: AddEntityInput = {}): Entity {
    return this.ecsdb.addEntity({
      ...input
    });
  }

  public deleteEntity(uuid: string): boolean {
    return this.ecsdb.destroyEntity(uuid);
  }
}
