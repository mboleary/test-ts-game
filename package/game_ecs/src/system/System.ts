import { v4 as uuidv4 } from "uuid";
import { Entity } from "../Entity";
import { World } from "../World";
import { QueryObject } from "../query/type/Query.type";

export type UpdateActionCallback = (entities: Entity[], world: World) => void;
export type SystemOptions = {
  id?: string,
  priority?: number
};



export class System {
  constructor(
    public readonly id: string,
    public readonly lifecycle: string,
    public readonly queryObject: QueryObject,
    public readonly update: UpdateActionCallback,
    public readonly priority: number = 0
  ) { }

  // protected update(entities: Entity[], world: World): void { }

  static build(lifecycle: string, queryObject: QueryObject, update: UpdateActionCallback, options: SystemOptions = {}): System {
    const system = new System(options.id || uuidv4(), lifecycle, queryObject, update, options.priority);
    return system;
  }
}
