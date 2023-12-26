import { v4 as uuidv4 } from "uuid";
import { ECSDB } from "./db/ECSDB";
import { GameEvent, GameEventTreeEmitter, EmitOptions, Eventable, Observable, Observer, ObserverManager } from "game_event";
import { Component } from "./Component";
import { mergeECSDB } from "./util/ecsdbOverrideHelper";
import { buildProxy } from "./util/buildProxy";
import { ComponentKeyType } from "./type/ComponentKey.type";

export class Entity implements Eventable, Observable {
  protected readonly _eventEmitter: GameEventTreeEmitter =
    new GameEventTreeEmitter(() => this.parent?._eventEmitter);
  protected readonly _observerManager: ObserverManager = new ObserverManager();

  constructor(
    protected ecsdb: ECSDB,
    public readonly id: string,
    private readonly _children: Entity[]
  ) {
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
  // public overrideECSDB(ecsdb: ECSDB) {
  //   if (this._ecsdb.canBeOverridden()) {
  //     const override = this._ecsdb.canOnlyBeOverriddenBy()
  //     if (override && override !== ecsdb) {
  //       throw new Error("Entity ECSDB Cannot be overridden by this ECSDB as it is not the parent");
  //     }
  //     mergeECSDB(this._ecsdb, ecsdb);
  //     this._ecsdb = ecsdb;
  //   } else {
  //     throw new Error("Entity ECSDB is not overridable");
  //   }
  // }

  get parent(): Entity | null {
    // return this._ecsdb.entityDB.getParentOfEntity(this);
    return this.ecsdb.getParentOfEntity(this.id);
  }

  get children(): Entity[] {
    return this._children.slice();
  }

  public attachChild(entity: Entity) {
    this.ecsdb.attachChild(this.id, entity.id);
  }

  public detachChild(entity: Entity): boolean {
    return this.ecsdb.detachChild(this.id, entity.id);
  }

  get components(): ComponentKeyType[] {
    return this.ecsdb.getComponentsOfEntity(this.id);
  }

  public attachComponent(comp: Component) {
    this.ecsdb.attachComponent(this.id, comp.key, comp.data);
  }

  public setComponent<T>(key: ComponentKeyType, componentData: T) {
    this.ecsdb.setComponent(this.id, key, componentData);
  }

  public detachComponent(comp: ComponentKeyType): boolean {
    return this.ecsdb.detachComponent(this.id, comp);
  }

  public getComponent<T>(type: ComponentKeyType): T | null {
    const comp = this.ecsdb.getComponentFromEntity<T>(this.id, type);
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

  public getComponentWithoutProxy<T>(type: ComponentKeyType): T | null {
    return this.ecsdb.getComponentFromEntity<T>(this.id, type);
  }

  public setParent(entity: Entity) {
    this.ecsdb.attachChild(entity.id, this.id);
  }
}
