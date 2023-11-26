/**
 * testing functionality of Observers in Entity
 */

import test from "ava";
import { Component } from "../Component";
import { Entity } from "../Entity";
import { EntityManager } from "../managers";
import { Scene } from "../Scene";

const KEY = Symbol.for("key");
const COMP1 = {test:true};

let scene: Scene;
let entity: Entity;
let component: Component;

function ecsSetup() {
  scene = Scene.build();
  const em = scene.world.entityManager;
  if (!em) return;
  component = Component.build(KEY, COMP1);
  entity = em?.createEntity({components: [component]});
}

test.beforeEach(() => {
  ecsSetup();
});

test("Scene is built", (t) => {
  if (scene && component && entity) {
    t.pass();
  } else {
    t.fail();
  }
});

test("can get component", (t) => {
  const result = entity.getComponent<typeof COMP1>(KEY);
  if (result) t.pass();
  else t.fail();
});

test("can observe a property", (t) => {
  const observer = entity.observe<typeof COMP1>(KEY);
  observer.addUpdateHandler((update) => {
    if (update.test === false) t.pass();
    else t.fail("value not updated");
  });
  const c = entity.getComponent<typeof COMP1>(KEY);
  if (c) {
    // update component
    c.test = false;
  } else {
    t.fail('couldn\'t get component');
  }
});
