import { Entity } from "../Entity";
import { ECSDB } from "../db/ECSDB";
import { World } from "../World";
import { AddEntityInput, EntityManager } from "./EntityManager";

/**
 * @TODO how do I handle setting entity relationships outside of this TransactionalEntityManager during the transaction?
 */

/**
 * Provides functions to access data in the ECS DB to the rest of the engine
 */
export class TransactionalEntityManager extends EntityManager {
  // Entities deleted during the transaction
  private deletedEntityUuids: string[] = [];
  private createdEntityUuids: string[] = [];
  private open: boolean = true;

  constructor(ecsDB: ECSDB, world: World) {
    super(ecsDB, world);
  }

  public getAllEntities(): Entity[] {
    const entities = super.getAllEntities();
    return entities.filter(ref => !(ref.id in this.deletedEntityUuids));
  }

  public getEntityByID(uuid: string): Entity | null {
    const ref = super.getEntityByID(uuid);
    if (ref && ref.id in this.deletedEntityUuids) {
      return null;
    }
    return ref;
  }

  public hasEntity(uuid: string): boolean {
    return !!this.getEntityByID(uuid);
  }

  /**
   * Create a SINGLE new entity
   * @param input data to generate entity from
   */
  public createEntity(input: AddEntityInput = {}): Entity {
    if (!this.open) throw new Error('Transaction is closed');
    const entity = this.ecsdb.addEntity({
      ...input,
      temp: true,
    });
    this.createdEntityUuids.push(entity.id);
    return entity;
  }

  public deleteEntity(uuid: string): boolean {
    if (!this.open) throw new Error('Transaction is closed');
    const ref = this.getEntityByID(uuid);
    if (ref) {
      this.deletedEntityUuids.push(ref.id);
      return true;
    } else {
      return false;
    }
  }

  public commit() {
    if (!this.open) throw new Error('Transaction is closed');
    // @TODO set all temp entities to be permanent
    for (const uuid of this.createdEntityUuids) {
      const archetype = this.ecsdb.getArchetypeForEntityUuid(uuid);
      archetype.setEntityTemp(uuid, false);
    }
    // @TODO delete all destroyed entities
    for (const uuid of this.deletedEntityUuids) {
      const archetype = this.ecsdb.getArchetypeForEntityUuid(uuid);
      archetype.removeEntity(uuid);
    }
    this.open = false;
  }

  public rollback() {
    if (!this.open) throw new Error('Transaction is closed');
    // @TODO remove
    for (const uuid of this.createdEntityUuids) {
      const archetype = this.ecsdb.getArchetypeForEntityUuid(uuid);
      archetype.removeEntity(uuid);
    }
    this.open = false;
  }
}
