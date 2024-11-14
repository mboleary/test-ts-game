export class Player {
  constructor(
    chance: Chance.Chance,
    public name: string = chance.name(),  // Random name
    public level: number = chance.integer({ min: 1, max: 50 }),  // Random level between 1 and 50
    public health: number = chance.integer({ min: 1, max: 100 }),  // Random health between 1 and 100
    public mana: number = chance.integer({ min: 0, max: 100 }),  // Random mana between 0 and 100
    public experience: number = chance.integer({ min: 0, max: 1000 }),  // Random experience points
  ) {
  }

  toString() {
    return `${this.name}, Level: ${this.level}, Health: ${this.health}, Mana: ${this.mana}, Experience: ${this.experience}`;
  }
}
