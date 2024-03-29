/**
 * Testing the ECS Database
 */

import test from "ava";
import { ECSDB } from "../db/ECSDB";
import { EntityManager } from "../managers/EntityManager";

let ecsdb: ECSDB;
let em: EntityManager;

function ecsSetup() {
  ecsdb = new ECSDB();
  em = new EntityManager(ecsdb);
}

test.beforeEach(() => {
  ecsSetup();
});

test("ECSDB was initialized", (t) => {
  if (ecsdb) t.pass();
});

test("EntityManager was initialized", (t) => {
  if (em) t.pass();
});

test.serial("Can add Entity", (t) => {
  em.createEntity({});

  // Entity was added to Entity Map
  t.not(Array.from(ecsdb.entityDB.entityMap.keys()).length, 0);
});
