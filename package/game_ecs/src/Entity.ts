import { v4 as uuidv4 } from "uuid";
import { GameEvent, GameEventTreeEmitter, EmitOptions, Eventable, Observable, Observer, ObserverManager } from "game_event";
import { buildProxy } from "./util/buildProxy";
import { ComponentKeyType } from "./type/types";
import { ECSWorldInternals } from "./db/ECSWorldInternals";
import { BuiltInRelationships } from "./relationships/builtInRelationships.const";
import { EntityRelationship } from "./relationships/EntityRelationship";

export type HydratedEntityRelationship = Omit<EntityRelationship, "entityAId" | "entityBId"> & {entity: Entity};

export class Entity implements Eventable, Observable {
  constructor(
    protected readonly internals: ECSWorldInternals,
    public readonly id: string,
    // public readonly uuid: string,
  ) {
  }

  /* Event and Observer Implementations */

  protected readonly _eventEmitter: GameEventTreeEmitter =
    new GameEventTreeEmitter(() => {
      const rel = this.internals.relationshipManager.relationGet(this.id, undefined, BuiltInRelationships.PARENT)[0];
      if (!rel) return;
      const e = this.internals.entityGet(rel.entityBId);
      if (!e) return;
      return e._eventEmitter;
    });
  protected readonly _observerManager: ObserverManager = new ObserverManager();

  /**
   * Observe a property
   * @param type property to observe
   * @returns 
   */
  observe<T>(type: any): Observer<T> {
    return this._observerManager.subscribe(type);
  }

  /**
   * Emit an event on this Entity
   * @param type event type
   * @param event event
   * @param options Emitter Options
   */
  emit<T>(type: string, event: GameEvent<T>, options: EmitOptions = {}): void {
    this._eventEmitter.emit(type, event, options);
  }

  /**
   * Subscribe to events
   * @param type event type
   * @param handler event handler
   */
  subscribe(type: string, handler: Function): void {
    this._eventEmitter.subscribe(type, handler);
  }

  /**
   * Unsubscribe a handler from receiving events
   * @param handler event handler
   */
  unsubscribe(handler: Function): void {
    this._eventEmitter.unsubscribe(handler);
  }

  /**
   * Unsubscribe all handlers from an event type
   * @param type 
   */
  unsubscribeAll(type: string): void {
    this._eventEmitter.unsubscribeAll(type);
  }

  /**
   * Subscribe to an event to handle one instance of it
   * @param type event type
   * @param handler event handler
   */
  once(type: string, handler: Function): void {
    this._eventEmitter.once(type, handler);
  }

  /* Component Handling */

  /**
   * Gets all component keys
   */
  get components(): ComponentKeyType[] {
    return this.internals.entityGetComponentKeys(this.id);
  }

  /**
   * Sets a component to a value
   * @param key Component Key
   * @param componentData Value
   */
  public setComponent<T>(key: ComponentKeyType, componentData: T) {
    this.internals.entitySetComponent(this.id, key, componentData);
    this._observerManager.notify(key, componentData);
  }

  /**
   * Removes a component
   * @param key Component Key to remove
   */
  public unsetComponent(key: ComponentKeyType) {
    this.internals.entityUnsetComponent(this.id, key);
    this._observerManager.notify(key, undefined);
  }

  /**
   * Gets a component and for objects, creates a proxy to automatically notify observers of changes
   * @param type Component Key
   * @returns Value or null
   */
  public getComponent<T>(type: ComponentKeyType): T | null {
    const comp = this.internals.entityGetComponent(this.id, type);
    if (comp) {
      if (typeof comp === 'object') {
        return buildProxy<any>(comp, this._observerManager, type);
      } else {
        return comp;
      }
    } else {
      return null;
    }
  }

  /**
   * Gets a component without adding a proxy to update observers
   * @param type Component Key
   * @returns Value or null
   */
  public getComponentWithoutProxy<T>(type: ComponentKeyType): T | null {
    return this.internals.entityGetComponent(this.id, type);
  }

  /* Relationship Handling */

  /**
   * Gets all relationships, including the Entity
   */
  public get relationships(): HydratedEntityRelationship[] {
    return this.internals.relationshipManager.relationGet(this.id).map(rel => ({
      id: rel.id,
      type: rel.type,
      entity: this.internals.entityGet(rel.entityBId) as Entity
    }), this).filter(rel => rel.entity !== undefined);
  }

  /**
   * Adds a relation to this entity
   * @param entity Entity to be related to
   * @param type relationship type
   */
  public addRelation(entity: Entity, type: string) {
    if (this.internals.relationshipManager.relationHas(this.id, type, entity.id)) return;

    this.internals.relationshipManager.relationCreate(this.id, entity.id, type);
  }

  /**
   * Gets all entities that have a relation to this entity
   * @param type relationship type
   * @returns Entity array of related entities
   */
  public getRelation(type: string): Entity[] {
    return this.internals.relationshipManager
      .relationGet(this.id, undefined, type)
      .map(rel => this.internals.entityGet(rel.entityBId))
      .filter(e => !!e) as Entity[];
  }

  /**
   * Test if an entity has a relationship with this entity
   * @param entity Entity to test
   * @param type relationship type
   * @returns true if there is a relationship of the correct type
   */
  public hasRelation(entity: Entity, type: string): boolean {
    return this.internals.relationshipManager.relationHas(this.id, type, entity.id);
  }

  /**
   * Removes a relationship between this entity and another
   * @param entity Entity to remove relationship from
   * @param type relationship type
   */
  public removeRelation(entity: Entity, type: string) {
    if (!this.internals.relationshipManager.relationHas(this.id, type, entity.id)) return;

    this.internals.relationshipManager.relationDelete(this.id, entity.id, type);
  }

  /* Misc Functionality */

  /**
   * Clone this entity 
   * @returns new Entity with cloned components
   */
  public clone(): Entity {
    // @TODO separate the references using serialization, when it's implemented
    const componentsWithKey = this.components.map(key => ({ key, value: this.internals.entityGetComponent(this.id, key) }));
    const newEntity = this.internals.entityCreate(uuidv4(), componentsWithKey);

    return newEntity;
  }
}
