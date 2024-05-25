/**
 * Implements the Query Manager base class for querying Entities and Components on the ECSDB
 */

// import { Component } from "../Component";
import { Entity } from "../Entity";
import { ECSDB } from "../db/ECSDB";
import { Query } from "../query";
import { Manager } from "./Manager";
import { World } from "../World";
import { ComponentKeyType } from "../type/ComponentKey.type";
import { Archetype } from "../db/Archetype";

export class QueryManager extends Manager {
  constructor(ecsDB: ECSDB, world: World) {
    super(ecsDB, world);
  }

  /**
   * Query the ECSDB based on components
   * @param query Query to run
   * @returns Matching Entities
   */
  public query(query: Query): Entity[] {

    // const entities = this.getEntities(query.terms);

    // @TODO when conditions are implemented in Querying, revisit this to correctly handle that

    // return entities;
    // @TODO temp
    return [];
  };

  /**
   * Cache the results of a query so that performance is better
   * @param query 
   */
  public cacheQuery(query: Query): void {


  }

  private getEntities(terms: ComponentKeyType[]): Entity[] {
    // @TODO implement once components are properly implemented
    // return [];
    // const archetypes = this.ecsdb.getArchetypes();
    // const matchedArchetypes: Archetype[] = [];
    // for (const archetype of archetypes) {
    //   const types = archetype.getComponentKeys();
    //   if (this.compareTypes(terms, types)) {
    //     matchedArchetypes.push(archetype);
    //   }
    // }

    // // @TODO make this more efficient
    // for (const archetype of matchedArchetypes) {
    //   for (let i = 0; i < archetype.)
    // }
    
    // @TODO temp
    return [];
  }

  private compareTypes(typeA: ComponentKeyType[], typeB: ComponentKeyType[]): boolean {
    const map = new Map();
    typeA.map(type => map.set(type, true));
    return typeB.every(type => map.get(type) === true);
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
