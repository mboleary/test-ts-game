/**
 * Test the performance of the ECS
 */

import { expect, test, describe, beforeEach, afterEach, beforeAll } from "vitest";
import { World } from "../World";
import { Entity } from "../Entity";

import { randInt } from "./util/random";
import { genComponents } from "./util/genComponents";
import { Chance } from "chance";
import { Q } from "../query/Q";

const COUNT = 1000000;
const GET_COUNT = 10;

describe("World benchmark", () => {
  let world: World;
  let uuids: string[] = [];

  const chance = new Chance();

  world = new World();
  uuids = [];
  for(let i = 0; i < COUNT; i++) {
    const e = world.createEntity(undefined, genComponents(chance));
    uuids.push(e.id);
  }

  // beforeAll(() => {
    
  // });

  describe(`Getting ${GET_COUNT} random`, () => {
    console.log(uuids);
    for (let i = 0; i < GET_COUNT; i++) {
      const id = uuids[randInt(0, uuids.length)];
      test(`Get entity ${id}`, () => {
        const entity = world.getEntity(id);
  
        expect(entity).not.toBeUndefined();
        expect(entity).toBeInstanceOf(Entity);
        expect(entity?.id).toEqual(id);
      });
      test(`Entity ${id} getting components`, () => {
        const entity = world.getEntity(id);
        const componentTypes = entity?.components;
        
        if (componentTypes) {
          for (const key of componentTypes) {
            const comp = entity.getComponentWithoutProxy(key);
            expect(comp).not.toBeNull();
          }
        }
      });
      test(`Entity ${id} adding components`, () => {
        const entity = world.getEntity(id);
        
        const key = 'TEST';
        const value = {test: true};
        entity?.setComponent(key, value);
        
        expect(entity?.components).toContain(key);
        expect(entity?.getComponentWithoutProxy(key)).toEqual(value);
      });
      test(`Entity ${id} removing components`, () => {
        const entity = world.getEntity(id);

        const key = 'TEST'; // from last test
        entity?.unsetComponent(key);
        
        expect(entity?.components).not.toContain(key);
        expect(entity?.getComponentWithoutProxy(key)).toBeNull();
      });
    }
  });
  describe('Query benchmarking', () => {
    const REL1 = 'REL1';
    const REL2 = 'REL2';
    const REL3 = 'REL3';

    const relEntities: Entity[] = [];

    let interestingEntityArr: Entity[];

    beforeEach(() => {
      // Make some relationships
      const rel1 = chance.pickset(uuids, 2);
      const rel2 = chance.pickset(uuids, 2);
      const rel3 = chance.pickset(uuids, 2);

      world.getEntity(rel1[0])?.addRelation(world.getEntity(rel1[1]) as Entity, REL1);
      world.getEntity(rel2[0])?.addRelation(world.getEntity(rel2[1]) as Entity, REL2);
      world.getEntity(rel3[0])?.addRelation(world.getEntity(rel3[1]) as Entity, REL3);

      relEntities.push(
        world.getEntity(rel1[1]) as Entity, 
        world.getEntity(rel2[1]) as Entity,
        world.getEntity(rel3[1]) as Entity,
      );

      // Find some interesting entities
      interestingEntityArr = chance.pickset(uuids, 3).map(id => world.getEntity(id) as Entity);
    });

    test('Check for REL1 by id', () => {
      const results = world.query(Q.RELATIONSHIP(REL1, Q.ID(relEntities[0].id)));
      expect(results.length).toBe(1);
      // Causes Out-of-memory errors
      // expect(results[0].relationships).toContain(expect.objectContaining({relationship: REL1}));
    });

    test('Check for REL2 by id', () => {
      const results = world.query(Q.RELATIONSHIP(REL2, Q.ID(relEntities[1].id)));
      expect(results.length).toBe(1);
      // Causes Out-of-memory errors
      // expect(results[0].relationships).toContain(expect.objectContaining({relationship: REL1}));
    });

    test('Check for REL3 by id', () => {
      const results = world.query(Q.RELATIONSHIP(REL3, Q.ID(relEntities[2].id)));
      expect(results.length).toBe(1);
      // Causes Out-of-memory errors
      // expect(results[0].relationships).toContain(expect.objectContaining({relationship: REL1}));
    });
  });
});
