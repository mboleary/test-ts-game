/**
 * Testing functionality of EntityManager
 */

import test from "ava";
import { ECSDB } from "../ECSDB";
import { EntityManager } from "../EntityManager";

let ecsdb: ECSDB;
let em: EntityManager;

function ecsSetup() {
  ecsdb = new ECSDB();
  em = new EntityManager(ecsdb);
}

test.beforeEach(() => {
  ecsSetup();
});

test("It Works", (t) => t.pass());
