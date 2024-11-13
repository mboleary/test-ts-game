import { Entity } from "../Entity";
import { ComponentKeyType } from "../type/ComponentKey.type";
import { EntityRelationshipManager } from "./EntityRelationshipManager";

export type ComponentAndKey = {
  key: ComponentKeyType,
  value: any
};

export class ECSWorldInternals {
  public readonly relationshipManager = new EntityRelationshipManager();

  // Stores entities by their uuid
  public readonly entityReferenceMap = new Map<string, Entity>();

  // Stores relationship between entities and components based on entity id
  public readonly entityMap = new Map<string, ComponentKeyType[]>();

  // Stores components by their key and then entity uuid
  public readonly componentMap = new Map<ComponentKeyType, Map<string, any>>();

  public entityCreate(id: string, components: ComponentAndKey[]): Entity {
    if (this.entityMap.has(id)) {
      throw new Error(`Entity id ${id} already exists`);
    }

    const keys: ComponentKeyType[] = [];

    for (const component of components) {
      keys.push(component.key);
      this.registerComponent(component.key, component.value, id);
    }

    this.entityMap.set(id, keys);
    const ref = new Entity(this, id);
    this.entityReferenceMap.set(id, ref);
    
    return ref;
  }

  public entityGet(id: string): Entity | undefined {
    return this.entityReferenceMap.get(id);
  }

  public entitySetComponent(id: string, key: ComponentKeyType, component: any) {
    const entityComponentArray = this.entityMap.get(id);

    if (!entityComponentArray) {
      throw new Error(`Entity ${id} doesn't exist`);
    }

    let idx = entityComponentArray.indexOf(key);
    if (idx === -1) {
      entityComponentArray.push(key);
    }

    this.registerComponent(key, component, id);
  }

  public entityGetComponentKeys(id: string): ComponentKeyType[] {
    const entityComponentArray = this.entityMap.get(id);

    if (!entityComponentArray) {
      throw new Error(`Entity ${id} doesn't exist`);
    }

    return entityComponentArray;
  }

  public entityGetComponent(id: string, key: ComponentKeyType): any | null {
    const componentTypeMap = this.componentMap.get(key);

    if (!componentTypeMap) {
      return null;
    }

    return componentTypeMap.get(id) || null;
  }

  public entityUnsetComponent(id: string, key: ComponentKeyType) {
    const entityComponentArray = this.entityMap.get(id);

    if (!entityComponentArray) {
      throw new Error(`Entity ${id} doesn't exist`);
    }

    let idx = entityComponentArray.indexOf(key);
    if (idx !== -1) {
      entityComponentArray.splice(idx, 1);
    }

    const componentTypeMap = this.componentMap.get(key);

    if (!componentTypeMap) {
      // @TODO should an error be thrown here?
      return;
    }

    componentTypeMap.delete(id);
  }

  public entityDelete(id: string) {
    if (!this.entityMap.has(id)) {
      throw new Error(`Entity id ${id} doesn't exist`);
    }

    const keys = this.entityMap.get(id) as ComponentKeyType[];

    // Delete the components associated with this entity
    for (const key of keys) {
      const componentTypeMap = this.componentMap.get(key);
      if (componentTypeMap) {
        componentTypeMap.delete(id);
      }
    }

    this.entityReferenceMap.delete(id);
    this.entityMap.delete(id);

    // Keep relationships in sync
    this.relationshipManager.entityDelete(id);
  }

  private registerComponent(key: ComponentKeyType, component: any, entityId: string) {
    let map: Map<string, any>;
    if (this.componentMap.has(key)) {
      map = this.componentMap.get(key) as any;
    } else {
      map = new Map();
      this.componentMap.set(key, map);
    }

    map.set(entityId, component);
  }

  


}
