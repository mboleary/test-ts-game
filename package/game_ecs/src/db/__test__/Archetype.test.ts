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
  archetype = new Archetype(ecsdb, []);
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

test.serial("archetype.addEntity: Can add new entity", (t) => {
  const entity = archetype.addEntity({});

  if (!entity) t.fail('Entity not returned after creation');

  const archetypeGet = archetype.getEntity(entity.id);

  if (!archetypeGet) t.fail('Archetype could not get Entity')

  t.pass();
});

// archetype..getEntityParent

// archetype.removeEntity

// archetype.removeEntity

// archetype.getEntity

// archetype.setEntityActive

// archetype.setEntityTemp

// archetype.setEntityMounted

// archetype.setEntityComponent

// archetype.getEntityComponent

// archetype.entityHasComponent

// archetype.getComponentKeys


