/**
 * testing functionality of Observers in Entity
 */

import test from "ava";
import { v4 as uuidv4 } from "uuid";
import { Component } from "../Component";
import { ECSDB } from "../db";
import { Entity } from "../Entity";
import { Scene } from "../Scene";

const KEY = Symbol.for("key");
const COMP1 = {test:true};

let ecsdb: ECSDB;
let scene: Scene;
let entity: Entity;
let component: Component;

function ecsSetup() {
  ecsdb = new ECSDB();
  scene = new Scene(uuidv4(), ecsdb);
  const em = scene.world.entityManager;
  if (!em) return;
  component = new Component(KEY, COMP1);
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
  console.log("Entity:", entity.components);
  const result = entity.getComponent<typeof COMP1>(KEY);
  console.log({result})
  if (result) t.pass();
  else t.fail("No component returned");
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
