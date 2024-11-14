// import { System } from "../System";
// import { World } from "../World";

// export class SystemManager{
//   private systems: Map<string, System> = new Map();
//   constructor(
//     private readonly world: World
//   ) {
//   }

//   public add(systems: System[]) {
//     for (const system of systems) {
//       this.enrollSystem(system);
//     }
//   }

//   private enrollSystem(system: System) {
//     this.systems.set(system.id, system);
//   }

//   public getSystems() {
//     return Array.from(this.systems.values());
//   }
// }
