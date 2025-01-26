import { MusicEngineNode, SerializedMusicEngineNode } from "./nodes";

export type NodeFactory<T extends MusicEngineNode, S extends SerializedMusicEngineNode> = {
  name: string,
  build: (params: S, audioContext: AudioContext) => T
}

export class NodeBuilder {
  private readonly factoryMap = new Map();
  constructor(
    builders: NodeFactory<any, any>[]
  ) {
    for (const b of builders) {
      this.factoryMap.set(b.name, b);
    }
  }

  public buildNode(nodeParams: SerializedMusicEngineNode, audioContext: AudioContext) {
    const builder = this.factoryMap.get(nodeParams.type);

    if (!builder) {
      throw new Error(`No Node Builder was added for type ${nodeParams.type}`);
    }

    return builder.build(nodeParams, audioContext);
  }
}
