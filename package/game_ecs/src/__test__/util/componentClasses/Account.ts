export class Account {
  constructor(
    chance: Chance.Chance,
    public avatar: string = chance.avatar(),
    public email: string = chance.email()
  ) {
  }
}
