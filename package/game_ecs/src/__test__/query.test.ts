import { expect, test, describe, beforeEach, beforeAll } from "vitest";
import { World } from "../World";
import { Chance } from "chance";
import { randInt } from "./util/random";
import { Q } from "../query/Q";
import { genComponents } from "./util/genComponents";
import { Entity } from "../Entity";

describe("Query World", () => {
  let world: World;
  let entityIds: string[];

  const chance = new Chance();

  beforeEach(() => {
    world = new World();
    entityIds = [];
  });

  describe(".query", () => {
    describe("With an empty world", () => {
      test("Return nothing", () => {
        const results = world.query(Q.AND(['test']));
  
        expect(results.length).toBe(0);
      });
    });
    describe("With other entities created", () => {
      beforeEach(() => {
        for (let i = 0; i < randInt(1, 10); i++) {
          const e = world.createEntity(undefined, [{key:'LABEL', value: 'pregen'}, {key: 'INDEX', value: i}, {key: `UNIQUE-${i}`, value: true}]);
          entityIds.push(e.id);
        }
      });
      test("Query with empty AND, returning everything", () => {
        const results = world.query(Q.AND([]));
  
        expect(results.length).toBe(entityIds.length);
      });
      test("Query for unused component, returning nothing", () => {
        const results = world.query(Q.AND(['unused']));
  
        expect(results.length).toBe(0);
      });
      test("Query for unique component, returning 1 entity", () => {
        const TEST = `UNIQUE-${0}`;
        const results = world.query(Q.AND([TEST]));
  
        expect(results.length).toBe(1);
        expect(results[0].getComponentWithoutProxy(TEST)).toBe(true);
      });
    });
    describe("With more complex entities created", () => {
    const NUM = 100;
    const TEST_RELATIONSHIP = 'test_relationship';
      beforeEach(() => {
        for (let i = 0; i < NUM; i++) {
          const e = world.createEntity(undefined, genComponents(chance));
          entityIds.push(e.id);
        }
        const relE1 = world.getEntity(entityIds[0]) as Entity;
        const relE2 = world.getEntity(entityIds[1]) as Entity;
        relE1.addRelation(relE2, TEST_RELATIONSHIP);
      });
      test("Query with empty AND, returning everything", () => {
        const results = world.query(Q.AND([]));
  
        expect(results.length).toBe(entityIds.length);
      });
      test("Query for unused component, returning nothing", () => {
        const results = world.query(Q.AND(['unused']));
  
        expect(results.length).toBe(0);
      });
      test("Query for unique component, returning some entities", () => {
        const targetEntity = world.getEntity(chance.pickone(entityIds)) as Entity;
        const targetComponent = targetEntity.components[0];
        const results = world.query(Q.AND([targetComponent]));
  
        expect(results.length).toBeGreaterThanOrEqual(1);
        expect(results).toContain(targetEntity);
        expect(results[0].getComponentWithoutProxy(targetComponent)).not.toBeUndefined();
      });
      test("Query for a relationship, returning 1 entity", () => {
        // Query for entities with a TEST_RELATIONSHIP with entityIds[1]
        const results = world.query(Q.RELATIONSHIP(TEST_RELATIONSHIP, Q.ID(entityIds[1])));
        console.log("results", results);
        expect(results.length).toBe(1);
        expect(results[0].relationships.length).toBe(1);
        expect(results[0].relationships[0].type).toBe(TEST_RELATIONSHIP);
        expect(results[0].relationships[0].entity.id).toBe(entityIds[1]);
      });

      test("Query for a relationship using a Component subquery, returning 1 entity", () => {
        // Query for entities with a TEST_RELATIONSHIP with entityIds[1]
        const targetEntity = world.getEntity(entityIds[1]) as Entity;
        const results = world.query(Q.RELATIONSHIP(TEST_RELATIONSHIP, targetEntity.components[0]));
        console.log("results", results);
        expect(results.length).toBe(1);
        expect(results[0].relationships.length).toBe(1);
        expect(results[0].relationships[0].type).toBe(TEST_RELATIONSHIP);
        expect(results[0].relationships[0].entity.id).toBe(entityIds[1]);
      });
    });
  });
});
