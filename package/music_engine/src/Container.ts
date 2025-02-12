import { NodeBuilder } from "./NodeBuilder";
import { MusicEngineNode, SerializedMusicEngineNode } from "./nodes";
// import { getPortArray } from "./util/getPortArray";

export type SerializedNodeConnection = {
  fromId: string,
  fromPort: string,
  toId: string,
  toPort: string,
};

export type SerializedContainer = {
  nodes: SerializedMusicEngineNode[],
  edges: SerializedNodeConnection[],
};

export class Container {
  public readonly audioContext: AudioContext;

  constructor(
    public readonly nodeBuilder: NodeBuilder,
    audioContext?: AudioContext,
  ) {
    if (audioContext) {
      this.audioContext = audioContext;
    } else {
      this.audioContext = new AudioContext();
    }
  }

  private nodeMap: Map<string, MusicEngineNode> = new Map();
  // private assetMap: Map<string, any> = new Map();

  public registerNode(node: MusicEngineNode) {
    if (this.nodeMap.has(node.id)) {
      throw new Error('ID already taken');
    }

    this.nodeMap.set(node.id, node);
  }

  public buildAndRegisterNode(json: SerializedMusicEngineNode) {
    if (this.nodeMap.has(json.id)) {
      throw new Error('ID already taken');
    }

    const node = this.nodeBuilder.buildNode(json, this.audioContext);
    this.nodeMap.set(node.id, node);
    return node;
  }

  public getNode(id: string): MusicEngineNode | null {
    return this.nodeMap.get(id) || null;
  }

  public deleteNode(nodeId: string) {
    const node = this.nodeMap.get(nodeId);

    if (node) {
      // const allPorts = getPortArray(node);
      const allPorts = node.getPorts();
      allPorts.forEach(p => p.disconnectAll());
    } else {
      throw new Error(`Node ID ${nodeId} not present`);
    }
  }

  public toJSON() {
    const nodeJSONArr: SerializedMusicEngineNode[] = [];
    const connectionsJSONArr = [];

    for (const node of this.nodeMap.values()) {
      // nodeJSONArr.push({
      //   name: node.name,
      //   id: node.id,
      //   type: node.type,
      //   labels: node.labels
      // });

      nodeJSONArr.push(node.toJSON());

      // const ports = getPortArray(node);
      const ports = node.getPorts();

      for (const sourcePort of ports) {
        const destPorts = sourcePort.getConnectedPorts();
        if (destPorts) {
          for (const destPort of destPorts) {
            connectionsJSONArr.push({
              fromId: sourcePort.node?.id,
              fromPort: sourcePort.id,
              toId: destPort.node?.id,
              toPort: destPort.id
            });
          }
        }
      }
    }

    return ({
      nodes: nodeJSONArr,
      edges: connectionsJSONArr
    });
  }

  public static fromJSON(json: SerializedContainer, nodeBuilder: NodeBuilder, audioContext?: AudioContext): Container {
    const container = new Container(nodeBuilder, audioContext);

    for (const node of json.nodes) {
      container.buildAndRegisterNode(node);
    }

    for (const edge of json.edges) {
      const fromNode = container.getNode(edge.fromId);
      const toNode = container.getNode(edge.fromId);

      if (!(fromNode && toNode)) {
        console.warn(`Missing node in edges: ${JSON.stringify(edge)}`);
        continue;
      }

      const fromPort = fromNode.getPort(edge.fromPort);
      const toPort = fromNode.getPort(edge.toPort);

      if (!(fromPort && toPort)) {
        console.warn(`Missing port in edges: ${JSON.stringify(edge)}`);
        continue;
      }

      fromPort.connect(toPort);
    }

    return container;
  }

  // public registerAsset(assetId: string, assetSrc: string) {}
}
