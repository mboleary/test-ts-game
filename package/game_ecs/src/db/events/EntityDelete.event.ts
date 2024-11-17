import { GameEvent } from "game_event";

export const ENTITY_DELETE_EVENT_TYPE = 'entity.delete';

export type EntityDeleteEventTargetType = {
  id: string
};


export class EntityDeleteEvent extends GameEvent<EntityDeleteEventTargetType> {
  constructor(id: string) {
    super({id}, ENTITY_DELETE_EVENT_TYPE, false);
  }
}
