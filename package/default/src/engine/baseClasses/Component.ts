import { Entity } from "./Entity";

export type ComponentData = {
    [key: string]: any
}

export class Component {

    public entity: Entity | null = null;

    /**
     * Creates a Component that will be attached to an entity
     * @param id 
     * @param name 
     * @param type 
     */
    constructor(
        public readonly id: string,
        public name: string,
        public readonly type: string,
        public readonly data: ComponentData
        
    ) {}
}