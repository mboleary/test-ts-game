/**
 * ECS Database: Provides the store for entities and components as well as some indexes
 */

import { Component } from "../Component";
import { Entity } from "../Entity";
import { ComponentKeyType } from "../type/ComponentKey.type";
import { GetAllEntitiesOptions } from "../type/GetAllEntitiesOptions.type";
import { sameKeys } from "./archetypeGraph/util/compareKeys";
import { AddEntityParameters, Archetype } from "./Archetype";
import { Graph } from "./archetypeGraph/Graph";
import { GraphNode } from "./archetypeGraph/GraphNode";

export class ECSDB {

  // new implementation
  // private readonly archetypes: Archetype[] = [];
  // private readonly archetypeRoot: Archetype;
  private readonly archetypeGraph: Graph<Archetype, ComponentKeyType>;
  private readonly entityArchetypeMap: Map<string, Archetype> = new Map();  

  constructor() {
    // this.archetypeRoot = ;
    // this.archetypes.push(this.archetypeRoot);
    this.archetypeGraph = new Graph(new Archetype(this, []));
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

  /**
   * Traverse the ArchetypeGraph to find an Archetype to use or create one
   * @param componentKeys 
   */
  private findOrCreateArchetypeByComponentKeys(componentKeys: ComponentKeyType[]): Archetype {
    const root = this.archetypeGraph.getRootNode();
    if (!root) {
      throw new Error('ArchetypeGraph is empty, this shouldn\'t happen');
    }

    let curr = root, prev = null;
    for (const key of componentKeys) {
      const next = curr.getGraphNode(key);
      if (next) {
        curr = next;
      } else {
        // No node exists for this collection of keytypes, create one
        const arch = new Archetype(this, componentKeys);
        const graphNode: GraphNode<Archetype, ComponentKeyType> = new GraphNode(arch, componentKeys);

        // Connect graph
        curr.addGraphNode(key, graphNode);

        // This is the case of the existing graph not having a specific-enough graph node (archetype) for the given keys
        return arch;
      }
    }

    // Check archetype keys against componentkeys
    const archKeys = curr.value.getComponentKeys();

    const same = sameKeys(componentKeys, archKeys);

    if (same) {
      return curr.value;
    } else {
      // This is the case of the existing archetype having too many keys compared to the given keys
      // Need to make a new Archetype and insert it into the graph
      const arch = new Archetype(this, componentKeys);
      // @TODO insert into graph
      return arch;
    }
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
    const archetypeNode = this.archetypeGraph.getRootNode();
    // @TODO handle this properly
    if (!archetypeNode) throw new Error('no root archetype');
    const archetype = archetypeNode?.value;
    if (components && components.length) {
      // check types, find an archetype that can support it, or modify a smaller archetype to accomodate it
      const keysPresentInComponents = this.getComponentKeys(components);

      // Start at root, add components

      // archetype = this.archetypes[maxIndex];

      // Add any necessary component key types
      // if (keysPresentInComponents.length > maxTypes.length) {
      //   const missing = this.getMissingTypes(maxTypes, keysPresentInComponents);
      //   console.log({missing, maxTypes, keysPresentInComponents});
      //   missing.forEach(type => archetype.registerComponentKey(type));
      // }
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
    return this.archetypeGraph.getNodes().map(node => node.value);
  }
}
