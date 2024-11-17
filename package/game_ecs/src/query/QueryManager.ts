import { ECSWorldInternals } from "../db";
import { Entity } from "../Entity";
import { ComponentKeyType } from "../type/ComponentKey.type";
import { isComponentKeyType } from "./queryUtil";
import { EntityMappingValues, QueryObject, QueryObjectType, QueryPipelineFilter } from "./type/Query.type";

export class QueryManager {
  constructor(private readonly internals: ECSWorldInternals) {}

  public runQuery(queryObject: QueryObject): Entity[] {
    // Dig through the query object

    console.log("query object", JSON.stringify(queryObject, null, 4));

    return Array.from(this.internals.entityMap.entries())
      .filter(this.processQueryObject(queryObject))
      .map(ekv => this.internals.entityReferenceMap.get(ekv[0]))
      .filter(e => !!e) as Entity[];
  }

  private subQuery(queryObject: QueryObject | ComponentKeyType): string[] {
    if (isComponentKeyType(queryObject)) {
      // Just look for component keys
      return Array.from(this.internals.entityMap.entries())
        .filter(ekv => ekv[1].includes(queryObject as ComponentKeyType)).map(ekv => ekv[0]);
    } else {
      // Run sub-queries
      return Array.from(this.internals.entityMap.entries())
        .filter(this.processQueryObject(queryObject as QueryObject)).map(ekv => ekv[0]);
    }
  }

  private processQueryObject(queryObject: QueryObject): QueryPipelineFilter {
    switch (queryObject.type) {
      case QueryObjectType.AND:
        return (e: EntityMappingValues) => queryObject.children.every(c => {
          if (isComponentKeyType(c)) {
            // Component Key
            return e[1].includes(c as ComponentKeyType);
          } else {
            // Subquery object
            const f = this.processQueryObject(c as QueryObject);
            return f(e);
          }
        });
      case QueryObjectType.OR:
        return (e: EntityMappingValues) => queryObject.children.some(c => {
          if (isComponentKeyType(c)) {
            // Component Key
            return e[1].includes(c as ComponentKeyType);
          } else {
            // Subquery object
            const f = this.processQueryObject(c as QueryObject);
            return f(e);
          }
        });

      // Singleton Query Object Types
      case QueryObjectType.NOT:
        return (e: EntityMappingValues) => {
          // This type of queryobject should only have one child
          const c = queryObject.children[0];
          if (isComponentKeyType(c)) {
            // Component Key
            return !e[1].includes(c as ComponentKeyType);
          } else {
            // Subquery object
            const f = this.processQueryObject(c as QueryObject);
            return !f(e);
          }
        };

      case QueryObjectType.ID:
        return (e: EntityMappingValues) => e[0] === queryObject.value;
        
      case QueryObjectType.RELATIONSHIP:
        return (e: EntityMappingValues) => {
          // Check QueryObject type
          if (queryObject.children.length === 0) {
            // Check for an entity that has a relationship
            return this.internals.relationshipManager.relationHas(
              e[0],
              queryObject.value as string
            );
          }
          const c = queryObject.children[0];
          if (typeof c === 'object' && (c as QueryObject).type === QueryObjectType.ID) {
            // We can directly check for the relationship
            return this.internals.relationshipManager.relationHas(
              e[0],
              queryObject.value as string,
              // This is an ID QueryObject
              (c as QueryObject).value as string
            );
          } else {
            // Run subquery, since we need all of the results from it to accurately check the relationships
            // @TODO this is hilariously inefficient, as it runs this every iteration. Fix it
            const subqueryIds = this.subQuery(c);
            console.log("subquery ids", subqueryIds);
            return subqueryIds.some(id => this.internals.relationshipManager.relationHas(e[0], queryObject.value as string, id));
          }
        };
      default:
        return () => false;
    };
  }
}
