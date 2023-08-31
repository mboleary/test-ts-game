/**
 * Implements the Query Manager base class for querying Entities and Components on the ECSDB
 */

import { Component } from "./Component";
import { Entity } from "./Entity";
import { ECSDB } from "./db/ECSDB";

export type QueryResults = (Entity | Component)[];

export abstract class QueryManager {
  constructor(protected readonly ecsDB: ECSDB) {}

  public abstract query(query: string): Promise<QueryResults>;
}
