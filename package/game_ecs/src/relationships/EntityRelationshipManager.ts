import { v4 as uuidv4 } from "uuid";
import { EntityRelationship } from "./EntityRelationship";
import { ECSWorldInternals } from "../db";
import { ENTITY_DELETE_EVENT_TYPE, EntityDeleteEvent } from "../db/events/EntityDelete.event";
import { RelationshipCreateEvent } from "./events/RelationshipCreate.event";
import { RelationshipDeleteEvent } from "./events/RelationshipDelete.event";

export class EntityRelationshipManager {
  public readonly relationshipsById: Map<string, EntityRelationship> = new Map();
  // Map Types below are Entity ID to Relationship ID
  public readonly relationshipsByEntityA: Map<string, string[]> = new Map();
  public readonly relationshipsByEntityB: Map<string, string[]> = new Map();

  constructor(
    private readonly internals: ECSWorldInternals,
  ) {
    // Need to keep in sync with ECS World DB
    internals.subscribe(ENTITY_DELETE_EVENT_TYPE, (e: EntityDeleteEvent) => {
      this.entityDelete(e.target.id);
    });
  }

  /**
   * Create a relation between 2 entities
   * @param entityAId ID of Entity A
   * @param entityBId ID of Entity B
   * @param type relationship type
   */
  public relationCreate(entityAId: string, entityBId: string, type: string): EntityRelationship {
    if (this.relationHas(entityAId, type, entityBId)) {
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

    const evt = new RelationshipCreateEvent(entityAId, entityBId, type);
    this.internals.emit(evt.type, evt);

    return ref;
  }

  /**
   * Check if there is a relationship of a given type between 2 entities
   * @param entityAId ID of Entity A
   * @param type relationship type
   * @param entityBId ID of Entity B
   */
  public relationHas(entityAId: string, type: string, entityBId?: string): boolean {
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

    const evt = new RelationshipDeleteEvent(entityAId, entityBId, type);
    this.internals.emit(evt.type, evt);
  }

  /* Event Handlers */

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

  /* Misc */

  /**
   * Merges relationships from another relationshipManager into this one
   * @param targetRelationshipManager Relationship Manager to pull relationships from
   */
  public merge(targetRelationshipManager: EntityRelationshipManager) {
    // Relationships
    const addedRelationships = [];
    for (const [relationshipId, relationship] of targetRelationshipManager.relationshipsById) {
      // Skip pre-existing relationships (either by id or by name)
      if (!(this.relationshipsById.has(relationshipId) && this.relationHas(relationship.entityAId, relationship.type, relationship.entityBId))) {
        addedRelationships.push(relationship);
        this.relationshipsById.set(relationshipId, relationship);
      }
    }

    for (const relationship of addedRelationships) {
      // Entity A to Relationships
      let entityAArr = this.relationshipsByEntityA.get(relationship.entityAId);
      if (!entityAArr) {
        entityAArr = [];
        this.relationshipsByEntityA.set(relationship.entityAId, entityAArr);
      }
      entityAArr.push(relationship.id);

      // Entity B to Relationships
      let entityBArr = this.relationshipsByEntityB.get(relationship.entityBId);
      if (!entityBArr) {
        entityBArr = [];
        this.relationshipsByEntityB.set(relationship.entityBId, entityBArr);
      }
      entityBArr.push(relationship.id);
    }
  }

  public clear() {
    // @TODO
  }
}
