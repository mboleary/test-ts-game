export type SerializedComponent = {
  type: string,
  data: any
};

export type ComponentFactory<T, S extends SerializedComponent> = {
  name: string,
  build: (params: S) => T,
  serialize: (component: T) => S
}

export class ComponentBuilder {
  private readonly factoryMap = new Map();
  constructor(
    builders: ComponentFactory<any, any>[]
  ) {
    for (const b of builders) {
      this.factoryMap.set(b.name, b);
    }
  }

  public buildComponent(nodeParams: SerializedComponent) {
    const builder = this.factoryMap.get(nodeParams.type);

    if (!builder) {
      throw new Error(`No Node Builder was added for type ${nodeParams.type}`);
    }

    return builder.build(nodeParams);
  }

  public serializeComponent(type: string, component: any): SerializedComponent {
    const builder = this.factoryMap.get(type);

    if (!builder) {
      throw new Error(`No Node Builder was added for type ${type}`);
    }

    return {
      type,
      data: builder.serialize(component)
    };
  }
}
