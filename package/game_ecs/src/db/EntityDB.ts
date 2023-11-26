import { Entity } from "../Entity";
import { OneToManyDoubleMap } from "../util/OneToManyDoubleMap";
import { ECSDB } from "./ECSDB";

type EntityID = string;


/**
 * Contains Entity-specific data storage
 */
export class EntityDB {
  constructor(
    private readonly ecsdb: ECSDB,
  ) {}

  public readonly entityMap: Map<EntityID, Entity> = new Map();
  // Parents have multiple children (one key to multiple values)
  public readonly entityParentToChildDoubleMap: OneToManyDoubleMap<EntityID, EntityID> = new OneToManyDoubleMap();
  // public entityObserverMap: Map<EntityID, EventSource> = new Map();

  public getChildrenOfEntity(entity: Entity): Entity[] {
    const childIDs: string[] = this.entityParentToChildDoubleMap.getValue(entity.id) || [];
    return childIDs
      .map((id) => this.entityMap.get(id) || null)
      .filter((val) => val !== null) as Entity[];
  }

  public getParentOfEntity(entity: Entity): Entity | null {
    const id: string | undefined = this.entityParentToChildDoubleMap.getKey(entity.id);

    if (id) {
      return (this.entityMap.get(id) as Entity | undefined) || null;
    } else {
      return null;
    }
  }

  public setParentOfEntity(parentEntity: Entity, childEntity: Entity) {
    // @TODO handle logic around ECSDB matching and overriding. Also ensure that relations are not being lost
    if (!this.entityMap.has(childEntity.id)) {
      // Target likely has temp ECSDB
      childEntity.overrideECSDB(this.ecsdb);
    } else if (!this.entityMap.has(parentEntity.id)) {
      // Parent likely has temp ecsdb
      parentEntity.overrideECSDB(this.ecsdb);
    }
    // Validate entities
    this.validateEntity(parentEntity.id);
    this.validateEntity(childEntity.id);

    this.entityParentToChildDoubleMap.set(parentEntity.id, childEntity.id);

    // @TODO once observers are implemented, trigger those
  }

  public detachParentFromEntity(parentEntityID: string) {
    this.validateEntity(parentEntityID);
    // @TODO check that this is correct
    this.entityParentToChildDoubleMap.deleteValue(parentEntityID);

    // @TODO once observers are implemented, trigger those
  }

  public hasEntity(id: string): boolean {
    return this.entityMap.has(id);
  }

  public entityHasChild(parentEntityID: string, childEntityID: string): boolean {
    return this.entityParentToChildDoubleMap.has(parentEntityID, childEntityID);
  }

  public validateEntity(entityID: string): boolean {
    if (!this.entityMap.has(entityID)) {
      throw new Error(`Entity not found: ${entityID}`);
    }
    return true;
  }

  /**
   * Merge entity information from a remote ECSDB into this one
   * @param remoteECSDB 
   * @returns 
   */
  public mergeEntityDB(remoteECSDB: ECSDB) {
    if (remoteECSDB === this.ecsdb) return;

    for (const [key, val] of remoteECSDB.entityDB.entityMap.entries()) {
      this.entityMap.set(key, val);
    }

    for (const [key, valArr] of remoteECSDB.entityDB.entityParentToChildDoubleMap.entries()) {
      for (const val of valArr) {
        this.entityParentToChildDoubleMap.set(key, val);
      }
    }
  }

  public getRootEntity(): Entity | null {
    const toRet = [];
    for (const k of this.entityMap.keys()) {
      if (this.entityParentToChildDoubleMap.getKey(k)) {
        continue;
      } else {
        toRet.push(k);
      }
    }
    return toRet.length ? this.entityMap.get(toRet[0]) || null : null;
  }

  public addEntity(entity: Entity) {
    this.entityMap.set(entity.id, entity);
  }
}
