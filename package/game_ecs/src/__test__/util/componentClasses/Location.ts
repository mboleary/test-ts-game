import { Chance } from "chance";

export class Location {
  constructor(
    chance: Chance.Chance,
    public address1: string = chance.address(),
    public address2: string = '',
    public city: string = chance.city(),
    public state: string = chance.state(),
    public country: string = 'USA',
    public coordinates: number[] = chance.coordinates().split(" ").map(s => parseFloat(s))
  ) {}
}
