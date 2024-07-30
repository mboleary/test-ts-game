/**
 * Abstraction on AudioParams that allow connecting many nodes together
 */

import { PortDirection } from "../types/PortDirection.enum";
import { PortType } from "../types/PortType";

export abstract class MusicEnginePort {
  constructor(
    public name: string = '',
    public readonly direction: PortDirection,
    public readonly type: PortType
  ) {}

  private readonly connections: MusicEnginePort[] = [];

  protected hasConnection(port: MusicEnginePort): boolean {
    const idx = this.connections.indexOf(port);
    return idx !== -1;
  } 

  protected abstract handleConnect(port: MusicEnginePort): void;
  protected abstract handleDisconnect(port: MusicEnginePort): void;

  public getConnectedPorts(): MusicEnginePort[] {
    return this.connections;
  }

  public connect(port: MusicEnginePort): void {
    if (this.direction === port.direction) {
      throw new Error('destination port has incorrect direction');
    }

    if (this.type !== port.type) {
      throw new Error('Ports are not the same type');
    }

    if (this.hasConnection(port)) {
      // throw new Error('already connected');
      return;
    }

    this.connections.push(port);

    if (this.direction === PortDirection.IN) {
      return port.connect(this);
    } else {
      // This adds this port to the connections list of the other then when it attempts to add itself to this one again, it returns
      port.connect(this);
    }

    this.handleConnect(port);
    
  }

  public disconnect(port: MusicEnginePort) {
    if (this.direction === PortDirection.IN) {
      return port.connect(this);
    }

    if (!this.hasConnection(port)) {
      throw new Error('Not connected to port!');
    }

    this.handleDisconnect(port);

    const idx = this.connections.indexOf(port);
    this.connections.splice(idx, 1);
  }

  public disconnectAll() {
    for (const connection of this.connections) {
      this.handleDisconnect(connection);
    }
    this.connections.splice(0, this.connections.length);
  }
}
