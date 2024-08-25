import { MusicEnginePort } from "../ports/Port";

export abstract class MusicEngineNode {
  constructor(
    protected readonly context: AudioContext,
    public name: string,
    public readonly type: string,
    public readonly labels: string[],
  ) {}
}
