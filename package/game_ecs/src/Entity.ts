import { ECSDB } from "./ECSDB";
import { GameEvent, GameEventTreeEmitter, EmitOptions, Eventable } from "game_event";
import { Component } from "./Component";

export class Entity implements Eventable {
  public readonly tags: string[] = [];

  protected readonly _eventEmitter: GameEventTreeEmitter =
    new GameEventTreeEmitter(() => this.parent?._eventEmitter);

  // public parent: Entity | null = null;

  // public readonly children: Entity[] = [];

  constructor(
    public readonly id: string,
    public name: string,
    protected readonly _ecsdb: ECSDB,
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

  get parent(): Entity | null {
    return this._ecsdb.getParentOfEntity(this);
  }

  get children(): Entity[] {
    return this._ecsdb.getChildrenOfEntity(this);
  }

  // The following functions are only for convenience
  public attachComponent(comp: Component) {
    console.log("not implemented");
  }

  public attachChild(entity: Entity) {
    console.log("not implemented");
  }

  public detachComponent(comp: Component): boolean {
    return false;
  }

  public detachChild(entity: Entity): boolean {
    return false;
  }

  public setParent(entity: Entity) {
    // console.log("not implemented");
    this._ecsdb.setParentOfEntity(entity, this);
  }
}
