import { GameEvent } from "game_event";
import { ComponentKeyType } from "../../type/ComponentKey.type";

export const ENTITY_COMPONENT_UNSET_EVENT_TYPE = 'entity.component.unset';

export type EntityComponentUnsetEventTargetType = {
  id: string,
  key: ComponentKeyType
};

export class EntityComponentUnsetEvent extends GameEvent<EntityComponentUnsetEventTargetType> {
  constructor(id: string, key: ComponentKeyType) {
    super({id, key}, ENTITY_COMPONENT_UNSET_EVENT_TYPE, false);
  }
}
