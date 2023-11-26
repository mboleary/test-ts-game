import { v4 as uuidv4 } from "uuid";
import { ECSDB } from "./db/ECSDB";
import { GameEvent, GameEventTreeEmitter, EmitOptions, Eventable, Observable, Observer, ObserverManager } from "game_event";
import { Component, ComponentType } from "./Component";
import { mergeECSDB } from "./util/ecsdbOverrideHelper";
import { buildProxy } from "./util/buildProxy";

export class Entity implements Eventable, Observable {
  protected readonly _eventEmitter: GameEventTreeEmitter =
    new GameEventTreeEmitter(() => this.parent?._eventEmitter);
  protected readonly _observerManager: ObserverManager = new ObserverManager();

  constructor(
    public readonly id: string,
    protected _ecsdb: ECSDB,
  ) {
    // Add self to ECSDB
    this._ecsdb.entityDB.entityMap.set(id, this);
  }

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

  /**
   * Use this to absorb an entity into another ECSDB if using a temporary one
   * @TODO figure out how to not duplicate this
   * @param ecsdb 
   */
  public overrideECSDB(ecsdb: ECSDB) {
    if (this._ecsdb.canBeOverridden()) {
      const override = this._ecsdb.canOnlyBeOverriddenBy()
      if (override && override !== ecsdb) {
        throw new Error("Entity ECSDB Cannot be overridden by this ECSDB as it is not the parent");
      }
      mergeECSDB(this._ecsdb, ecsdb);
      this._ecsdb = ecsdb;
    } else {
      throw new Error("Entity ECSDB is not overridable");
    }
  }

  get parent(): Entity | null {
    return this._ecsdb.entityDB.getParentOfEntity(this);
  }

  get children(): Entity[] {
    return this._ecsdb.entityDB.getChildrenOfEntity(this);
  }

  public attachChild(entity: Entity) {
    this._ecsdb.entityDB.setParentOfEntity(this, entity);
  }

  public detachChild(entity: Entity): boolean {
    if (this._ecsdb.entityDB.entityHasChild(this.id, entity.id)) {
      this._ecsdb.entityDB.detachParentFromEntity(entity.id);
      return true;
    }
    return false;
  }

  get components(): Component[] {
    return this._ecsdb.componentDB.getComponentsForEntity(this.id);
  }

  public attachComponent(comp: Component) {
    this._ecsdb.componentDB.attachComponentToEntity(comp, this.id);
  }

  public setComponent<T>(componentType: ComponentType, componentData: T) {
    this._ecsdb.componentDB.setComponentDataOnEntity(this.id, componentType, componentData);
  }

  public detachComponent(comp: Component): boolean {
    this._ecsdb.componentDB.destroyComponent(comp.id);
    return true;
  }

  public detachComponentByType(componentType: ComponentType): boolean {
    const comp = this._ecsdb.componentDB.getComponentForEntityByType(this.id, componentType);
    if (!comp) return false;
    this._ecsdb.componentDB.destroyComponent(comp.id);
    return true;
  }

  public getComponent<T>(type: ComponentType): T | null {
    const comp = this._ecsdb.componentDB.getComponentForEntityByType<T>(this.id, type);
    if (comp) {
      if (typeof comp.data === 'object') {
        return buildProxy<any>(comp.data, this._observerManager, type);
      } else {
        return comp.data;
      }
    } else {
      return null;
    }
  }

  public getComponentWithoutProxy<T>(type: ComponentType): T | null {
    const comp = this._ecsdb.componentDB.getComponentForEntityByType<T>(this.id, type);
    return comp?.data || null;
  }

  public getComponentObject<T>(type: ComponentType): Component<T> | null {
    const comp = this._ecsdb.componentDB.getComponentForEntityByType<T>(this.id, type);
    return comp || null;
  }

  public setParent(entity: Entity) {
    this._ecsdb.entityDB.setParentOfEntity(entity, this);
  }

  static build(items: (Entity | Component<any>)[] = []): Entity {
    // @TODO once we figure out the ecsdb stuff, change this
    const entity = new Entity(uuidv4(), new ECSDB(true));
    for (const i of items) {
      if (i instanceof Component) {
        entity.attachComponent(i);
      } else {
        entity.attachChild(i);
      }
    }
    return entity;
  }
}
