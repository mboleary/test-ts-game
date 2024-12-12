import { EmitOptions, Eventable, GameEvent, GameEventLinearEmitter } from "game_event";
import { Entity } from "../Entity";
import { ECSWorldInternals } from "../db";
import { ENTITY_CREATE_EVENT_TYPE, EntityCreateEvent, } from "../db/events/EntityCreate.event";
import { QueryManager } from "./QueryManager";
import { QueryObject } from "./type/Query.type";
import { ComponentKeyType } from "../type/ComponentKey.type";
import { ENTITY_DELETE_EVENT_TYPE, EntityDeleteEvent } from "../db/events/EntityDelete.event";
import { ENTITY_COMPONENT_SET_EVENT_TYPE, EntityComponentSetEvent } from "../db/events/EntityComponentSet.event";
import { ENTITY_COMPONENT_UNSET_EVENT_TYPE, EntityComponentUnsetEvent } from "../db/events/EntityComponentUnset.event";
import { CachedQueryAddEntityEvent, CACHED_QUERY_ADD_ENTITY_EVENT_TYPE } from "./events/CachedQueryAddEntity.event";
import { CachedQueryRemoveEntityEvent, CACHED_QUERY_REMOVE_ENTITY_EVENT_TYPE } from "./events/CachedQueryRemoveEntity.event";
import { CachedQueryUpdateEntityEvent, CACHED_QUERY_UPDATE_ENTITY_EVENT_TYPE } from "./events/CachedQueryUpdateEntity.event";

export class CachedQuery implements Eventable {
  private readonly matchedEntityIds: Set<string> = new Set();
  private isListening: boolean = false;

  constructor(
    private readonly internals: ECSWorldInternals,
    private readonly queryManager: QueryManager,
    public readonly queryObject: QueryObject,
  ) {
  }

  /**
   * Start listening for updates
   */
  public startListening(): void {
    if (this.isListening) return;

    // Clear matched entity ids and re-query
    this.matchedEntityIds.clear();
    const entities = this.queryManager.runQuery(this.queryObject);

    for (const e of entities) {
      this.matchedEntityIds.add(e.id);
    }

    // Listen for updates
    this.internals.subscribe(ENTITY_CREATE_EVENT_TYPE, this.handleEntityCreate);
    this.internals.subscribe(ENTITY_DELETE_EVENT_TYPE, this.handleEntityDelete);
    this.internals.subscribe(ENTITY_COMPONENT_SET_EVENT_TYPE, this.handleEntityComponentSet);
    this.internals.subscribe(ENTITY_COMPONENT_UNSET_EVENT_TYPE, this.handleEntityComponentUnset);
  }

  private handleEntityCreate(e: EntityCreateEvent) {
    this.checkEntityAndUpdateList(e.target.id, e.target.components.map(c => c.key));
  }

  private handleEntityDelete(e: EntityDeleteEvent) {
    if (this.matchedEntityIds.has(e.target.id)) {
      this.matchedEntityIds.delete(e.target.id);
    }
  }

  private handleEntityComponentSet(e: EntityComponentSetEvent) {
    this.checkEntityAndUpdateList(e.target.id, e.target.componentKeys);
  }

  private handleEntityComponentUnset(e: EntityComponentUnsetEvent) {
    this.checkEntityAndUpdateList(e.target.id, e.target.componentKeys);
  }

  private checkEntityAndUpdateList(id: string, componentKeys: ComponentKeyType[]) {
    const result = this.queryManager.queryOne(this.queryObject, id, componentKeys);
    if (result && !this.matchedEntityIds.has(id)) {
      this.matchedEntityIds.add(id);
      this.emit(CACHED_QUERY_ADD_ENTITY_EVENT_TYPE, new CachedQueryAddEntityEvent(id));
    } else if (!result && this.matchedEntityIds.has(id)) {
      this.matchedEntityIds.delete(id);
      this.emit(CACHED_QUERY_REMOVE_ENTITY_EVENT_TYPE, new CachedQueryRemoveEntityEvent(id));
    } else {
      this.emit(CACHED_QUERY_UPDATE_ENTITY_EVENT_TYPE, new CachedQueryUpdateEntityEvent(id));
    }
  }

  /**
   * Get Matched Entities
   * @returns matched entities
   */
  public getEntities(): Entity[] {
    return Array.from(this.matchedEntityIds.values()).map(id => this.internals.entityReferenceMap.get(id) as Entity);
  }

  /**
   * Stop listening for updates
   */
  public stopListening() {
    if (!this.isListening) return;

    this.matchedEntityIds.clear();

    this.internals.unsubscribe(this.handleEntityCreate);
    this.internals.unsubscribe(this.handleEntityDelete);
    this.internals.unsubscribe(this.handleEntityComponentSet);
    this.internals.unsubscribe(this.handleEntityComponentUnset);
  }

  /**
   * Handle Events
   */

  private readonly eventEmitter: GameEventLinearEmitter = new GameEventLinearEmitter();

  emit<T>(type: string, event: GameEvent<T>, options: EmitOptions = {}): void {
    this.eventEmitter.emit(type, event, options);
  }
  subscribe(type: string, handler: Function): void {
    this.eventEmitter.subscribe(type, handler);
  }
  unsubscribe(handler: Function): void {
    this.eventEmitter.unsubscribe(handler);
  }
  unsubscribeAll(type: string): void {
    this.eventEmitter.unsubscribeAll(type);
  }
  once(type: string, handler: Function): void {
    this.eventEmitter.once(type, handler);
  }
}
