/**
 * ECS Database: Provides the store for entities and components as well as some indexes
 */

import { Component } from "../Component";
import { Entity } from "../Entity";
import { ComponentKeyType } from "../type/ComponentKey.type";
import { GetAllEntitiesOptions } from "../type/GetAllEntitiesOptions.type";
import { AddEntityParameters, Archetype } from "./Archetype";

export class ECSDB {

  // new implementation
  private readonly archetypes: Archetype[] = [];
  private readonly entityArchetypeMap: Map<string, Archetype> = new Map();  

  constructor() {
    this.archetypes.push(new Archetype(this));
  }

  private getComponentKeys(components: Component[]): ComponentKeyType[] {
    const map = new Map<ComponentKeyType, boolean>();

    for (const comp of components) {
      if (map.has(comp.key)) {
        continue;
      }
      map.set(comp.key, true);
    }

    return Array.from(map.keys());
  }

  private getMissingTypes(typesInArchetype: ComponentKeyType[], typesInComponents: ComponentKeyType[]): ComponentKeyType[] {
    const toRet = [];

    for (const type of typesInComponents) {
      if (typesInArchetype.includes(type)) {
        continue;
      }
      toRet.push(type);
    }

    return toRet;
  }

  private checkTypes(keysPresentInComponents: ComponentKeyType[], types: ComponentKeyType[]): number {
    let toRet = 0;

    for (const key of keysPresentInComponents) {
      if (types.includes(key)) {
        toRet += 1;
      }
    }

    return toRet;
  }

  public getArchetypeForEntityUuid(uuid: string): Archetype {
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
    if (components && components.length) {
      // check types, find an archetype that can support it, or modify a smaller archetype to accomodate it
      const keysPresentInComponents = this.getComponentKeys(components);

      let max = -1, maxIndex = 0, maxTypes: ComponentKeyType[] = [];

      for (let i = 0; i < this.archetypes.length; i++) {
        const archetype = this.archetypes[i]
        const types = archetype.getComponentKeys();
        const score = this.checkTypes(keysPresentInComponents, types);
        if (score > max) {
          console.log("score:", score, max);
          maxIndex = i;
          max = score;
          maxTypes = types;
          if (max === keysPresentInComponents.length) {
            break;
          }
        }
      }

      archetype = this.archetypes[maxIndex];

      // Add any necessary component key types
      if (keysPresentInComponents.length > maxTypes.length) {
        const missing = this.getMissingTypes(maxTypes, keysPresentInComponents);
        console.log({missing, maxTypes, keysPresentInComponents});
        missing.forEach(type => archetype.registerComponentKey(type));
      }
    }

    const entity = archetype.addEntity({uuid, ref, active, temp, mounted, parent, children, components});

    this.entityArchetypeMap.set(entity.id, archetype);

    return entity;
  }

  public destroyEntity(uuid: string): boolean {
    const archetype = this.entityArchetypeMap.get(uuid);

    if (!archetype) {
      return false;
    }

    archetype.removeEntity(uuid);

    this.entityArchetypeMap.delete(uuid);

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
  public getComponentsOfEntity(uuid: string): ComponentKeyType[] {
    const archetype = this.getArchetypeForEntityUuid(uuid);
    return archetype.getEntityComponentArray(uuid);
  }

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

  public setComponent<T>(targetUuid: string, key: ComponentKeyType, data: T) {
    const archetype = this.getArchetypeForEntityUuid(targetUuid);
    archetype.setEntityComponent(targetUuid, key, data);
  }

  public getComponentFromEntity<T>(targetUuid: string, key: ComponentKeyType): T | null {
    const archetype = this.getArchetypeForEntityUuid(targetUuid);
    return archetype.getEntityComponent(targetUuid, key);
  }

  // public getAllEntityUuids({
  //   includeDeleted = false,
  //   includeMounted = true,
  //   includeActive = true
  // }: GetAllEntitiesOptions = {}): Entity[] {
  //   const toRet = [];

  //   for (const archetype of this.archetypes) {

  //   }
  // }

  public getArchetypes(): Archetype[] {
    return this.archetypes;
  }
}
