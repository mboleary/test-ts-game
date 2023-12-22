import { Entity } from "../Entity";
import { ComponentKeyType } from "../type/ComponentKey.type";

export class Archetype {
    constructor() {}

    // Entity-related arrays
    private readonly uuid: string[] = [];
    private readonly ref: Entity[] = [];
    private readonly active: boolean[] = [];
    private readonly temp: Boolean[] = [];
    private readonly mounted: boolean[] = [];
    private readonly deleted: boolean[] = [];
    private readonly parent: Entity[] = [];
    private readonly children: Entity[][] = [];
    private readonly components: any[][] = [];

    private readonly uuidMap: Map<string, number> = new Map();
    private readonly typeMap: Map<ComponentKeyType, any> = new Map(); // used to actively enforce types in arrays

    public addEntity() {}
    // can be used to migrate from one archetype to another as well as generally removing entities
    public removeEntity() {}
    public getEntity() {}
    private buildEntity() {}
    public setEntityActive(uuid: string, state: boolean) {}
    public setEntityTemp(uuid: string, state: boolean) {}
    public setEntityMounted(uuid: string, state: boolean) {}
    public setEntityParent(uuid: string, parentRef: Entity) {}
    public setEntityComponent(uuid: string, componentKey: ComponentKeyType, componentData: any) {}
    public getEntityComponent<T>(uuid: string, componentKey: ComponentKeyType): T {return null;}
}