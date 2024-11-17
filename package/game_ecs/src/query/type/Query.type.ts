import { ComponentKeyType } from "../../type/ComponentKey.type"

export type QueryObject<T = QueryObjectType> = {
  type: T,
  children: (QueryObject | ComponentKeyType)[],
  // Use for ID and Relationship
  value?: string,
}

export enum QueryObjectType {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
  ID = 'ID',
  RELATIONSHIP = 'RELATIONSHIP',
}

export type EntityMappingValues = [string, ComponentKeyType[]];

export type QueryPipelineFilter =
  (entityMapKeyValueArray: EntityMappingValues) => boolean;
