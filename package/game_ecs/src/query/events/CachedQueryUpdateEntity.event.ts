import { GameEvent } from "game_event";

export const CACHED_QUERY_UPDATE_ENTITY_EVENT_TYPE = 'query.update';

export type CachedQueryUpdateEntityEventTargetType = {
  id: string
};

export class CachedQueryUpdateEntityEvent extends GameEvent<CachedQueryUpdateEntityEventTargetType> {
  /**
   * Construct the data for the Component Set event
   * @param id Entity ID
   */
  constructor(id: string) {
    super({id}, CACHED_QUERY_UPDATE_ENTITY_EVENT_TYPE, false);
  }
}
