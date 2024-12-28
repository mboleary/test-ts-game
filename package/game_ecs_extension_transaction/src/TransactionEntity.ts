import { ECSWorldInternals } from "game_ecs";
import { Entity } from "game_ecs";
import { ComponentKeyType, EntityIdType } from "game_ecs";
import { TransactionInternals } from "./TransactionInternals";

/**
 * For Transaction Entities, they are pulling data from both the transactional world and the underlying target world.
 * 
 * The data for the Entity needs to be pulled from both internals objects and carefully combined to form the final Entity.
 * 
 */
export class TransactionEntity extends Entity {

    static fromEntity(entity: Entity, transactionInternals, transactionWorldInternals) {
        return new TransactionEntity()
    }
    
    constructor(
        private readonly transactionInternals: TransactionInternals,
        private readonly transactionWorldInternals: ECSWorldInternals,
        internals: ECSWorldInternals,
        id: EntityIdType
    ) {
        super(internals, id);
    }

    get components(): ComponentKeyType[] {
        
    }

    public setComponent<T>(key: ComponentKeyType, componentData: T): void {
        this.transactionWorldInternals.entitySetComponent(this.id, key, componentData);
    }

    public unsetComponent(key: ComponentKeyType): void {
        this.transactionInternals
    }

    public getComponent<T>(type: ComponentKeyType): T | null {
        
    }

    public getComponentWithoutProxy<T>(type: ComponentKeyType): T | null {
        
    }

    // public get relationships() {}

    public addRelation(entity: Entity, type: string): void {
        
    }

    public getRelation(type: string): Entity[] {
        
    }

    public hasRelation(entity: Entity, type: string): boolean {
        
    }

    public removeRelation(entity: Entity, type: string): void {
        
    }

    
}