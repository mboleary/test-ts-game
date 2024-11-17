import { GameEvent } from "game_event";
import { Entity } from "../../Entity";
import { ComponentAndKey } from "../ECSWorldInternals";

export const ENTITY_CREATE_EVENT_TYPE = 'entity.create';

export type EntityCreateEventTargetType = {
  id: string,
  components: ComponentAndKey[]
};

export class EntityCreateEvent extends GameEvent<EntityCreateEventTargetType> {
  constructor(id: string, components: ComponentAndKey[]) {
    super({id, components}, ENTITY_CREATE_EVENT_TYPE, false);
  }
}
