/**
 * Implements the Query Manager for the World
 * @TODO move to separate package due to alasql dependencies
 */

import { QueryManager, QueryResults } from "./QueryManager";
// import * as alasql from "alasql";
import { ECSDB } from "./ECSDB";
import { Component, Entity } from "../../baseClasses";

export class QueryManagerSQL extends QueryManager {
  constructor(ecsDB: ECSDB) {
    super(ecsDB);
  }

  public query(query: string): Promise<QueryResults> {
    const entities: Entity[] = Array.from(this.ecsDB.entityMap.values());
    const components: Component[] = Array.from(
      this.ecsDB.componentMap.values(),
    );

    // alasql.
    return Promise.resolve([]);
  }
}
