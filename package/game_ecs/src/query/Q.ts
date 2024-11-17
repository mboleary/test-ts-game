/**
 * Builder for generating the query objects used to build the query pipeline
 */

import { ComponentKeyType } from "../type/ComponentKey.type";
import { QueryObject, QueryObjectType } from "./type/Query.type";

export class Q {
  public static AND(params: (ComponentKeyType | QueryObject)[]): QueryObject {
    return {
      type: QueryObjectType.AND,
      children: params
    };
  }
  public static OR(params: (ComponentKeyType | QueryObject)[]): QueryObject {
    return {
      type: QueryObjectType.OR,
      children: params
    };
  }
  public static NOT(params: (ComponentKeyType | QueryObject)[]): QueryObject {
    return {
      type: QueryObjectType.NOT,
      children: params
    };
  }
  public static ID(id: string): QueryObject {
    return {
      type: QueryObjectType.ID,
      value: id,
      children: []
    };
  }
  public static RELATIONSHIP(type: string, param?: ComponentKeyType | QueryObject): QueryObject {
    return {
      type: QueryObjectType.RELATIONSHIP,
      children: param ? [param] : [],
      value: type
    };
  }
}
