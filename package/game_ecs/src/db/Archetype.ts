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

const SLOT_INC = 5;

export class Archetype {
  constructor(
    private readonly ecsdb: ECSDB
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
  private firstFreeSlotIndex: number = -1;
  private deletedEntities: number = 0;

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
    let slotIndex = this.getFirstFreeSlot();

    if (slotIndex === -1) {
      // New slots need to be added
      slotIndex = this.matrixLength; // will definitionally be first available slot
      this.alloc(SLOT_INC);
    }

    this.uuid[slotIndex] = uuid;
    this.ref[slotIndex] = ref;
    this.active[slotIndex] = active;
    this.temp[slotIndex] = temp;
    this.mounted[slotIndex] = mounted;
    this.deleted[slotIndex] = false;
    this.parent[slotIndex] = parent;
    this.children[slotIndex] = children;

    if (components) {
      for (const comp of components) {
        const idx = this.typeIndex.get(comp.key);
        if (idx === undefined) {
          console.warn(`No component type index available for type ${String(comp.key)} on entity uuid ${uuid}. Skipping...`);
          continue;
        }
        this.components[idx][slotIndex] = comp.data;
      }
    }

    // @TODO may need to update ref

    this.uuidMap.set(uuid, slotIndex);

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

    let slotIndex = this.getFirstFreeSlot();

    if (slotIndex === -1) {
      // New slots need to be added
      slotIndex = this.matrixLength; // will definitionally be first available slot
      this.alloc(SLOT_INC);
    }

    this.uuid[slotIndex] = uuid;
    this.ref[slotIndex] = newEntity;
    this.active[slotIndex] = active;
    this.temp[slotIndex] = temp;
    this.mounted[slotIndex] = mounted;
    this.deleted[slotIndex] = false;
    this.parent[slotIndex] = parent;
    this.children[slotIndex] = children;

    if (components) {
      for (const comp of components) {
        const idx = this.typeIndex.get(comp.key);
        if (idx === undefined) {
          console.warn(`No component type index available for type ${String(comp.key)} on entity uuid ${uuid}. Skipping...`);
          continue;
        }
        this.components[idx][slotIndex] = comp.data;
      }
    }

    // @TODO may need to update ref

    this.uuidMap.set(uuid, slotIndex);

    return newEntity;
  }

  private getFirstFreeSlot() {
    // @TODO store first slot value
    const index = this.deleted.findIndex((val) => !val);
    return index;
  }

  /**
   * Increase the number of slots
   * @param slots number of slots
   */
  private alloc(slots: number) {
    this.uuid = this.uuid.concat(Array(slots).fill(null));
    this.ref = this.ref.concat(Array(slots).fill(null));
    this.active = this.active.concat(Array(slots).fill(false));
    this.temp = this.temp.concat(Array(slots).fill(false));
    this.mounted = this.mounted.concat(Array(slots).fill(false));
    this.deleted = this.deleted.concat(Array(slots).fill(true));
    this.parent = this.parent.concat(Array(slots).fill(null));
    this.children = this.children.concat(Array(slots).fill([]));
    this.components.forEach((compArr, idx) => {
      this.components[idx] = compArr.concat(Array(slots).fill(null));
    }, this);

    this.matrixLength += slots;
  }

  /**
   * Shift all non-deleted entities to the left in the array
   */
  private defragment() {
    let currIndex = 0;

    const firstOpenIndex = this.getFirstFreeSlot();

    if (firstOpenIndex === -1) return;

    currIndex = firstOpenIndex;

    for (let i = firstOpenIndex + 1; i < this.matrixLength; i++) {
      if (this.deleted[i]) {
        continue;
      } else {
        // Swap deleted slot (earlier in the array) with a non-deleted slot (later in array)
        this.swapIndex(i, currIndex);
        currIndex = i;
      }
    }
  }

  /**
   * Swap the values stored in 2 indexes
   * @param indexA Index A
   * @param indexB Index B
   */
  private swapIndex(indexA: number, indexB: number) {
    const uuid = this.uuid[indexA];
    const ref = this.ref[indexA];
    const active = this.active[indexA];
    const temp = this.temp[indexA];
    const mounted = this.mounted[indexA];
    const deleted = this.deleted[indexA];
    const parent = this.parent[indexA];
    const children = this.children[indexA];

    this.uuid[indexA] = this.uuid[indexB];
    this.ref[indexA] = this.ref[indexB];
    this.active[indexA] = this.active[indexB];
    this.temp[indexA] = this.temp[indexB];
    this.mounted[indexA] = this.mounted[indexB];
    this.deleted[indexA] = this.deleted[indexB];
    this.parent[indexA] = this.parent[indexB];
    this.children[indexA] = this.children[indexB];

    this.uuid[indexB] = uuid;
    this.ref[indexB] = ref;
    this.active[indexB] = active;
    this.temp[indexB] = temp;
    this.mounted[indexB] = mounted;
    this.deleted[indexB] = deleted;
    this.parent[indexB] = parent;
    this.children[indexB] = children;

    // Also update uuidMap
    this.uuidMap.set(uuid, indexB);
    this.uuidMap.set(this.uuid[indexB], indexA);
  }

  /**
   * Remove slots from the arrays. Does not check if they are deleted first
   * @param slots number of slots to remove
   */
  private dealloc(slots: number) {
    this.uuid = this.uuid.slice(0, this.matrixLength - slots);
    this.ref = this.ref.slice(0, this.matrixLength - slots);
    this.active = this.active.slice(0, this.matrixLength - slots);
    this.temp = this.temp.slice(0, this.matrixLength - slots);
    this.mounted = this.mounted.slice(0, this.matrixLength - slots);
    this.deleted = this.deleted.slice(0, this.matrixLength - slots);
    this.parent = this.parent.slice(0, this.matrixLength - slots);
    this.children = this.children.slice(0, this.matrixLength - slots);
    this.components.forEach((compArr, idx) => {
      this.components[idx] = compArr.slice(0, this.matrixLength - slots);;
    }, this);

    this.matrixLength -= slots;
  }

  /**
   * Check all component types to see if an array can be trimmed
   */
  private trimComponentArray() {
    for (let i = 0; i < this.components.length; i++) {
      const comp = this.components[i];
      if (comp.every((value) => value === null)) {
        for (const key of this.typeIndex.keys()) {
          if (this.typeIndex.get(key) === i) {
            this.trimComponentType(key);
            break;
          }
        }
      }
    }
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

    // @TODO track deletions
    this.deletedEntities += 1;
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

  public registerComponentKey(key: ComponentKeyType) {
    if (this.typeIndex.has(key)) return;

    this.allocComponentType(key);
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
  }: GetAllEntitiesOptions = {}): Entity[] {
    const toRet = [];
    for (let i = 0; i < this.matrixLength; i++) {
      if (this.temp[i]) continue;
      if (deletedEquals !== undefined && deletedEquals !== this.deleted[i]) {
        continue;
      }
      if (mountedEquals !== undefined && mountedEquals !== this.mounted[i]) {
        continue;
      }
      if (activeEquals !== undefined && activeEquals !== this.active[i]) {
        continue;
      }
      toRet.push(this.ref[i]);
    }
    return toRet;
  }
  /**
   * Splits the Archetype into several smaller Archetypes
   */
  // public split(): Archetype[] {
  //   // First minimise the components that aren't being used anymore
  //   this.trimComponentArray();

  //   // Next, find out how many of each component are still being used
  //   const numberOfComponentsMap: Map<ComponentKeyType, number> = new Map();

  //   for (const type of this.typeIndex.keys()) {
  //     const index = this.typeIndex.get(type);
  //     if (!index) continue;
  //     const compArr = this.components[index];
  //     const score = compArr.map<number>(c => c ? 1 : 0).reduce((prev, curr) => prev + curr);
  //     if (score === this.matrixLength) continue;
  //     numberOfComponentsMap.set(type, score);
  //   }

  //   // Then use those numbers to determine ways that we can split up the Archetypes

  // }
}
