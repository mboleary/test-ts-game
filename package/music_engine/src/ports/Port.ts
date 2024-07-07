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

  protected getConnectedPorts(): MusicEnginePort[] {
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
      throw new Error('already connected');
    }

    if (this.direction === PortDirection.IN) {
      return port.connect(this);
    }

    this.handleConnect(port);
    this.connections.push(port);
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
}
