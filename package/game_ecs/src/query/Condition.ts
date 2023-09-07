// import { Query } from "./Query";

// export type ConditionOptions = {
//     termsAreOptional?: boolean
// };

// export class Condition extends Query {
//     private _internalConditions: Condition[];
//     constructor(
//         input: (Query | Symbol)[],
//         private readonly validationCallback: ConditionCallbackFunction,
//         { termsAreOptional }: ConditionOptions = {},
//     ) {
//         super(input);
//         // override conditions so that we only check what we need to
//         this._internalConditions = this.conditions;
//         this.conditions = [this];
//         if (termsAreOptional) {
//             this.optionalTerms = this.requiredTerms;
//             this.requiredTerms = [];
//         }
//     }

//     public validate(component: any): boolean {
//         return this.validationCallback(component, this._internalConditions) || false;
//     }
// }

// export type ConditionCallbackFunction = (component: any, conditions: Condition[]) => boolean;

// /**
//  * These functions return conditions for use when building a query
//  */

// export function Not(input: (Query | Symbol)): Condition {
//     return new Condition([input], (component: any, conditions: Condition[]): boolean => {
//         if (component) {
//             return !!component;
//         }
//         if (conditions && conditions[0]) {
//             return conditions[0].validate(component);
//         }
//         return false;
//     });
// }
// export function And(input: (Query | Symbol)[]): Condition {
//     return new Condition(input, (component: any, conditions: Condition[]): boolean => {
//         for (const condition of conditions) {
//             const ret = condition.validate(component);
//             if (!ret) return false;
//         }
//         if (component) {
//             return !!component;
//         }
//         return true;
//     });
// }
// export function Or(input: (Query | Symbol)[]): Condition {
//     return new Condition(input, (component: any, conditions: Condition[]): boolean => {
//         for (const condition of conditions) {
//             const ret = condition.validate(component);
//             if (ret) return true;
//         }
//         if (component) {
//             return !!component;
//         }
//         return false;
//     }, { termsAreOptional: true });
// }
// export function Equal(input: (Query | Symbol), value: any): Condition {
//     return new Condition([input], (component: any): boolean => {
//         if (component) {
//             return component === value;
//         }
//         return false;
//     });
// }
// export function GreaterThan(input: (Query | Symbol), value: number): Condition {
//     return new Condition([input], (component: any): boolean => {
//         if (component) {
//             return component > value;
//         }
//         return false;
//     });
// }
// export function GreaterEqualThan(input: (Query | Symbol), value: number): Condition {
//     return new Condition([input], (component: any): boolean => {
//         if (component) {
//             return component >= value;
//         }
//         return false;
//     });
// }
// export function LessThan(input: (Query | Symbol), value: number): Condition {
//     return new Condition([input], (component: any): boolean => {
//         if (component) {
//             return component < value;
//         }
//         return false;
//     });
// }
// export function LessEqualThan(input: (Query | Symbol), value: number): Condition {
//     return new Condition([input], (component: any): boolean => {
//         if (component) {
//             return component <= value;
//         }
//         return false;
//     });
// }