import { ECSDB } from "../lib/ecs/ECSDB";
import { World } from "../lib/ecs/World";
import { Entity } from "./Entity";

export class Scene extends Entity {

    public readonly world: World;

    constructor(
        id: string,
        public name: string
    ) {
        super(id, name, new ECSDB());
        this.world = new World(this._ecsdb);
    }
}
