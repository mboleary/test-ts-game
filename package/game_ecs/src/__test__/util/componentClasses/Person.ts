import { Chance } from "chance";

export class Person {
  constructor(
    chance: Chance.Chance,
    public names: string = chance.name(),
    public age: number = chance.age(),
    public birthday: Date = chance.birthday(),
    public gender: string = chance.gender()
  ) {}
}
