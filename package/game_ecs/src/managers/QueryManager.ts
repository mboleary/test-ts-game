/**
 * Implements the Query Manager base class for querying Entities and Components on the ECSDB
 */

// import { Component } from "../Component";
import { Entity } from "../Entity";
import { ECSDB } from "../db/ECSDB";
import { Query } from "../query";
import { Manager } from "./Manager";

export class QueryManager implements Manager {
  constructor(protected readonly ecsDB: ECSDB) {}

  /**
   * Query the ECSDB based on components
   * @param query Query to run
   * @returns Matching Entities
   */
  public query(query: Query): Entity[] {

    const entities = this.getEntities(query.requiredTerms, query.optionalTerms);

    // @TODO when conditions are implemented in Querying, revisit this to correctly handle that

    return entities;
  };

  /**
   * Cache the results of a query so that performance is better
   * @param query 
   */
  public cacheQuery(query: Query): void {


  }

  private getEntities(requiredComponents: Symbol[], optionalComponents: Symbol[]): Entity[] {
    // @TODO implement once components are properly implemented
    return [];
  }

  // /**
  //  * Return matching entities to query
  //  * @param entities 
  //  * @param query 
  //  */
  // private checkEntitiesToQuery(entities: Entity[], query: Query): Entity[] {
  //   for (const entity of entities) {
  //     const components = []; //@TODO get all components using ECSDB
  //     for (const condition of query.conditions) {
  //       for (const term of condition.requiredTerms) {
  //         const component = entity.getComponent(term);
  //         const result = condition.validate(component);
  //       }
  //     }
  //   }
  //   return [];
  // }
}
