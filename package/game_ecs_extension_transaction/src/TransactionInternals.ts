import { ComponentAndKey, ECSWorldInternals } from "../../db";
import { Entity } from "../../Entity";
import { ComponentKeyType, EntityIdType } from "../../type/types";
import { TransactionEntity } from "./TransactionEntity";

export class TransactionInternals implements Partial<ECSWorldInternals> {
    public readonly deletedEntityIds: Set<EntityIdType> = new Set();
    public readonly alteredComponentsByEntityId: Map<EntityIdType, Map<ComponentKeyType, any>> = new Map();
    public readonly deletedRelationshipIds: Set<string> = new Set();

    public readonly transactionEntityRefMap: Map<EntityIdType, TransactionEntity> = new Map();

    constructor(
        private readonly transactionWorldInternals: ECSWorldInternals,
        private readonly targetWorldInternals: ECSWorldInternals,
    ) {}

    public entityCreate(id: string, components: ComponentAndKey[]): Entity {
        if (this.targetWorldInternals.entityMap.has(id)) {
            throw new Error(`Entity ${id} already exists in target world!`);
        }
        return this.transactionWorldInternals.entityCreate(id, components);
    }

    public entityGet(id: string): Entity | undefined {
        if (this.deletedEntityIds.has(id)) {
            return undefined;
        }

        if (this.transactionEntityRefMap.has(id)) {
            return this.transactionEntityRefMap.get(id) as Entity | undefined;
        }

        // Generate new Transaction Entity

        if (!(this.transactionWorldInternals.entityMap.has(id) && this.targetWorldInternals.entityMap.has(id))) {
            return undefined;
        }

        const toRet = new TransactionEntity(this, this.transactionWorldInternals, this.targetWorldInternals, id);
        this.transactionEntityRefMap.set(id, toRet);
        return toRet as Entity;
    }

    public entityDelete(entityId: EntityIdType) {
        // If Entity exists in txn world internals, just delete it
        if (this.transactionWorldInternals.entityMap.has(entityId)) {
            this.transactionWorldInternals.entityDelete(entityId);
        }

        // If Entity exists in target world internals, add it to the ad array
        if (this.targetWorldInternals.entityMap.has(entityId)) {
            this.deletedEntityIds.add(entityId);
        }

        if (this.transactionEntityRefMap.has(entityId)) {
            this.transactionEntityRefMap.delete(entityId);
        }
    }

    public entitySetComponent(entityId: EntityIdType, key: ComponentKeyType, value: any) {
        this.transactionWorldInternals.entitySetComponent(entityId, key, value);
    }

    /**
     * Use for updating a value from a Proxy
     * @TODO update this
     * @param entityId 
     * @param key 
     * @param value 
     * @param propertyPath 
     */
    public entityUpdateComponent(entityId: EntityIdType, key: ComponentKeyType, value: any, propertyPath: string[]) {}

    public entityUnsetComponent(entityId: EntityIdType, key: ComponentKeyType) {
        if (!this.targetWorldInternals.entityComp)
    }

    public entityGetComponent(id: string, key: ComponentKeyType) {
        
    }

    public entityGetComponentKeys(id: string): ComponentKeyType[] {
        
    }

    public relationshipDelete(relationshipId: string) {}
}