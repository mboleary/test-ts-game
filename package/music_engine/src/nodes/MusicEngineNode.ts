import { MusicEnginePort } from "../ports/Port";

export type SerializedMusicEngineNode = {
  name: string,
  id: string,
  type: string,
  labels: string[]
};

export abstract class MusicEngineNode {
  protected readonly ports: MusicEnginePort[] = [];

  constructor(
    protected readonly context: AudioContext,
    public name: string,
    public id: string,
    public readonly type: string,
    public readonly labels: string[],
  ) {}

  public getPorts(): MusicEnginePort[] {
    return this.ports;
  }

  public getPort(id: string): MusicEnginePort | null {
    return this.ports.find(port => port.id === id) || null;
  }

  public abstract toJSON(): SerializedMusicEngineNode;
}
