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
  public readonly entityChildToParentDoubleMap: OneToManyDoubleMap<EntityID, EntityID> = new OneToManyDoubleMap();
  // public entityObserverMap: Map<EntityID, EventSource> = new Map();

  public getChildrenOfEntity(entity: Entity): Entity[] {
    const childIDs: string[] = this.entityChildToParentDoubleMap.getValue(entity.id) || [];
    return childIDs
      .map((id) => this.entityMap.get(id) || null)
      .filter((val) => val !== null) as Entity[];
  }

  public getParentOfEntity(entity: Entity): Entity | null {
    const id: string | undefined = this.entityChildToParentDoubleMap.getKey(entity.id);

    if (id) {
      return (this.entityMap.get(id) as Entity | undefined) || null;
    } else {
      return null;
    }
  }

  public setParentOfEntity(parentEntity: Entity, targetEntity: Entity) {
    // @TODO handle logic around ECSDB matching and overriding
    // Validate entities
    this.validateEntity(parentEntity.id);
    this.validateEntity(targetEntity.id);

    this.entityChildToParentDoubleMap.set(targetEntity.id, parentEntity.id);

    // @TODO once observers are implemented, trigger those
  }

  public detachParentFromEntity(targetEntityID: string) {
    this.validateEntity(targetEntityID);
    this.entityChildToParentDoubleMap.deleteKey(targetEntityID);

    // @TODO once observers are implemented, trigger those
  }

  public hasEntity(id: string): boolean {
    return this.entityMap.has(id);
  }

  public entityHasChild(parentEntityID: string, childEntityID: string): boolean {
    return this.entityChildToParentDoubleMap.has(childEntityID, parentEntityID);
  }

  public validateEntity(entityID: string): boolean {
    if (!this.entityMap.has(entityID)) {
      throw new Error(`Entity not found: ${entityID}`);
    }
    return true;
  }
}