import { GameEvent } from "game_event";
import { Entity } from "../../Entity";
import { ComponentKeyType } from "../../type/ComponentKey.type";

export const ENTITY_COMPONENT_SET_EVENT_TYPE = 'entity.component.set';

export type EntityComponentSetEventTargetType = {
  id: string,
  key: ComponentKeyType,
  data: any
};

export class EntityComponentSetEvent extends GameEvent<EntityComponentSetEventTargetType> {
  constructor(id: string, key: ComponentKeyType, data: any) {
    super({id, key, data}, ENTITY_COMPONENT_SET_EVENT_TYPE, false);
  }
}
