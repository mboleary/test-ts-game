import { EmitOptions, Eventable, GameEvent, GameEventEmitter, GameEventLinearEmitter } from "game_event";
import { Entity } from "../Entity";
import { ComponentKeyType } from "../type/types";
import { EntityRelationshipManager } from "../relationships/EntityRelationshipManager";
import { EntityCreateEvent } from "./events/EntityCreate.event";
import { EntityComponentSetEvent } from "./events/EntityComponentSet.event";
import { EntityComponentUnsetEvent } from "./events/EntityComponentUnset.event";
import { EntityDeleteEvent } from "./events/EntityDelete.event";

export type ComponentAndKey = {
  key: ComponentKeyType,
  value: any
};

export class ECSWorldInternals implements Eventable {
  protected readonly _eventEmitter = new GameEventLinearEmitter();

  public readonly relationshipManager = new EntityRelationshipManager(this);

  // Stores entities by their uuid
  public readonly entityReferenceMap = new Map<string, Entity>();

  // Stores relationship between entities and components based on entity id
  public readonly entityMap = new Map<string, ComponentKeyType[]>();

  // Stores components by their key and then entity uuid
  public readonly componentMap = new Map<ComponentKeyType, Map<string, any>>();

  /* Entity and Component Methods */

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

    const evt = new EntityCreateEvent(id, components);
    this.emit(evt.type, evt);
    
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

    const evt = new EntityComponentSetEvent(id, key, component, entityComponentArray);
    this.emit(evt.type, evt);
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

  public entityHasComponent(id: string, key: ComponentKeyType): boolean {
    const entityComponentArray = this.entityMap.get(id);

    if (!entityComponentArray) {
      throw new Error(`Entity ${id} doesn't exist`);
    }

    return entityComponentArray.indexOf(key) >= 0;
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

    const evt = new EntityComponentUnsetEvent(id, key, entityComponentArray);
    this.emit(evt.type, evt);
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
    // this.relationshipManager.entityDelete(id);

    const evt = new EntityDeleteEvent(id);
    this.emit(evt.type, evt);
  }

  /**
   * Sets a component on an Entity
   * @param key Component Key
   * @param component Component Data
   * @param entityId Entity ID to set data on
   */
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

  /**
   * Hooks are used to sync data between the ECS internals and other managers so that it's easier to extend the ECS functionality.
   * For example, the relationships manager needs to know when an entity is deleted, so that can be added as a hook.
   * 
   * Hooks use events to notify these extensions about these events
   */

  /**
   * Emit an event on this Entity
   * @param type event type
   * @param event event
   * @param options Emitter Options
   */
  public emit<T>(type: string, event: GameEvent<T>, options: EmitOptions = {}): void {
    this._eventEmitter.emit(type, event, options);
  }

  /**
   * Subscribe to events
   * @param type event type
   * @param handler event handler
   */
  public subscribe(type: string, handler: Function): void {
    this._eventEmitter.subscribe(type, handler);
  }

  /**
   * Unsubscribe a handler from receiving events
   * @param handler event handler
   */
  public unsubscribe(handler: Function): void {
    this._eventEmitter.unsubscribe(handler);
  }

  /**
   * Unsubscribe all handlers from an event type
   * @param type 
   */
  public unsubscribeAll(type: string): void {
    this._eventEmitter.unsubscribeAll(type);
  }

  /**
   * Subscribe to an event to handle one instance of it
   * @param type event type
   * @param handler event handler
   */
  public once(type: string, handler: Function): void {
    this._eventEmitter.once(type, handler);
  }

  /* Misc Functions */

  /**
   * Merges the Entities and Components from another internals object and re-creates references to the Entities in the targetInternals object.
   * @param targetInternals Internals of world to merge
   */
  public merge(targetInternals: ECSWorldInternals) {
    // Entities, also re-create references
    for (const entityUuid of targetInternals.entityMap.keys()) {
      // Given that these are uuids, don't recreate the entities in this internals object that have the same uuid
      if (!this.entityMap.has(entityUuid)) {
        this.entityCreate(entityUuid, []);
      }
    }

    // Components
    for (const [componentKey, targetComponentEntityMap] of targetInternals.componentMap.entries()) {
      let componentEntityMap = this.componentMap.get(componentKey);
      if (!componentEntityMap) {
        componentEntityMap = new Map();
        this.componentMap.set(componentKey, componentEntityMap);
      }
      for (const [entityUuid, value] of targetComponentEntityMap.values()) {
        componentEntityMap.set(entityUuid, value);
      }
    }

    // Relationships
    this.relationshipManager.merge(targetInternals.relationshipManager);
  }

  public clear() {
    // @TODO
  }

}
