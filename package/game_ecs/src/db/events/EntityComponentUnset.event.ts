import { GameEvent } from "game_event";
import { ComponentKeyType } from "../../type/types";

export const ENTITY_COMPONENT_UNSET_EVENT_TYPE = 'entity.component.unset';

export type EntityComponentUnsetEventTargetType = {
  id: string,
  key: ComponentKeyType,
  componentKeys: ComponentKeyType[]
};

export class EntityComponentUnsetEvent extends GameEvent<EntityComponentUnsetEventTargetType> {
  /**
   * Construct the data for the Component Unset event
   * @param id Entity ID
   * @param key Component Key that was unset
   * @param componentKeys All Component Keys on the Entity
   */
  constructor(id: string, key: ComponentKeyType, componentKeys: ComponentKeyType[]) {
    super({id, key, componentKeys}, ENTITY_COMPONENT_UNSET_EVENT_TYPE, false);
  }
}
