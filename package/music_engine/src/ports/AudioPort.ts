import { MusicEngineNode } from "../nodes";
import { PortDirection } from "../types/PortDirection.enum";
import { PortType } from "../types/PortType";
import { MusicEnginePort } from "./Port";

export class AudioPort extends MusicEnginePort {
  constructor(
    id: string,
    node: MusicEngineNode | null,
    name: string,
    direction: PortDirection,
  ) {
    super(id, node, name, direction, PortType.AUDIO);
  }

  private registeredAudioNodes: AudioNode[] = [];

  public registerAudioNode(node: AudioNode) {
    const idx = this.registeredAudioNodes.indexOf(node);
    if (idx === -1) {
      this.registeredAudioNodes.push(node);
    }
    this.connectNodeToDestination(node);
  }

  public unregisterAudioNode(node: AudioNode) {
    const idx = this.registeredAudioNodes.indexOf(node);
    if (idx === -1) {
      this.registeredAudioNodes.splice(idx, 1);
    }
    this.disconnectNodeFromDestination(node);
  }

  private connectNodeToDestination(node: AudioNode) {
    const connectedPorts = this.getConnectedPorts() as AudioPort[];
    if (connectedPorts.length) {
      for (const p of connectedPorts) {
        const remoteNodes = p.getRegisteredAudioNodes();
        for (const r of remoteNodes) {
          node.connect(r);
        }
      }
    }
  }

  private disconnectNodeFromDestination(node: AudioNode) {
    const connectedPorts = this.getConnectedPorts() as AudioPort[];
    if (connectedPorts.length) {
      for (const p of connectedPorts) {
        const remoteNodes = p.getRegisteredAudioNodes();
        for (const r of remoteNodes) {
          node.disconnect(r);
        }
      }
    }
  }

  public getRegisteredAudioNodes(): AudioNode[] {
    return this.registeredAudioNodes;
  }

  protected handleConnect(port: AudioPort): void {
    // We can assume that all local nodes are not connected to remote notes
    const localNodes = this.getRegisteredAudioNodes();
    for (const l of localNodes) {
      const remoteNodes = port.getRegisteredAudioNodes();
      for (const r of remoteNodes) {
        l.connect(r);
      }
    }
  }

  protected handleDisconnect(port: AudioPort): void {
    // We can assume that all local nodes are connected to remote nodes
    const localNodes = this.getRegisteredAudioNodes();
    for (const l of localNodes) {
      const remoteNodes = port.getRegisteredAudioNodes();
      for (const r of remoteNodes) {
        l.disconnect(r);
      }
    }
  }
}
