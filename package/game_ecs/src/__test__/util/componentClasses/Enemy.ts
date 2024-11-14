export class Enemy {
  constructor(
    chance: Chance.Chance,
    public name = chance.name(),  // Random enemy name
    public level = chance.integer({ min: 1, max: 50 }),  // Random enemy level between 1 and 50
    public health = chance.integer({ min: 50, max: 200 }),  // Random health between 50 and 200
    public attack = chance.integer({ min: 10, max: 50 }),  // Random attack power
    public defense = chance.integer({ min: 5, max: 30 }),  // Random defense power
  ) {
    
  }

  toString() {
    return `${this.name}, Level: ${this.level}, Health: ${this.health}, Attack: ${this.attack}, Defense: ${this.defense}`;
  }
}
