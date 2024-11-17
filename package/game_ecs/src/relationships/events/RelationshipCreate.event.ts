import { GameEvent } from "game_event";

export const RELATIONSHIP_CREATE_EVENT_TYPE = 'relationship.create';

export type RelationshipCreateEventTargetType = {
  idA: string,
  idB: string,
  type: string
};

export class RelationshipCreateEvent extends GameEvent<RelationshipCreateEventTargetType> {
  constructor(idA: string, idB: string, type: string) {
    super({idA, idB, type}, RELATIONSHIP_CREATE_EVENT_TYPE, false);
  }
}
