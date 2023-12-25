/**
 * Testing the ECS Database
 */

import test from "ava";
import { ECSDB } from "../db/ECSDB";
import { EntityManager } from "../managers/EntityManager";

let ecsdb: ECSDB;

function ecsSetup() {
  ecsdb = new ECSDB();;
}

test.beforeEach(() => {
  ecsSetup();
});

test("ECSDB was initialized", (t) => {
  if (ecsdb) t.pass();
});

test.serial("Can add Entity", (t) => {
  const entity = ecsdb.addEntity({});

  // Entity was created
  if (!entity) {
    t.fail(`Entity was not returned`);
  }

  // Entity reference is the same
  const getEntityResult = ecsdb.getEntity(entity.id);
  t.not(getEntityResult, entity, 'Entity reference is not the same as returned entity');
});
