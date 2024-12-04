import { GameEvent } from "game_event";
import { Entity } from "../../Entity";
import { ComponentKeyType } from "../../type/ComponentKey.type";

export const ENTITY_COMPONENT_SET_EVENT_TYPE = 'entity.component.set';

export type EntityComponentSetEventTargetType = {
  id: string,
  key: ComponentKeyType,
  data: any,
  componentKeys: ComponentKeyType[]
};

export class EntityComponentSetEvent extends GameEvent<EntityComponentSetEventTargetType> {
  /**
   * Construct the data for the Component Set event
   * @param id Entity ID
   * @param key Updated Component Key
   * @param data Updated Component Data
   * @param componentKeys All Component Keys on the Entity
   */
  constructor(id: string, key: ComponentKeyType, data: any, componentKeys: ComponentKeyType[]) {
    super({id, key, data, componentKeys}, ENTITY_COMPONENT_SET_EVENT_TYPE, false);
  }
}
