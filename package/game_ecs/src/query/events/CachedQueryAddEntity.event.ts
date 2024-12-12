import { GameEvent } from "game_event";

export const CACHED_QUERY_ADD_ENTITY_EVENT_TYPE = 'query.add';

export type CachedQueryAddEntityEventTargetType = {
  id: string
};

export class CachedQueryAddEntityEvent extends GameEvent<CachedQueryAddEntityEventTargetType> {
  /**
   * Construct the data for the Component Set event
   * @param id Entity ID
   */
  constructor(id: string) {
    super({id}, CACHED_QUERY_ADD_ENTITY_EVENT_TYPE, false);
  }
}
