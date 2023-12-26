import { ECSDB } from "./db/ECSDB";
import { World } from "./World";
import { Entity } from "./Entity";
import { v4 as uuidv4 } from "uuid";
import { Component } from "./Component";

export class Scene extends Entity {

  public readonly world: World;

  constructor(
    id: string
  ) {
    super(new ECSDB(), id, []);
    this.world = new World(this.ecsdb);
  }
}
