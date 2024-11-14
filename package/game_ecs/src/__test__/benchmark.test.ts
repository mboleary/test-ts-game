/**
 * Test the performance of the ECS
 */

import { expect, test, describe, beforeEach, afterEach, beforeAll } from "vitest";
import { World } from "../World";
import { Entity } from "../Entity";

import { randInt } from "./util/random";
import { genComponents } from "./util/genComponents";
import { Chance } from "chance";

const COUNT = 1000000;
const GET_COUNT = 10;

describe("World benchmark", () => {
  let world: World;
  let uuids: string[] = [];

  const chance = new Chance()

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
})
