import { expect, test, describe, beforeEach, afterEach } from "vitest";
import { World } from "../World";
import { Entity } from "../Entity";

import { randInt } from "./util/random";

describe("World", () => {
  let world: World;

  beforeEach(() => {
    world = new World();
  });

  describe(".createEntity", () => {
    describe("With an empty world", () => {
      test("Create New Entity with no arguments", () => {
        const newEntity = world.createEntity();
  
        expect(newEntity).toBeInstanceOf(Entity);
      });
      test("Create New Entity with uuid", () => {
        const id = "deadbeef-dd62-49c2-af1c-ca3e4ce82967";
        const newEntity = world.createEntity(id);
  
        expect(newEntity).toBeInstanceOf(Entity);
        expect(newEntity.id).toEqual(id);
      });
      test("Create new Entity with components", () => {
        const key = 'TEST';
        const value = {test: true};
        const newEntity = world.createEntity(undefined, [{key, value}]);
  
        expect(newEntity).toBeInstanceOf(Entity);
        expect(newEntity.components.length).toEqual(1);
        expect(newEntity.components[0]).toEqual(key);
        expect(newEntity.getComponentWithoutProxy(key)).toEqual(value);
      });
    });
    describe("With other entities created", () => {
      beforeEach(() => {
        for (let i = 0; i < randInt(1, 10); i++) {
          world.createEntity(undefined, [{key:'LABEL', value: 'pregen'}]);
        }
      });
      test("Create New Entity with no arguments", () => {
        const newEntity = world.createEntity();
  
        expect(newEntity).toBeInstanceOf(Entity);
      });
      test("Create New Entity with uuid", () => {
        const id = "deadbeef-dd62-49c2-af1c-ca3e4ce82967";
        const newEntity = world.createEntity(id);
  
        expect(newEntity).toBeInstanceOf(Entity);
        expect(newEntity.id).toEqual(id);
      });
      test("Create new Entity with components", () => {
        const key = 'TEST';
        const value = {test: true};
        const newEntity = world.createEntity(undefined, [{key, value}]);
  
        expect(newEntity).toBeInstanceOf(Entity);
        expect(newEntity.components.length).toEqual(1);
        expect(newEntity.components[0]).toEqual(key);
        expect(newEntity.getComponentWithoutProxy(key)).toEqual(value);
      });
    });
  });
  describe(".getEntity", () => {
    describe("With an empty world", () => {
      test("Get entity that doesn't exist", () => {
        expect(world.getEntity("deadbeef-dd62-49c2-af1c-ca3e4ce82967")).toBeUndefined();
      });
    });
    describe("With other entities created", () => {
      let uuids: string[] = [];
      beforeEach(() => {
        uuids = [];
        for (let i = 0; i < randInt(1, 10); i++) {
          const e = world.createEntity(undefined, [{key:'LABEL', value: 'pregen'}]);
          uuids.push(e.id);
        }
      });
      test("Get entity that doesn't exist", () => {
        expect(world.getEntity("deadbeef-dd62-49c2-af1c-ca3e4ce82967")).toBeUndefined();
      });
      test("Get entity", () => {
        const id = uuids[randInt(0, uuids.length)];
        const entity = world.getEntity(id);
  
        expect(entity).not.toBeUndefined();
        expect(entity).toBeInstanceOf(Entity);
        expect(entity?.id).toEqual(id);
      });
    });
  });
  describe(".deleteEntity", () => {
    describe("With an empty world", () => {
      test("Delete entity that doesn't exist", () => {
        expect(() => world.deleteEntity("deadbeef-dd62-49c2-af1c-ca3e4ce82967")).toThrowError();
      });
    });
    describe("With other entities created", () => {
      let uuids: string[] = [];
      beforeEach(() => {
        uuids = [];
        for (let i = 0; i < randInt(1, 10); i++) {
          const e = world.createEntity(undefined, [{key:'LABEL', value: 'pregen'}]);
          uuids.push(e.id);
        }
      });
      test("Delete entity that doesn't exist", () => {
        expect(() => world.deleteEntity("deadbeef-dd62-49c2-af1c-ca3e4ce82967")).toThrowError();
      });
      test("Delete entity", () => {
        const id = uuids[randInt(0, uuids.length)];
        world.deleteEntity(id);

        const entity = world.getEntity(id);
  
        expect(entity).toBeUndefined();
      });
    });
  });
})
