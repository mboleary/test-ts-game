import { GameEvent } from "../GameEvent";
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
