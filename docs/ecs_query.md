# ECS Query Pipeline

```
Top-level Query AND
[EntityMappingValues[]] => (filter AND[0]) => (filter AND[1]) => (filter...) => Hydrate() => Entity[]

Top-level Query OR
[EntityMappingValues[]] => (filter OR[0]) => store ids
[EntityMappingValues[]] => (filter OR[1]) => store ids
[EntityMappingValues[]] => (filter OR[2]) => store ids
...
ids => unique => Hydrate() => Entity[]


Top-level Query Singleton (NOT, ID, RELATIONSHIP)
```
