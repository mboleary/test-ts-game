export class EntityRelationship {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly entityAId: string, 
    public readonly entityBId: string
  ) {}
}
