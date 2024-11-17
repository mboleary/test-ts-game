import { GameEvent } from "game_event";

export const RELATIONSHIP_DELETE_EVENT_TYPE = 'relationship.delete';

export type RelationshipDeleteEventTargetType = {
  idA: string,
  idB: string,
  type: string
};

export class RelationshipDeleteEvent extends GameEvent<RelationshipDeleteEventTargetType> {
  constructor(idA: string, idB: string, type: string) {
    super({idA, idB, type}, RELATIONSHIP_DELETE_EVENT_TYPE, false);
  }
}
