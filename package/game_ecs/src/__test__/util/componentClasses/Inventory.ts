import { Chance } from "chance";
import { Item } from "./Item";

export class Inventory {
  constructor(
    chance: Chance.Chance,
    private readonly _items: Item[] = []
  ) {
    if (_items.length === 0) {
      for(let i = 0; i < chance.integer({max: 20}); i++) {
        _items.push(new Item(chance));
      }
    }
  }

  addItem(item: Item) {
    this._items.push(item);
  }

  public get items() {
    return this._items;
  }
}
