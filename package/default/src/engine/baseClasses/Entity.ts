export class Entity {
    public readonly tags: string[] = [];

    public parent: Entity | null = null;

    public readonly children: Entity[] = [];

    constructor(
        public readonly id: string,
        public name: string
    ) {}
}