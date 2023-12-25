/**
 * Testing the ECS Database
 */

import test from "ava";
import { Archetype } from "../Archetype";
import { ECSDB } from "../ECSDB";

let archetype: Archetype;
let ecsdb: ECSDB;

function ecsSetup() {
  ecsdb = new ECSDB();
  archetype = new Archetype(ecsdb);
}

test.beforeEach(() => {
  ecsSetup();
});

test("ECSDB was initialized", (t) => {
  if (ecsdb) t.pass();
});

test("Archetype was initialized", (t) => {
  if (archetype) t.pass();
});

test.serial("Can add Entity", (t) => {
  const entity = archetype.addEntity({});

  if (!entity) t.fail('Entity not returned after creation');

  const archetypeGet = archetype.getEntity(entity.id);

  if (!archetypeGet) t.fail('Archetype could not get Entity')
});
