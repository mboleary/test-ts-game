import { MusicEngineNode } from "./nodes";
import { getPortArray } from "./util/getPortArray";

export class Container {
  constructor() {}

  private nodeMap: Map<string, MusicEngineNode> = new Map();
  // private assetMap: Map<string, any> = new Map();

  public registerNode(node: MusicEngineNode) {
    if (this.nodeMap.has(node.id)) {
      throw new Error('ID already taken');
    }

    this.nodeMap.set(node.id, node);
  }

  public deleteNode(nodeId: string) {
    const node = this.nodeMap.get(nodeId);

    if (node) {
      const allPorts = getPortArray(node);
      allPorts.forEach(p => p.disconnectAll());
    } else {
      throw new Error(`Node ID ${nodeId} not present`);
    }
  }

  public toJSON() {
    const nodeJSONArr: Omit<MusicEngineNode, "audioContext">[] = [];
    const connectionsJSONArr = [];

    for (const node of this.nodeMap.values()) {
      nodeJSONArr.push({
        name: node.name,
        id: node.id,
        type: node.type,
        labels: node.labels
      });

      const ports = getPortArray(node);

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
  }

  // public registerAsset(assetId: string, assetSrc: string) {}
}
