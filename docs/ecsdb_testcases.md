# ECSDB Test Cases

This is a list of things to test in relation to the ECSDB implementation.

## ECSDB
### Entity
- getChildrenOfEntity
- getParentOfEntity
- getComponentsForEntity
- setParentOfEntity
- validateEntity

### Component
- getEntityForComponent

## EntityManager

- getEntityByID
    - with valid ID
    - with invalid ID -> should return null
- hasEntity
    - with valid ID
    - with invalid ID
- createEntity
    - with children
        - valid
        - invalid id
        - unregistered partial
    - without children
    - with parent
        - valid
        - invalid (not registered)
    - without parent
    - with tags
    - without tags
    - (for all) Check:
        - entity is present in ECSDB
        - can get children / tags / parent
- createMultipleEntities
    - (all tests from createEntity)
    - rawEntityData with partial parent
    - rawEntityData with partial children

## (TODO) ComponentManager
- getComponentByID

## World
- Fires events correctly
- provides EntityManager, ComponentManager, QueryManager, etc. correctly