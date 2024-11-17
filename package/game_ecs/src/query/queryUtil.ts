import { ComponentKeyType } from "../type/ComponentKey.type";
import { EntityMappingValues, QueryObject, QueryObjectType } from "./type/Query.type";

// export function buildAnd(queryObject: QueryObject<QueryObjectType.AND>) {
//   return (entityMapKeyValueArray: EntityMappingValues) => {
//     return queryObject.children.reduce((compKey) => );
//   }
// };

export function isComponentKeyType(c: any): boolean {
  return typeof c === 'string' || typeof c === 'symbol' || typeof c === 'function';
}

export function hasEntityId(id: string) {
  return (entityMapKeyValueArray: EntityMappingValues) => {
    return entityMapKeyValueArray[0] === id;
  }
}

export function hasComponent(component: ComponentKeyType) {
  return (entityMapKeyValueArray: EntityMappingValues) => {
    return entityMapKeyValueArray[1].includes(component);
  }
}
