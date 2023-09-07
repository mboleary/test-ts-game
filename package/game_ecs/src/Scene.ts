import { ECSDB } from "./db/ECSDB";
import { World } from "./World";
import { Entity } from "./Entity";
import { v4 as uuidv4 } from "uuid";
import { Component } from "./Component";

export class Scene extends Entity {

    public readonly world: World;

    constructor(
        id: string,
    ) {
        super(id, new ECSDB());
        this.world = new World(this._ecsdb);

        // Add self to ECSDB
        this._ecsdb.entityMap.set(id, this);
    }

    static build(items: (Entity | Component<any>)[] = []): Scene {
        // @TODO once we figure out the ecsdb stuff, change this
        const scene = new Scene(uuidv4());
        for (const i of items) {
          if (i instanceof Component) {
            scene.attachComponent(i);
          } else {
            scene.attachChild(i);
          }
        }
        return scene;
      }
}
