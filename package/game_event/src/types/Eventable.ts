import { GameEvent } from "../GameEvent";
import { Observer } from "../observer";
import { EmitOptions } from "./EmitOptions";

/**
 * Interface that enables events to be emitted on a class
 */
export interface Eventable {
  emit<T>(type: string, event: GameEvent<T>, options: EmitOptions): void;
  subscribe(type: string, handler: Function): void;
  unsubscribe(handler: Function): void;
  unsubscribeAll(type: string): void;
  once(type: string, handler: Function): void;
}

/**
 * Interface that enables observers to be created on a class
 */
export interface Observable {
  subscribe<T>(path: string): Observer<T>;
}
