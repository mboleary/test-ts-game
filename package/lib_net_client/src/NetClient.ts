import { EmitOptions, Eventable, GameEvent, Observable, Observer } from "game_event";
import { Transport } from "./type/Transport.interface";

export class NetClient implements Observable, Eventable {
  constructor(
    private readonly transport: Transport
  ) {}
  emit<T>(type: string, event: GameEvent<T>, options: EmitOptions): void {
    throw new Error("Method not implemented.");
  }
  subscribe(type: string, handler: Function): void {
    throw new Error("Method not implemented.");
  }
  unsubscribe(handler: Function): void {
    throw new Error("Method not implemented.");
  }
  unsubscribeAll(type: string): void {
    throw new Error("Method not implemented.");
  }
  once(type: string, handler: Function): void {
    throw new Error("Method not implemented.");
  }

  observe<T>(path: string): Observer<T> {
    throw new Error("Method not implemented.");
  }


}
