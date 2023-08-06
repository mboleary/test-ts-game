import { ECSDB } from "../lib/ecs/ECSDB";
import { Component } from "./Component";

export class Entity {
  public readonly tags: string[] = [];

  // public parent: Entity | null = null;

  // public readonly children: Entity[] = [];

  constructor(
    public readonly id: string,
    public name: string,
    private readonly _ecsdb: ECSDB,
  ) {}

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
