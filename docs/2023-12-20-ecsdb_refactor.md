# ECSDB Refactor

Taking the ideas that came from reading about other implementations, we're going to refactor the ECSDB.

## Main Points
- Archetypes
    - collection of Entities and their components grouped together based on similar components
    - arrays of components by component type
    - store reference to Entity Object, parent reference, child array, uuid, etc.
    - active (is active and should be processed), temp (is added as part of a transaction), mounted (is meant to be present in the world) flags
        - active and mounted might serve the same purpose?
    - data fields:
        - entity ref - reference to Entity Object
        - uuid - uuid of Entity
        - active - flag to indicate that the entity is to be processed by systems
        - mounted - flag to indicate that the entity is mounted to the active scene
        - temp - flag to indicate that this is a temporary entity
        - deleted - flag to indicate that the entity has been destroyed and that the slot can be used
        - parent ref - ref to the parent Entity
        - children refs - array of refs to the child Entities
        - components array
- remove component object class
- implement type checking for component type (same component object type for each component type)
- improve the Entity class to make it more efficient, also require world reference so that the logic around overriding an ecsdb can be removed
- add entity manager to use when adding new entities either directly or through a transaction, as well as removing entities
- remove Entity.build, as we want to avoid the overriding logic to reduce complexity
    - should be replaced by the use of the entity manager's `createEntity` (name may change or be shortened) method
- managers should be able to watch for adding and removing entities, as well as watch components on an entity through the use of observers

## 2023-12-25 Notes
- should probably implement internal filter system for archetype arrays
    - need way for managers to filter through the entities quickly
        - iterate through the arrays
    - Query manager for example will need to see what components each entity has on it
    - EntityManager will need a way to get all entities with ways to filter by `mounted`, `deleted`, and `active`
    - likely some kind of filter function that takes in the results of the arrays and spits out a boolean value to represent whether the entity meets the criteria or not
- need methods to set `mounted` and `active` flags, as well as clear out the temp entries
- NEED TO TEST EVERYTHING!

## 2024-01-06 Notes
- Is this overcomplicated?
- Implement systems
- implement observers on world so that creation and removal of Entities can be observed
- have a way to track mounted scene, handle switching scenes and setting the relevant flags

## 2024-01-10 Notes
### Query

```js
const q = new Query([ComponentKey1, ComponentKey2, ...]);
const q1 = new Query(Query.or([Query.and([CK1, CK2]), Query.and([CK2, CK3])]));
```

## 2024-02-24

I think the current implementation is overcomplicated by the strategy of hiding the Archetypes from everything else. By making that more public, it would remove the need for managers in their current form, and probably make having concurrent worlds easier.

- should shift Archetype implementation to make it more public
- archetypes should contain the ECSDB information
- maybe the concept of the "ECSDB" should be shifted to be a parent Archetype with no types
- managers should be transitioned to be more generic classes that don't need to be specialized to the ecsdb internals implementation
