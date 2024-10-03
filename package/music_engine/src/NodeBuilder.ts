import { Container } from "./Container";
import { MusicEngineNode } from "./nodes";

export type NodeFactory<T extends MusicEngineNode> = {
  name: string,
  build: (params: any) => T
}

export class NodeBuilder {
  private readonly factoryMap = new Map();
  constructor(
    public readonly audioContext: AudioContext,
    builders: NodeFactory<any>[],
    public readonly container: Container
  ) {
    for (const b of builders) {
      this.factoryMap.set(b.name, b);
    }
  }

  public addNode(nodeParams: Omit<MusicEngineNode, "audioContext">) {
    const builder = this.factoryMap.get(nodeParams.type);

    if (builder) {
      const node = builder.build(nodeParams);
      this.container.registerNode(node);
    } else {
      console.warn(`No Node Builder was added for type ${nodeParams.type}. Using Generic Node`);
      
      // const node = new MusicEngineNode()
    }
  }
}
