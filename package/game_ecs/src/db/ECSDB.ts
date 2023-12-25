/**
 * ECS Database: Provides the store for entities and components as well as some indexes
 */

import { Component } from "../Component";
import { Entity } from "../Entity";
import { ComponentKeyType } from "../type/ComponentKey.type";
import { AddEntityParameters, Archetype } from "./Archetype";

export class ECSDB {

  // new implementation
  private readonly archetypes: Archetype[] = [];
  private readonly entityArchetypeMap: Map<string, Archetype> = new Map();  

  constructor() {
    this.archetypes.push(new Archetype(this));
  }

  private checkTypes(components: Component[], types: ComponentKeyType[]): number {
    let toRet = 0;

    for (const comp of components) {
      if (types.includes(comp.key)) {
        toRet += 1;
      }
    }

    return toRet;
  }

  private getArchetypeForEntityUuid(uuid: string): Archetype {
    if (!this.entityArchetypeMap.has(uuid)) {
      throw new Error(`No Archetype for Entity ${uuid}`);
    }
    return this.entityArchetypeMap.get(uuid) as Archetype;
  }

  public addEntity({
    uuid,
    ref,
    active,
    temp,
    mounted,
    parent,
    children,
    components
  }: AddEntityParameters = {}): Entity {
    let archetype = this.archetypes[0];
    if (components) {
      // check types, find an archetype that can support it, or modify a smaller archetype to accomodate it
      const scores = [];
      for (const archetype of this.archetypes) {
        const types = archetype.getComponentKeys();
        
        scores.push(this.checkTypes(components, types));
      }

      let max = -1, maxIndex = 0;
      for (let i = 0; i < scores.length; i++) {
        if (scores[i] > max) {
          maxIndex = i;
        }
      }

      archetype = this.archetypes[maxIndex];
    }

    return archetype.addEntity({uuid, ref, active, temp, mounted, parent, children});
  }

  public destroyEntity(uuid: string): boolean {
    const archetype = this.entityArchetypeMap.get(uuid);

    if (!archetype) {
      return false;
    }

    archetype.removeEntity(uuid);

    return true;
  }

  public getEntity(uuid: string): Entity | null {
    const archetype = this.entityArchetypeMap.get(uuid);

    if (!archetype) {
      return null;
    }

    return archetype.getEntity(uuid);
  }

  public getParentOfEntity(uuid: string): Entity | null {
    const archetype = this.entityArchetypeMap.get(uuid);

    if (!archetype) {
      return null;
    }

    return archetype.getEntityParent(uuid);
  }

  // Might not be necessary
  // public getChildrenOfEntity(uuid: string): (Entity | null)[] {}

  // Might not be necessary
  // public getComponentsOfEntity(uuid: string): ComponentKeyType[] {}

  public attachChild(targetUuid: string, childUuid: string) {
    const targetArchetype = this.getArchetypeForEntityUuid(targetUuid);
    const childArchetype = this.getArchetypeForEntityUuid(childUuid);
    const targetEntity = targetArchetype.getEntity(targetUuid);
    const childEntity = childArchetype.getEntity(childUuid);

    if (!(targetEntity && childEntity)) {
      throw new Error(`Parent ${targetUuid} or Child ${childUuid} do not exist`)
    }

    if (childEntity.parent === targetEntity) return;

    if (childEntity.parent) {
      // Detach the old parent first
      this.detachChild(childEntity.parent.id, childUuid);
    }

    childArchetype.setEntityParent(childUuid, targetEntity);
    targetEntity.children.push(childEntity);
  }

  public detachChild(targetUuid: string, childUuid: string): boolean {
    const targetArchetype = this.getArchetypeForEntityUuid(targetUuid);
    const childArchetype = this.getArchetypeForEntityUuid(childUuid);

    const childParent = childArchetype.getEntityParent(childUuid);

    // If the child / parent relationship doesn't exist, return false
    if (childParent?.id !== targetUuid) return false;

    const targetEntity = targetArchetype.getEntity(targetUuid);
    const childEntity = childArchetype.getEntity(childUuid);

    // Sanity check for target and child entity
    if (!(targetEntity && childEntity)) {
      throw new Error(`Parent ${targetUuid} or Child ${childUuid} do not exist`)
    }

    // Remove parent from child, remove hild from parent array
    childArchetype.setEntityParent(childUuid, null);
    const childIdx = targetEntity.children.findIndex(val => val.id === childUuid);
    targetEntity.children.splice(childIdx, 1);

    return true;
  }

  public entityHasChild(targetUuid: string, childUuid: string): boolean {
    const childArchetype = this.getArchetypeForEntityUuid(childUuid);
    
    return (childArchetype.getEntityParent(childUuid)?.id === targetUuid) || false;
  }

  public attachComponent<T>(targetUuid: string, key: ComponentKeyType, data: T) {
    const archetype = this.getArchetypeForEntityUuid(targetUuid);

    const existingComponent = archetype.getEntityComponent(targetUuid, key);

    if (existingComponent) {
      this.detachComponent(targetUuid, key);
    }

    archetype.setEntityComponent(targetUuid, key, data);
  }

  public detachComponent(targetUuid: string, key: ComponentKeyType): boolean {
    const archetype = this.getArchetypeForEntityUuid(targetUuid);

    if (archetype.entityHasComponent(targetUuid, key)) {
      archetype.setEntityComponent(targetUuid, key, null);
      return true;
    }

    return false;
  }

  public getComponentFromEntity<T>(targetUuid: string, key: ComponentKeyType): T | null {
    const archetype = this.getArchetypeForEntityUuid(targetUuid);
    return archetype.getEntityComponent(targetUuid, key);
  }
}
