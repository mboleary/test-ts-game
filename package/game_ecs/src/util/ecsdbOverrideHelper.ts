import { ECSDB } from "../db";

export function mergeECSDB(fromECSDB: ECSDB, toECSDB: ECSDB) {
  toECSDB.entityDB.mergeEntityDB(fromECSDB);
  toECSDB.componentDB.mergeComponentDB(fromECSDB);
}
