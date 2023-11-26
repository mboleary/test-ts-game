import { ObserverManager } from "game_event";

export function buildProxy<T extends object>(object: T, observerManager: ObserverManager, type: any): T {
  const handler: ProxyHandler<T> = {
    set(target: T, property, newValue) {
      const toRet = Reflect.set(target, property, newValue);
      observerManager.notify(type, target);
      return toRet;
    }
  }
  return new Proxy(object, handler);
}
