import { ComponentKeyType } from "./type/ComponentKey.type";

export type ComponentData = {
  [key: string]: any;
};

// export type ComponentType = Symbol | Function | string | null;

export class Component<T = ComponentData> {
  /**
   * Creates a Component that will be attached to an entity
   * @param type
   * @param data
   */
  constructor(
    public readonly key: ComponentKeyType,
    public data: T,
  ) {}
}
