import { GameEvent } from "./GameEvent";
import { GameEventEmitter } from "./GameEventEmitter";
import { EmitOptions } from "./types/EmitOptions";
import { getAllHandlers } from "./util/eventNameUtils";

export class GameEventLinearEmitter extends GameEventEmitter {
  constructor() {
    super();
  }

  private readonly listenerMap: Map<string, Function[]> = new Map();

  emit(type: string, event: GameEvent<any>, options: EmitOptions) {
    const handlers = getAllHandlers<Function>(type, this.listenerMap);

    for (const h of handlers) {
      try {
        h(event);
      } catch (err) {
        console.error(err);
        // @TODO consider emitting an error event
      }
    }
  }

  subscribe(type: string, handler: Function): void {
    let handlerArray = this.listenerMap.get(type);

    if (handlerArray === undefined) {
      handlerArray = [];
    }

    if (handlerArray.includes(handler)) return;

    handlerArray.push(handler);

    this.listenerMap.set(type, handlerArray);
  }

  unsubscribe(handler: Function): void {
    for (const [, handlerArray] of this.listenerMap.entries()) {
      if (handlerArray.includes(handler)) {
        handlerArray.splice(handlerArray.indexOf(handler), 1);
        return;
      }
    }
  }

  unsubscribeAll(type: string): void {
    if (this.listenerMap.has(type)) {
      this.listenerMap.set(type, []);
    }
  }

  once(type: string, handler: Function): void {
    this.subscribe(type, handler);
    this.subscribe(type, () => this.unsubscribe(handler));
  }

  clear() {
    this.listenerMap.clear();
  }
}
