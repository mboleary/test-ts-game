import { World, Scene } from "game_ecs";
import { injectable } from "inversify";

@injectable()
export class GameWorldManager {
    private _world: World | null = null;

    constructor() {}

    public setCurrentScene(scene: Scene) {
        // @TODO destroy old world

        this._world = scene.world;
    }

    public get world(): World {
        if (!this._world) {
            throw new Error("Scene has not been set");
        }
        return this._world;
    }
}