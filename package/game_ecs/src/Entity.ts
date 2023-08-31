import { v4 as uuidv4 } from "uuid";
import { ECSDB } from "./db/ECSDB";
import { GameEvent, GameEventTreeEmitter, EmitOptions, Eventable } from "game_event";
import { Component } from "./Component";

export class Entity implements Eventable {
  protected readonly _eventEmitter: GameEventTreeEmitter =
    new GameEventTreeEmitter(() => this.parent?._eventEmitter);

  constructor(
    public readonly id: string,
    protected _ecsdb: ECSDB,
  ) {}

  emit<T>(type: string, event: GameEvent<T>, options: EmitOptions = {}): void {
    this._eventEmitter.emit(type, event, options);
  }
  subscribe(type: string, handler: Function): void {
    this._eventEmitter.subscribe(type, handler);
  }
  unsubscribe(handler: Function): void {
    this._eventEmitter.unsubscribe(handler);
  }
  unsubscribeAll(type: string): void {
    this._eventEmitter.unsubscribeAll(type);
  }
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
      this._ecsdb = ecsdb;
    } else {
      throw new Error("Entity ECSDB is not overridable");
    }
  }

  get parent(): Entity | null {
    return this._ecsdb.getParentOfEntity(this);
  }

  get children(): Entity[] {
    return this._ecsdb.getChildrenOfEntity(this);
  }

  public attachChild(entity: Entity) {
    console.log("not implemented");
  }

  public detachChild(entity: Entity): boolean {
    return false;
  }

  get components(): Component[] {
    return [];
  }

  public attachComponent(comp: Component) {
    console.log("not implemented");
  }

  public detachComponent(comp: Component): boolean {
    return false;
  }

  public getComponent(type: Symbol | null): Component | null {
    return null;
  }

  public setParent(entity: Entity) {
    // console.log("not implemented");
    this._ecsdb.setParentOfEntity(entity, this);
  }

  static build(components: Component[]): Entity {
    // @TODO once we figure out the ecsdb stuff, change this
    const entity = new Entity(uuidv4(), new ECSDB(true));
    for (const c of components) {
      entity.attachComponent(c);
    }
    return entity;
  }
}
