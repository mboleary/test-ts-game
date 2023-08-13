/**
 * Manages directing events once they are emitted
 */

import { GameEvent } from "./GameEvent";
import { EmitOptions } from "./types/EmitOptions";

export abstract class GameEventEmitter {
  abstract emit<T>(
    type: string,
    event: GameEvent<T>,
    options: EmitOptions,
  ): void;
  abstract subscribe(type: string, handler: Function): void;
  abstract unsubscribe(handler: Function): void;
  abstract unsubscribeAll(type: string): void;
  abstract once(type: string, handler: Function): void;
  abstract clear(): void;
}
