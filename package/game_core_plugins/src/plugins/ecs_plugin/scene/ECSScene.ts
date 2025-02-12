import { World } from "game_ecs";
import { Scene } from "./Scene";

export class ECSScene extends Scene {
  constructor(
    public readonly world: World,
  ) {
    super();
  }

  
}
