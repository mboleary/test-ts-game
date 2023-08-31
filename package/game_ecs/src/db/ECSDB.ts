/**
 * ECS Database: Provides the store for entities and components as well as some indexes
 */

import { Component } from "../Component";
import { Entity } from "../Entity";

// type EntityWithoutJoins = Omit<Entity, "parent" | "children" | "components">;
// type ComponentWithoutJoins = Omit<Component, "entity">;

// export type EntityRelationshipType = "child" | "parent";

type EntityID = string;
type ComponentID = string;
// type EntityRelationship = {
//   id: EntityID;
//   type: EntityRelationshipType;
// };

export class ECSDB {
  constructor(
    public readonly temporary: boolean = false, 
    public readonly parent: ECSDB | null = null
  ) {}

  public canBeOverridden() {
    return this.temporary || this.parent !== null;
  }

  public canOnlyBeOverriddenBy(): ECSDB | null {
    return this.parent;
  }

  /**
   * Entity-related functionality
   */

  public entityMap: Map<EntityID, Entity> = new Map();
  // public entityByNameToIDMap: Map<string, EntityID[]> = new Map();
  // public entityToTagMap: Map<EntityID, string> = new Map();
  // @TODO deprecate and remove (bad pattern)
  // public entityToEntityMap: Map<EntityID, EntityRelationship[]> = new Map();
  public entityChildToParentMap: Map<EntityID, EntityID> = new Map();
  public entityParentToChildMap: Map<EntityID, EntityID[]> = new Map();
  public entityToComponentMap: Map<EntityID, ComponentID[]> = new Map();
  // public entityObserverMap: Map<EntityID, EventSource> = new Map();

  public getChildrenOfEntity(entity: Entity): Entity[] {
    const childIDs = this.entityParentToChildMap.get(entity.id) || [];
    return childIDs
      .map((id) => this.entityMap.get(id) || null)
      .filter((val) => val !== null) as Entity[];
  }

  public getParentOfEntity(entity: Entity): Entity | null {
    const id = this.entityChildToParentMap.get(entity.id);

    if (id) {
      return (this.entityMap.get(id) as Entity | undefined) || null;
    } else {
      return null;
    }
  }

  public getComponentsForEntity(entity: Entity): Component[] {
    const compIDs = this.entityToComponentMap.get(entity.id) || [];
    return compIDs
      .map((id) => this.componentMap.get(id) || null)
      .filter((val) => val !== null) as Component[];
  }

  public setParentOfEntity(parentEntity: Entity, targetEntity: Entity) {
    // Validate entities
    this.validateEntity(parentEntity.id);
    this.validateEntity(targetEntity.id);

    this.entityChildToParentMap.set(targetEntity.id, parentEntity.id);
    this._appendEntityChild(parentEntity.id, targetEntity.id);
  }

  public validateEntity(entityID: string): boolean {
    if (!this.entityMap.has(entityID)) {
      throw new Error(`Entity not found: ${entityID}`);
    }
    return true;
  }

  private _appendEntityChild(parentEntityID: string, childEntityID: string) {
    let arr = this.entityParentToChildMap.get(parentEntityID);

    if (!arr) {
      arr = [];
    }

    arr.push(childEntityID);
    this.entityParentToChildMap.set(parentEntityID, arr);
  }

  /**
   * Component-related functionality
   */

  public componentMap: Map<ComponentID, Component> = new Map();
  // public componentByNameToIDMap: Map<string, ComponentID[]> = new Map();
  public componentToEntityIDMap: Map<ComponentID, EntityID> = new Map();
  public componentByTypeToIDMap: Map<string, ComponentID[]> = new Map();
  // public componentObserverMap: Map<EntityID, EventSource> = new Map();

  public getEntityForComponent(comp: Component): Entity | null {
    const id = this.componentToEntityIDMap.get(comp.id);

    if (id) {
      return (this.entityMap.get(id) as Entity | undefined) || null;
    } else {
      return null;
    }
  }
}
