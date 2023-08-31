import { v4 as uuidv4 } from "uuid";
import { Entity } from "./Entity";
import { ECSDB } from "./db";

export type ComponentData = {
  [key: string]: any;
};

export class Component<T = ComponentData> {
  /**
   * Creates a Component that will be attached to an entity
   * @param id
   * @param type
   * @param data
   */
  constructor(
    public readonly id: string,
    public readonly type: Symbol | null,
    public readonly data: T,
    protected _ecsdb: ECSDB,
  ) {}

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

  get entity(): Entity | null {
    return null;
  }

  // Convenience functions
  public setEntity(entity: Entity) {
    throw new Error("not implemented");
  }

  static build<T>(type: Symbol | null, data: T): Component<T> {
    return new Component<T>(uuidv4(), type, data, new ECSDB(true));
  }
}
