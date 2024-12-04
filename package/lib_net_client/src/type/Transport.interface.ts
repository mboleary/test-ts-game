import { Component } from "./Component";
import { EntityMetadata } from "./EntityMetadata";

export type EntityCreateCallback = (id: string) => void;
export type EntityDeleteCallback = (id: string) => void;
export type ComponentSetCallback = (entityId: string, key: string, value: any) => void;
export type ComponentUnsetCallback = (entityId: string, key: string) => void;
export type MessageCallback = (data: any) => void;

export interface Transport {
  // Commands to send to the server
  entityCreate(id: string, components: Component[]): Promise<void>;
  entityGet(id: string): Promise<string[] | null>;
  entityGetIds(): Promise<string[]>;
  entityGetMetadata(id: string): Promise<EntityMetadata>;
  entityDelete(id: string): Promise<void>;
  entitySubscribe(id: string): Promise<void>;
  entityUnsubscribe(id: string): Promise<void>;
  componentSet<T>(entityId: string, key: string, value: T): Promise<void>;
  componentUnset(entityId: string, key: string): Promise<void>;
  componentGet<T>(entityId: string, key: string): Promise<T>;
  message<T, R>(targetClientId: string, data: T): Promise<R>;
  // Events received from the server
  onEntityCreate: EntityCreateCallback;
  onEntityDelete: EntityDeleteCallback;
  onComponentSet: ComponentSetCallback;
  onComponentUnset: ComponentUnsetCallback;
  onMessage: MessageCallback;
}
