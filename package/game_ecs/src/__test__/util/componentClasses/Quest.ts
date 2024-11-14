export class Quest {
  constructor(
    chance: Chance.Chance,
    public name = chance.sentence({ words: 3 }),  // Random quest name (sentence)
    public type = chance.pickone(['Fetch', 'Kill', 'Explore', 'Puzzle']),  // Random quest type
    public reward = chance.integer({ min: 100, max: 1000 }),  // Random reward points
    public difficulty = chance.pickone(['Easy', 'Medium', 'Hard']),  // Random difficulty level
  ) {
    
  }

  toString() {
    return `${this.name} (Type: ${this.type}) - Reward: ${this.reward} points, Difficulty: ${this.difficulty}`;
  }
}
