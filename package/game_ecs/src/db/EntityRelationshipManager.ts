import { v4 as uuidv4 } from "uuid";
import { EntityRelationship } from "./EntityRelationship";

export class EntityRelationshipManager {
  public readonly relationshipsById: Map<string, EntityRelationship> = new Map();
  // Map Types below are Entity ID to Relationship ID
  public readonly relationshipsByEntityA: Map<string, string[]> = new Map();
  public readonly relationshipsByEntityB: Map<string, string[]> = new Map();

  /**
   * Create a relation between 2 entities
   * @param entityAId ID of Entity A
   * @param entityBId ID of Entity B
   * @param type relationship type
   */
  public relationCreate(entityAId: string, entityBId: string, type: string): EntityRelationship {
    if (this.relationHas(entityAId, entityBId, type)) {
      throw new Error("A relationship of this type between these entities already exists!");
    }

    const id = uuidv4();
    const ref = new EntityRelationship(id, type, entityAId, entityBId);
    this.relationshipsById.set(id, ref);

    // Update the entity relationship arrays
    let entityAArr = this.relationshipsByEntityA.get(entityAId);
    if (!entityAArr) {
      entityAArr = [];
      this.relationshipsByEntityA.set(entityAId, entityAArr);
    }
    entityAArr.push(id);

    let entityBArr = this.relationshipsByEntityB.get(entityBId);
    if (!entityBArr) {
      entityBArr = [];
      this.relationshipsByEntityB.set(entityBId, entityBArr);
    }
    entityBArr.push(id);

    return ref;
  }

  /**
   * Check if there is a relationship of a given type between 2 entities
   * @param entityAId ID of Entity A
   * @param entityBId ID of Entity B
   * @param type relationship type
   */
  public relationHas(entityAId: string, entityBId: string, type: string): boolean {
    const relationshipIds = this.relationshipsByEntityA.get(entityAId);

    if (relationshipIds === undefined) return false;

    const foundRelationship = relationshipIds.map(relId => this.relationshipsById.get(relId)).find(rel => rel && rel.entityBId === entityBId && rel.type === type);

    return !!foundRelationship;
  }

  /**
   * Get relationships from an entity
   * @param entityAId ID of Entity A
   * @param entityBId ID of Entity B to check for a relationship with
   * @param type relationship type to check for
   */
  public relationGet(entityAId: string, entityBId?: string, type?: string): EntityRelationship[] {
    const relationshipIds = this.relationshipsByEntityA.get(entityAId);

    if (relationshipIds === undefined) return [];

    const foundRelationships = relationshipIds.map(relId => this.relationshipsById.get(relId)).filter(rel => rel && (entityBId ? rel.entityBId === entityBId : true) && (type ? rel.type === type : true)) as EntityRelationship[];

    return foundRelationships;
  }

  /**
   * Check if there is a relationship of a given type between 2 entities
   * @param entityAId ID of Entity A
   * @param entityBId ID of Entity B
   * @param type relationship type
   */
  public relationDelete(entityAId: string, entityBId: string, type: string) {
    const refArr = this.relationGet(entityAId, entityBId, type);

    if (refArr.length === 0) {
      throw new Error("A relationship of this type between these entities doesn't exist!");
    }

    const ref = refArr[0];

    this.relationshipsById.delete(ref.id);

    const entityA = this.relationshipsByEntityA.get(entityAId);
    if (entityA) {
      const idxA = entityA.indexOf(ref.id);
      if (idxA > 0) entityA.splice(idxA, 1);
    }

    const entityB = this.relationshipsByEntityB.get(entityBId);
    if (entityB) {
      const idxB = entityB.indexOf(ref.id);
      if (idxB > 0) entityB.splice(idxB, 1);
    }
  }

  /**
   * Removes an entity from the relationship graph
   * @param entityId Entity ID
   */
  public entityDelete(entityId: string) {
    const a = this.relationshipsByEntityA.get(entityId);
    const b = this.relationshipsByEntityB.get(entityId);

    const relationshipIds = [];

    if (a) {
      relationshipIds.push(...a);
      this.relationshipsByEntityA.delete(entityId)
    }

    if (b) {
      relationshipIds.push(...b);
      this.relationshipsByEntityB.delete(entityId)
    }

    for (const relId of relationshipIds) {
      const rel = this.relationshipsById.get(relId);

      if (!rel) {
        // Something is wrong if we get here
        console.warn(`Entity Relationships might be out of sync. Entity relationship is missing for id ${relId} for entity ${entityId}`);
        continue;
      }

      // Remove the relationship from the entity id arrays as well as the relationship map
      this.relationshipsById.delete(relId);

      const entityA = this.relationshipsByEntityA.get(rel.entityAId);
      if (entityA) {
        const idxA = entityA.indexOf(relId);
        if (idxA > 0) entityA.splice(idxA, 1);
      } else {
        // Something is wrong if we get here
        console.warn(`Entity Relationships might be out of sync. Entity A ${rel.entityAId} isn't in the relationship map`)
      }

      const entityB = this.relationshipsByEntityB.get(rel.entityBId);
      if (entityB) {
        const idxB = entityB.indexOf(relId);
        if (idxB > 0) entityB.splice(idxB, 1);
      } else {
        // Something is wrong if we get here
        console.warn(`Entity Relationships might be out of sync. Entity B ${rel.entityBId} isn't in the relationship map`)
      }
    }
  }
}
