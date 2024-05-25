import { v4 as uuidv4 } from "uuid";
import { Component } from "../Component";
import { Entity } from "../Entity";
import { ComponentKeyType } from "../type/ComponentKey.type";
import { GetAllEntitiesOptions } from "../type/GetAllEntitiesOptions.type";
import { ECSDB } from "./ECSDB";

export type AddEntityParameters = {
  uuid?: string;
  ref?: Entity;
  active?: boolean;
  temp?: boolean;
  mounted?: boolean;
  parent?: Entity;
  children?: Entity[];
  components?: Component[];
}

export type ForEachCallback = (ref: Entity, index: number) => Entity[];

export class Archetype {
  constructor(
    private readonly ecsdb: ECSDB,
    private readonly componentTypes: any[]
  ) { }

  // Entity-related arrays
  // Entity UUID
  private uuid: string[] = [];
  // Entity object reference
  private ref: Entity[] = [];
  // Flag for Entity being active (process with systems)
  private active: boolean[] = [];
  // Temporary Entity (product of transaction) flag
  private temp: Boolean[] = [];
  private mounted: boolean[] = [];
  private deleted: boolean[] = [];
  private parent: (Entity | null)[] = [];
  private children: Entity[][] = [];
  private readonly components: any[][] = [];

  // Track indexes of the Entities by uuid
  private readonly uuidMap: Map<string, number> = new Map();
  // used to actively enforce types in arrays
  private readonly typeMap: Map<ComponentKeyType, any> = new Map();
  // Index of where in the component array the component lives
  private readonly typeIndex: Map<ComponentKeyType, number> = new Map();
  private matrixLength: number = 0;

  private insertExistingEntity(
    ref: Entity,
    uuid: string,
    active: boolean,
    temp: boolean,
    mounted: boolean,
    parent: Entity | null,
    children: Entity[],
    components?: Component[]
  ): Entity {

    const entityIndex = this.matrixLength;

    this.uuid.push(uuid);
    this.ref.push(ref);
    this.active.push(active);
    this.temp.push(temp);
    this.mounted.push(mounted);
    this.deleted.push(false);
    this.parent.push(parent);
    this.children.push(children);

    if (components) {
      for (const comp of components) {
        const idx = this.typeIndex.get(comp.key);
        if (idx === undefined) {
          console.warn(`No component type index available for type ${String(comp.key)} on entity uuid ${uuid}. Skipping...`);
          continue;
        }
        this.components[idx].push(comp.data);
      }
    }

    // @TODO may need to update ref

    this.uuidMap.set(uuid, entityIndex);

    this.matrixLength += 1;

    return ref;
  }

  private buildNewEntity(
    uuid: string,
    active: boolean,
    temp: boolean,
    mounted: boolean,
    parent: Entity | null,
    children: Entity[],
    components?: Component[]
  ): Entity {
    // @TODO update Entity constructor
    const newEntity = new Entity(this.ecsdb, uuid, children);

    const entityIndex = this.matrixLength;

    this.uuid.push(uuid);
    this.ref.push(newEntity);
    this.active.push(active);
    this.temp.push(temp);
    this.mounted.push(mounted);
    this.deleted.push(false);
    this.parent.push(parent);
    this.children.push(children);

    if (components) {
      for (const comp of components) {
        const idx = this.typeIndex.get(comp.key);
        if (idx === undefined) {
          console.warn(`No component type index available for type ${String(comp.key)} on entity uuid ${uuid}. Skipping...`);
          continue;
        }
        this.components[idx].push(comp.data);
      }
    }

    this.uuidMap.set(uuid, entityIndex);

    return newEntity;
  }

  /**
   * Remove all of a type of component from the component array
   * @param key 
   * @returns 
   */
  private trimComponentType(key: ComponentKeyType): boolean {
    const index = this.typeIndex.get(key);

    if (index === undefined) {
      return false;
    }

    this.components.splice(index, 1);

    this.typeIndex.delete(key);
    this.typeMap.delete(key);

    return true;
  }

  private allocComponentType(key: ComponentKeyType) {
    // Add an array to handle the component data
    this.components.push(Array(this.matrixLength).fill(null));
    const index = this.components.length - 1;

    // Allocate an index for the component type
    this.typeIndex.set(key, index);
    console.log("allocComponent:", key, index, this.components, this.matrixLength);

    // Register data type for the component
    // @TODO later
  }

  private getIndexOrThrow(uuid: string): number {
    const index = this.uuidMap.get(uuid);

    if (index !== undefined) {
      return index;
    }
    throw new Error(`Entity ${uuid} does not exist in this Archetype`);
  }

  /**
   * Add an Entity to the Archetype
   * @param param0 Entity Parameters
   */
  public addEntity({
    uuid,
    ref,
    active = false,
    temp = false,
    mounted = false,
    parent,
    children,
    components
  }: AddEntityParameters = {}): Entity {
    if (uuid && this.uuidMap.has(uuid)) {
      throw new Error('Already has uuid ' + uuid);
    }

    if (uuid && ref) {
      // This is likely being moved from another archetype
      return this.insertExistingEntity(
        ref,
        uuid,
        active,
        temp,
        mounted,
        parent || null,
        children || [],
        components
      );
    } else {
      return this.buildNewEntity(
        uuid || uuidv4(),
        active,
        temp,
        mounted,
        parent || null,
        children?.slice() || [],
        components
      );
    }
  }

  public getEntityParent(uuid: string): Entity | null {
    const index = this.getIndexOrThrow(uuid);
    return this.parent[index];
  }

  // can be used to migrate from one archetype to another as well as generally removing entities
  public removeEntity(uuid: string) {
    const index = this.getIndexOrThrow(uuid);

    this.deleted[index] = true;

    for (let i = 0; i < this.components.length; i++) {
      this.components[i][index] = null;
    }

    this.uuidMap.delete(uuid);
  }

  public getEntity(uuid: string): Entity | null {
    const index = this.uuidMap.get(uuid);

    if (index === undefined) {
      return null;
    }

    return this.ref[index];
  }

  public setEntityActive(uuid: string, state: boolean) {
    const index = this.getIndexOrThrow(uuid);

    this.active[index] = state;
  }

  public setEntityTemp(uuid: string, state: boolean) {
    const index = this.getIndexOrThrow(uuid);

    this.temp[index] = state;
  }

  public setEntityMounted(uuid: string, state: boolean) {
    const index = this.getIndexOrThrow(uuid);

    this.mounted[index] = state;
  }
  public setEntityParent(uuid: string, parentRef: Entity | null) {
    const index = this.getIndexOrThrow(uuid);

    this.parent[index] = parentRef;
  }

  public setEntityComponent(
    uuid: string, 
    componentKey: ComponentKeyType, 
    componentData: any
  ) {
    const index = this.getIndexOrThrow(uuid);

    // const type = this.typeMap.get(componentKey);

    // Verify data adheres to type rules
    // if (componentData instanceof type) {
    const compIndex = this.typeIndex.get(componentKey);

    if (!compIndex) {
      throw new Error(`Missing index for Component Type ${String(componentKey)} in Archetype`);
    }

    this.components[compIndex][index] = componentData;
    // } else {
    //   throw new Error(`Component data is not an instance of type ${type} when setting component ${String(componentKey)} in Entity ${uuid} in Archetype`);
    // }

  }

  public getEntityComponent<T>(
    uuid: string,
    componentKey: ComponentKeyType
  ): T | null { 
    const index = this.getIndexOrThrow(uuid);

    const compIndex = this.typeIndex.get(componentKey);

    if (compIndex === undefined) {
      return null;
    }

    return this.components[compIndex][index] as T;
  }

  public entityHasComponent(uuid: string, key: ComponentKeyType): boolean {
    const index = this.getIndexOrThrow(uuid);

    const compIndex = this.typeIndex.get(key);

    if (compIndex === undefined) {
      return false;
    }

    return this.components[compIndex][index] !== null;
  }

  public getComponentKeys(): ComponentKeyType[] {
    return Array.from(this.typeIndex.keys());
  }

  public addComponentKey(key: ComponentKeyType) {
    if (this.typeIndex.has(key)) return;

    this.allocComponentType(key);
  }

  public removeComponentKey(key: ComponentKeyType) {
    if (!this.typeIndex.has(key)) {
      return;
    }

    this.trimComponentType(key);
  }

  public getEntityChildrenArray(uuid: string): Entity[] {
    const index = this.getIndexOrThrow(uuid);

    return this.children[index];
  }

  public getEntityComponentArray(uuid: string): ComponentKeyType[] {
    const index = this.getIndexOrThrow(uuid);
    const toRet = [];

    for (const key of this.typeIndex.keys()) {
      const compIndex = this.typeIndex.get(key);

      if (compIndex === undefined) {
        continue;
      }

      if (this.components[compIndex][index] !== null) {
        toRet.push(key);
      }
    }

    return toRet;
  }

  public getAllEntities({
    deletedEquals,
    mountedEquals,
    activeEquals,
    hasComponents,
  }: GetAllEntitiesOptions = {}): Entity[] {
    const toRet: Entity[] = [];
    // for (let i = 0; i < this.matrixLength; i++) {
    //   if (this.temp[i]) continue;
    //   if (deletedEquals !== undefined && deletedEquals !== this.deleted[i]) {
    //     continue;
    //   }
    //   if (mountedEquals !== undefined && mountedEquals !== this.mounted[i]) {
    //     continue;
    //   }
    //   if (activeEquals !== undefined && activeEquals !== this.active[i]) {
    //     continue;
    //   }
    //   toRet.push(this.ref[i]);
    // }
    if (hasComponents) {
      let indicies = hasComponents.map((val) => this.typeIndex.get(val)).filter(val => val !== undefined).sort() as number[];

      for (const i of indicies) {
        const compArr = this.components[i];

        
      }
    }
    return toRet;
  }
}
