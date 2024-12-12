import { ECSWorldInternals } from "../db";
import { CachedQuery } from "./CachedQuery";
import { QueryManager } from "./QueryManager";
import { QueryObject } from "./type/Query.type";

export class CachedQueryManager {
  private readonly cachedQueries: CachedQuery[] = [];
  constructor(
    private readonly internals: ECSWorldInternals,
    private readonly queryManager: QueryManager
  ) {}

  public generateCachedQuery(queryObject: QueryObject): CachedQuery {
    const toRet = new CachedQuery(this.internals, this.queryManager, queryObject);
    this.cachedQueries.push(toRet);
    toRet.startListening();
    return toRet;
  }

  public clearCachedQueries() {
    for (const c of this.cachedQueries) {
      c.stopListening();
    }

    this.cachedQueries.splice(0, this.cachedQueries.length);
  }
}
