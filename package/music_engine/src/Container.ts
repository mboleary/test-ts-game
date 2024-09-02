import { MusicEngineNode } from "./nodes";

export class Container {
  constructor() {}

  private nodeMap: Map<string, MusicEngineNode> = new Map();
  private assetMap: Map<string, any> = new Map();
}
