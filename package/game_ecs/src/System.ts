import { v4 as uuidv4 } from "uuid";
import { Entity } from "./Entity";
import { World } from "./World";

export type UpdateActionCallback = (entities: Entity[], world: World) => void;
export type SystemOptions = {
  id?: string,
  priority?: number
};

export enum SystemLifecycle {
  INIT = "INIT",
  START = "START",
  LOOP = "LOOP",
  DESTROY = "DESTROY",
};

export class System {
  constructor(
    public readonly id: string,
    public readonly lifecycle: SystemLifecycle,
    public readonly componentTypes: Symbol[],
    public readonly priority: number = 0
  ) { }

  update(entities: Entity[], world: World): void { }

  static build(lifecycle: SystemLifecycle, componentTypes: Symbol[], updateFunc: UpdateActionCallback, options: SystemOptions = {}): System {
    const system = new System(options.id || uuidv4(), lifecycle, componentTypes, options.priority);
    system.update = updateFunc;
    return system;
  }
}
