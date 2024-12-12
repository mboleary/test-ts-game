import { GameEvent } from "game_event";

export const CACHED_QUERY_REMOVE_ENTITY_EVENT_TYPE = 'query.remove';

export type CachedQueryRemoveEntityEventTargetType = {
  id: string
};

export class CachedQueryRemoveEntityEvent extends GameEvent<CachedQueryRemoveEntityEventTargetType> {
  /**
   * Construct the data for the Component Set event
   * @param id Entity ID
   */
  constructor(id: string) {
    super({id}, CACHED_QUERY_REMOVE_ENTITY_EVENT_TYPE, false);
  }
}
