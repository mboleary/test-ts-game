/**
 * Testing the Linear Event Emitter
 */

import test from "ava";
import { Entity } from "../../../baseClasses";
import { ECSDB } from "../../ecs/ECSDB";
import { GameEvent } from "../GameEvent";
import { GameEventEmitter } from "../GameEventEmitter";
import { GameEventLinearEmitter } from "../GameEventLinearEmitter";

let emitter: GameEventEmitter;

function eventEmitterSetup() {
  emitter = new GameEventLinearEmitter();
}

test.beforeEach(() => {
  eventEmitterSetup();
});

test.afterEach(() => {
  emitter.clear();
});

test("GameEventEmitter was instantialized", (t) => {
  if (emitter) t.pass();
});

test.serial("Event can be emitted and received via a subscriber", (t) => {
  const exampleHandler = (event: GameEvent<any>) => {
    if (event === EVENT) {
      t.pass();
    }
  };

  const EVENT_NAME = "event.test";
  const EVENT_TYPE = "EVENT_TYPE";
  const EXAMPLE_TARGET = new Entity("id", "name", new ECSDB());

  emitter.subscribe(EVENT_NAME, exampleHandler);

  const EVENT = new GameEvent(EXAMPLE_TARGET, EVENT_TYPE, false);

  emitter.emit(EVENT_NAME, EVENT, {});
});

test.serial("EventEmitter is cleared properly", (t) => {
  const exampleHandler = (event: GameEvent<any>) => {
    if (event === EVENT) {
      t.fail();
    }
  };

  const EVENT_NAME = "event.test";
  const EVENT_TYPE = "EVENT_TYPE";
  const EXAMPLE_TARGET = new Entity("id", "name", new ECSDB());

  emitter.subscribe(EVENT_NAME, exampleHandler);

  const EVENT = new GameEvent(EXAMPLE_TARGET, EVENT_TYPE, false);

  emitter.clear();

  emitter.emit(EVENT_NAME, EVENT, {});

  // If we get here, the test passed
  if (t.passed) {
    t.pass();
  }
});

test.serial("Event is not received by unsubscribed handlers", (t) => {
  const exampleHandler1 = (event: GameEvent<any>) => {
    if (event === EVENT) {
      t.fail();
    }
  };

  const EVENT_NAME = "event.test";
  const EVENT_TYPE = "EVENT_TYPE";
  const EXAMPLE_TARGET = new Entity("id", "name", new ECSDB());

  emitter.subscribe(EVENT_NAME, exampleHandler1);

  const EVENT = new GameEvent(EXAMPLE_TARGET, EVENT_TYPE, false);

  emitter.unsubscribe(exampleHandler1);

  emitter.emit(EVENT_NAME, EVENT, {});

  // If we get here, the test passed
  if (t.passed) {
    t.pass();
  }
});

test.serial(
  "Event is received by subscribed handlers when others are unsubscribed",
  (t) => {
    const exampleHandler1 = (event: GameEvent<any>) => {
      if (event === EVENT) {
        t.fail();
      }
    };

    const exampleHandler2 = (event: GameEvent<any>) => {
      if (event === EVENT) {
        t.pass();
      }
    };

    const EVENT_NAME = "event.test";
    const EVENT_TYPE = "EVENT_TYPE";
    const EXAMPLE_TARGET = new Entity("id", "name", new ECSDB());

    emitter.subscribe(EVENT_NAME, exampleHandler1);
    emitter.subscribe(EVENT_NAME, exampleHandler2);

    const EVENT = new GameEvent(EXAMPLE_TARGET, EVENT_TYPE, false);

    emitter.unsubscribe(exampleHandler1);

    emitter.emit(EVENT_NAME, EVENT, {});
  },
);

test.serial("Event handlers are properly unsubscribed by type", (t) => {
  const exampleHandlerA = (event: GameEvent<any>) => {
    if (event === EVENT) {
      t.fail();
    }
  };

  const exampleHandlerB = (event: GameEvent<any>) => {
    if (event === EVENT) {
      t.pass();
    }
  };

  const EVENT_NAME_A = "event.test.a";
  const EVENT_NAME_B = "event.test.b";
  const EVENT_TYPE = "EVENT_TYPE";
  const EXAMPLE_TARGET = new Entity("id", "name", new ECSDB());

  emitter.subscribe(EVENT_NAME_A, exampleHandlerA);
  emitter.subscribe(EVENT_NAME_B, exampleHandlerB);

  const EVENT = new GameEvent(EXAMPLE_TARGET, EVENT_TYPE, false);

  emitter.unsubscribeAll(EVENT_NAME_A);

  emitter.emit(EVENT_NAME_B, EVENT, {});
});
