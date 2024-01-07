/**
 * Testing functionality of EntityManager
 */

import test from "ava";
import { ECSDB } from "../db/ECSDB";
import { EntityManager } from "../managers/EntityManager";
import { World } from "../World";

let ecsdb: ECSDB;
let world: World;
let em: EntityManager;

function ecsSetup() {
  ecsdb = new ECSDB();
  world = new World(ecsdb);
  em = new EntityManager(ecsdb, world);
}

test.beforeEach(() => {
  ecsSetup();
});

test("It Works", (t) => t.pass());
