import { Entity } from "../../baseClasses/Entity";
import { ECSDB, EntityRelationshipType } from "./ECSDB";
import { v4 as uuidv4} from "uuid";

/**
 * Provides functions to access data in the ECS DB to the rest of the engine
 */
export class EntityManager {
    constructor(
        private readonly ecsDB: ECSDB
    ) {}

    public getEntityByID(uuid: string) {
        return this.ecsDB.entityMap.get(uuid) || null;
    }

    public hasEntity(uuid: string) {
        return this.ecsDB.entityMap.has(uuid);
    }

    public createEntity(rawEntityData: Partial<Omit<Entity, "id">> = {}) {
        const uuid = uuidv4();
        const entity = new Entity(
            uuid,
            rawEntityData.name || ""
        );

        Object.seal(entity);
        this.ecsDB.entityMap.set(uuid, entity);

        if (rawEntityData.tags) {
            for (const tag of rawEntityData.tags) {
                this.ecsDB.entityToTagMap.set(uuid, tag);
            }
        }

        if (rawEntityData.parent) {
            // this.ecsDB.entityToEntityMap.set(uuid, [rawEntityData.parent.id, "parent"]);
            // this.ecsDB.entityToEntityMap.set(rawEntityData.parent.id, [uuid, "child"]);
            this.updateEntityToEntityRelation(uuid, rawEntityData.parent.id, "parent");
            this.updateEntityToEntityRelation(rawEntityData.parent.id, uuid, "child");
        }

        if (rawEntityData.children) {
            for (const child of rawEntityData.children) {
                // this.ecsDB.entityToEntityMap.set(uuid, [child.id, "child"]);
                // this.ecsDB.entityToEntityMap.set(child.id, [uuid, "parent"]);
                this.updateEntityToEntityRelation(uuid, child.id, "child");
                this.updateEntityToEntityRelation(child.id, uuid, "parent");
            }
        }
    }

    /**
     * Updates relationship between Entity A and Entity B (is NOT reflexive!)
     * @param ida Entity A ID
     * @param idb Entity B ID
     * @param type Relation Type
     */
    private updateEntityToEntityRelation(ida: string, idb: string, type: EntityRelationshipType) {
        let entityARelation = this.ecsDB.entityToEntityMap.get(ida);
        if (entityARelation) {
            const existingRelationToUpdate = entityARelation.find((val) => val.id === idb);
            if (existingRelationToUpdate) {
                existingRelationToUpdate.type = type;
            } else {
                entityARelation.push({id: idb, type});
            }
        } else {
            entityARelation = [];
            entityARelation.push({id: idb, type});
            this.ecsDB.entityToEntityMap.set(ida, entityARelation);
        }
    }

    private removeEntityToEntityRelation(ida: string, idb: string) {
        let entityARelation = this.ecsDB.entityToEntityMap.get(ida);
        if (!entityARelation) return;

        const uuids = [];

        for (const rel of entityARelation) {
            uuids.push(rel.id);
        }

        // Remove inverse relationship
        for (const uuid of uuids) {
            const rel = this.ecsDB.entityToEntityMap.get(uuid);
            if (!rel) continue;

            // 2TODO finish
        }
    }

    public deleteEntity(uuid: string): boolean {
        const baseEntity = this.ecsDB.entityMap.get(uuid);

        if (!baseEntity) return false;


    }
}