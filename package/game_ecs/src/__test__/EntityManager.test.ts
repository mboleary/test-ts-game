/**
 * Testing functionality of EntityManager
 */

import test from "ava";
import { ECSDB } from "../db/ECSDB";
import { EntityManager } from "../managers/EntityManager";

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
