export class Item {
  constructor(
    chance: Chance.Chance,
    public name: string = chance.word(),  // Random item name
    public type: string = chance.pickone(['Weapon', 'Armor', 'Potion', 'Shield']),  // Random item type
    public damage: number = type === 'Weapon' ? chance.integer({ min: 5, max: 50 }) : 0,  // Random damage for weapons
    public defense: number = type === 'Armor' ? chance.integer({ min: 1, max: 30 }) : 0,  // Random defense for armor
    public healing: number = type === 'Potion' ? chance.integer({ min: 10, max: 50 }) : 0,  // Healing for potions
    public durability: number = chance.integer({ min: 1, max: 100 }),  // Durability (used for items like weapons, armor, etc.)
  ) {
  }

  toString() {
    return `${this.name} (${this.type}) - Damage: ${this.damage}, Defense: ${this.defense}, Healing: ${this.healing}, Durability: ${this.durability}`;
  }
}
