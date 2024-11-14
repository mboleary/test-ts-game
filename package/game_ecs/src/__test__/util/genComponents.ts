import { Account } from "./componentClasses/Account";
import { Enemy } from "./componentClasses/Enemy";
import { Inventory } from "./componentClasses/Inventory";
import { Item } from "./componentClasses/Item";
import { Location } from "./componentClasses/Location";
import { Person } from "./componentClasses/Person";
import { Player } from "./componentClasses/Player";
import { Quest } from "./componentClasses/Quest";

const ITEM_ARCHETYPE = [Item];
const ENEMY_NPC_ARCHETYPE = [Enemy, Inventory];
const NPC_ARCHETYPE = [Inventory, Player, Quest];
const PC_ARCHETYPE = [Account, Inventory, Location, Person, Player, Quest];

export function genComponents(chance: Chance.Chance): any[] {
  const amount = chance.integer({ min: 1, max: 6 });
  let classes;

  if (amount < ITEM_ARCHETYPE.length) {
    classes = ITEM_ARCHETYPE;
  } else if (amount < ENEMY_NPC_ARCHETYPE.length) {
    classes = ENEMY_NPC_ARCHETYPE;
  } else if (amount < NPC_ARCHETYPE.length) {
    classes = NPC_ARCHETYPE;
  } else {
    classes = PC_ARCHETYPE;
  }

  return chance.pickset([...classes], amount).map(c => ({key: c, value: new c(chance)}));
}
