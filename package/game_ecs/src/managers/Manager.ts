import { ECSDB } from "../db";
import { World } from "../World";

export abstract class Manager {
  constructor(
    protected readonly ecsdb: ECSDB,
    protected readonly world: World,
  ) {}
}
