/**
 * Class that contains the query being run or cached
 */

import { ComponentKeyType } from "../type/ComponentKey.type";

// import { Condition } from "./Condition";

export class Query {
  constructor(
    input: ComponentKeyType[]
  ) {
    for (const item of input) {
      if (typeof item === "symbol") {
        this.terms.push(item);
      }
    }
  }

  public terms: Symbol[] = [];
  public children: Query[] = [];
}
