import { ECSDB } from "./ECSDB";
import { World } from "./World";
import { Entity } from "./Entity";

export class Scene extends Entity {

    public readonly world: World;

    constructor(
        id: string,
        public name: string
    ) {
        super(id, name, new ECSDB());
        this.world = new World(this._ecsdb);

        // Add self to ECSDB
        this._ecsdb.entityMap.set(id, this);
    }
}
