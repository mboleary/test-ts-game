// Internal implementation used to manage subscriptions and notifying them of relevant changes

// import { getAllHandlers } from "../util";
import { Observer } from "./Observer";

export class ObserverManager {
  private observerMap: Map<any, Observer<any>[]> = new Map();
  constructor() {}

  public subscribe<T>(type: any): Observer<T> {
    const observer = new Observer<T>(type);

    let observerArray = this.observerMap.get(type);
    if (observerArray === undefined) {
      observerArray = [];
    }
    observerArray.push(observer);
    this.observerMap.set(type, observerArray);

    // Remove observer from handler map when closed
    observer.addCloseHandler(this.unsubscribe);

    return observer;
  }

  public notify<T>(type: any, data: T) {
    // const observers = getAllHandlers<Observer<T>>(eventPath, this.observerMap);
    const observers = this.observerMap.get(type);

    if (observers) {
      for (const o of observers) {
        o.notify(data);
      }
    } else {
      return;
    }
  }

  public complete() {
    for (const [, handlerArray] of this.observerMap.entries()) {
      handlerArray.forEach(o => {
        o.removeCloseHandler(this.unsubscribe);
        o.close()
      });
    }
    this.observerMap.clear();
  }

  private unsubscribe(observer: Observer<any>) {
    const handlerArray = this.observerMap.get(observer.path);
    if (handlerArray && handlerArray.includes(observer)) {
      observer.close();
      handlerArray.splice(handlerArray.indexOf(observer), 1);
      return;
    }
  }
}
