import { v4 as uuidv4 } from "uuid";
import { Entity } from "./Entity";
import { ECSDB } from "./db";
import { mergeECSDB } from "./util/ecsdbOverrideHelper";

export type ComponentData = {
  [key: string]: any;
};

export type ComponentType = Symbol | Function | string | null;

export class Component<T = ComponentData> {
  /**
   * Creates a Component that will be attached to an entity
   * @param id
   * @param type
   * @param data
   */
  constructor(
    public readonly id: string,
    public readonly type: ComponentType,
    public data: T,
    protected _ecsdb: ECSDB,
  ) {
    // Add self to ecsdb
    // this._ecsdb.componentDB.addComponent(this);
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

  /**
   * used to determine if the ECSDB needs to be overridden
   * @param ecsdb ecsdb to check
   * @returns true if they are the same
   */
  public sameECSDB(ecsdb: ECSDB): boolean {
    return this._ecsdb === ecsdb;
  }

  get entity(): Entity | null {
    return this._ecsdb.componentDB.getEntityForComponent(this.id);
  }

  // Convenience functions
  public setEntity(entity: Entity) {
    return this._ecsdb.componentDB.attachComponentToEntity<T>(this, entity.id);
  }

  static build<T>(type: Symbol | null, data: T): Component<T> {
    return new Component<T>(uuidv4(), type, data, new ECSDB(true));
  }
}
