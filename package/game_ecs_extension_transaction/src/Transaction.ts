import { Entity } from "game_ecs";
import { System } from "game_ecs";
import { EntityIdType } from "game_ecs";
import { World } from "game_ecs";
import { TransactionInternals } from "./TransactionInternals";

export class Transaction extends World {
    private readonly transactionInternals: TransactionInternals = new TransactionInternals();

    constructor(
        public readonly destinationWorld: World,
    ) {
        super();
    }

    public getEntity(id: EntityIdType): Entity | undefined {
        if (this.transactionInternals.deletedEntityIds.has(id)) {
            return undefined;
        }
        const destEntity = this.destinationWorld.getEntity(id);
        if (destEntity) return destEntity;
        return super.getEntity(id);
    }

    public deleteEntity(id: EntityIdType): void {
        if (this.internals.entityMap.has(id)) {
            // Go ahead with deletion
            super.deleteEntity(id);
        } else {
            // Stage Entity for deletion later
            this.transactionInternals.deletedEntityIds.add(id);
        }
    }

    public addSystem(system: System): void {
        
    }

    public removeSystem(systemId: string): void {
        
    }

    public commit() {}

    public rollback() {}
}