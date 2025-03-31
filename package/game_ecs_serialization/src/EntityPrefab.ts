import { ComponentAndKey, Entity, World } from "game_ecs";
import { Prefab, PrefabComponentType } from "./Prefab.type";
import { ComponentBuilder } from "./ComponentBuilder";

export class EntityPrefab {
  constructor(
    private readonly world: World,
    private readonly componentBuilder: ComponentBuilder,
    // @TODO add component type definition (with component key)
  ) {}

  public hydratePrefab(prefab: Prefab): Entity[] {
    const createdEntities: Entity[] = [];
    for (const entityDef of prefab.entities) {
      const componentAndKeyArray: ComponentAndKey[] = [];
      for (const componentDef of entityDef.components) {
        const component = this.componentBuilder.buildComponent(componentDef);
        componentAndKeyArray.push({
          key: componentDef.key,
          value: component
        });
      }

      // @TODO add some metadata about the prefab to the entity

      const entity = this.world.createEntity(entityDef.id, componentAndKeyArray);
      createdEntities.push(entity);
    }

    return createdEntities;
  }

  public createPrefab(entities: Entity[]): Prefab {
    for (const entity of entities) {
      const componentDefs: PrefabComponentType[] = [];

      for (const componentKey of entity.components) {
        // @TODO get component type from key/type pair definition
      }

      const entityDef = {
        id: entity.id,

      };
    }
  }
}