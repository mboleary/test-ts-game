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