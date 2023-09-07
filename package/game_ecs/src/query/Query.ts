/**
 * Class that contains the query being run or cached
 */

// import { Condition } from "./Condition";

export class Query {
    constructor(
        input: (Query | Symbol)[]
    ) {
        for (const item of input) {
            if (typeof item === "symbol") {
                this.requiredTerms.push(item);
            } else if (item instanceof Query) {
                this.requiredTerms.push(...item.requiredTerms);
                this.optionalTerms.push(...item.optionalTerms);
                // this.conditions.push(...item.conditions);
            }
        }
    }

    public requiredTerms: Symbol[] = [];
    public optionalTerms: Symbol[] = [];
    // public conditions: Condition[] = [];
}