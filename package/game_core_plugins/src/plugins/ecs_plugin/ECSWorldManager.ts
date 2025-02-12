import { World } from "game_ecs";

export class ECSWorldManager {
  private currentWorld: World | null = null;
  constructor() {}
  get world(): World | null {
    return this.currentWorld;
  }
  set world(newWorld: World) {
    this.currentWorld = newWorld;
  }
}
