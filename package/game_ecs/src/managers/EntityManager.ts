import { Entity } from "../Entity";
import { ECSDB } from "../db/ECSDB";
import { v4 as uuidv4 } from "uuid";
import { Manager } from "./Manager";
import { World } from "../World";

type RawEntityData = Partial<Omit<Entity, "id">>;
type RawMultipleEntityData = RawEntityData & {
  children: RawMultipleEntityData | Entity[];
  parent: RawMultipleEntityData | Entity;
};

/**
 * Provides functions to access data in the ECS DB to the rest of the engine
 */
export class EntityManager extends Manager {
  constructor(ecsDB: ECSDB, world: World) {
    super(ecsDB, world);
  }

  public getAllEntities(): Entity[] {
    // return Array.from(this.ecsDB.entityDB.entityMap.values());
    
  }

  public getEntityByID(uuid: string): Entity | null {
    return (this.ecsDB.entityDB.entityMap.get(uuid) as Entity | undefined) || null;
  }

  public hasEntity(uuid: string): boolean {
    return this.ecsDB.entityDB.entityMap.has(uuid);
  }

  /**
   * Create a SINGLE new entity
   * @param rawEntityData data to generate entity from
   */
  public createEntity(rawEntityData: RawEntityData = {}): Entity {
    const uuid = uuidv4();
    const entity = new Entity(uuid, this.ecsDB);

    Object.seal(entity);
    this.ecsDB.entityDB.entityMap.set(uuid, entity);

    // if (rawEntityData.tags) {
    //   for (const tag of rawEntityData.tags) {
    //     this.ecsDB.entityToTagMap.set(uuid, tag);
    //   }
    // }

    if (rawEntityData.parent) {
      // @TODO set parent if present in db
    }

    if (rawEntityData.children) {
      for (const child of rawEntityData.children) {
        // @TODO set children if present
      }
    }

    if (rawEntityData.components) {
      for (const comp of rawEntityData.components) {
        entity.attachComponent(comp);
      }
    }

    return entity;
  }

  public createMultipleEntities(rawEntityData: RawMultipleEntityData): Entity {
    const entity = this.createEntity(rawEntityData);

    // Create children and parent if they don't already exist
    rawEntityData.children?.forEach((child) => {
      if (child.id) {
        // Attach child
        if (this.ecsDB.entityDB.validateEntity(child.id)) {
          this.ecsDB.entityDB.setParentOfEntity(entity, child);
        }
      } else {
        const childEntity = this.createEntity(child);
        this.ecsDB.entityDB.setParentOfEntity(entity, childEntity);
      }
    });

    if (rawEntityData.parent) {
      if (rawEntityData.parent.id) {
        this.ecsDB.entityDB.setParentOfEntity(rawEntityData.parent, entity);
      } else {
        const parentEntity = this.createEntity(rawEntityData.parent);
        this.ecsDB.entityDB.setParentOfEntity(parentEntity, entity);
      }
    }

    return entity;
  }

  public deleteEntity(uuid: string): boolean {
    const baseEntity = this.ecsDB.entityDB.entityMap.get(uuid);

    if (!baseEntity) return false;

    // @TODO check if this is parent of anything

    // @TODO check if this is child of anything

    // @TODO check various caches to see if this needs to be removed

    this.ecsDB.entityDB.entityMap.delete(uuid);

    return true;
  }
}
