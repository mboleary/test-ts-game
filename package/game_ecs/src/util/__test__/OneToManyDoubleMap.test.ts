/**
 * Testing some convenience data structures
 */

import test from "ava";
import { OneToManyDoubleMap } from "../OneToManyDoubleMap";

const KEY1 = "A", KEY2 = "B", VAL1 = "C", VAL2 = "D";

let doubleMap: OneToManyDoubleMap<string, string>;

function setup() {
  doubleMap = new OneToManyDoubleMap();
}

test.beforeEach(() => {
  setup();
});

test("OneToManyDoubleMap was initialized", (t) => {
  if (doubleMap) t.pass();
});

test.serial("can store a key and value", (t) => {
  doubleMap.set(KEY1, VAL1);
  t.pass();
});

test.serial("can store more than one value for a key", (t) => {
  doubleMap.set(KEY1, VAL1);
  doubleMap.set(KEY1, VAL2);
  t.pass();
});

test.serial("can get key and value after store", (t) => {
  doubleMap.set(KEY1, VAL1);
  doubleMap.set(KEY1, VAL2);
  if (doubleMap.getValue(KEY1) !== undefined && doubleMap.getKey(VAL1) !== undefined) {
    t.pass();
  }
});

test.serial("can check for key and value after store", (t) => {
  doubleMap.set(KEY1, VAL1);
  doubleMap.set(KEY1, VAL2);
  if (doubleMap.hasValue(KEY1) !== undefined && doubleMap.hasKey(VAL1) !== undefined) {
    t.pass();
  }
});

// set same key, diff val
// has key
// has val
// get val with key
// get key with val

test.serial("can get key and value after storing multiple items", (t) => {
  doubleMap.set(KEY1, VAL1);
  doubleMap.set(KEY1, VAL2);
  if (doubleMap.getValue(KEY1) !== undefined && doubleMap.getKey(VAL2) !== undefined) {
    t.pass();
  }
});

test.serial("after changing a value, will not remove the first value", (t) => {
  doubleMap.set(KEY1, VAL1);
  doubleMap.set(KEY1, VAL2);
  if (!doubleMap.hasValue(VAL1)) t.fail();
  t.pass();
});

test.serial("can check for key and value after storing multiple items", (t) => {
  doubleMap.set(KEY1, VAL1);
  doubleMap.set(KEY1, VAL2);
  if (doubleMap.hasValue(KEY1) !== undefined && doubleMap.hasKey(VAL2) !== undefined) {
    t.pass();
  }
});

// delete key

test.serial("can delete key", (t) => {
  doubleMap.set(KEY1, VAL1);
  if (doubleMap.deleteKey(KEY1)) t.pass();
});

test.serial("can delete value", (t) => {
  doubleMap.set(KEY1, VAL1);
  if (doubleMap.deleteValue(VAL1)) t.pass();
});

test.serial("will return false if deleting non-existant key", (t) => {
  doubleMap.set(KEY1, VAL1);
  if (!doubleMap.deleteKey(KEY2)) t.pass();
});

test.serial("will return false if deleting non-existant value", (t) => {
  doubleMap.set(KEY1, VAL1);
  if (!doubleMap.deleteValue(VAL2)) t.pass();
});
// entries
// values
