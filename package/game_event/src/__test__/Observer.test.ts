/**
 * Tests for observer
 */

import test from "ava";
import { Observer } from "../observer";

let observer: Observer<any>;

function observerSetup() {
  observer = new Observer<string>("example");
}

test.beforeEach(() => {
  observerSetup();
});

test('Observer was initialized', (t) => {
  if (observer) t.pass();
  else t.fail();
});

let updateFunctionCallback: Function, closeFunctionCallback: Function;

function updateHandler(data: any, observer: Observer<any>) {
  updateFunctionCallback(data, observer);
}

function closeHandler(observer: Observer<any>) {
  closeFunctionCallback(observer);
}

test.serial("Observer can be listened to", (t) => {
  observer.addUpdateHandler(updateHandler);
  observer.addCloseHandler(closeHandler);
  t.pass();
});

test.serial("Observer can notify listeners of an update", (t) => {
  const TEST_DATA = "test update";
  observer.addUpdateHandler(updateHandler);
  updateFunctionCallback = (data: string, obs: Observer<any>) => {
    if (data === TEST_DATA && observer === obs) t.pass();
    else t.fail();
  };

  observer.notify(TEST_DATA);
});

test.serial("Observer can be closed", (t) => {
  observer.close();

  if (observer.isClosed()) t.pass();
});

