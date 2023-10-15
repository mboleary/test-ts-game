# ECSDB Improvements

## Internals
- Consider adding arrays for storing components for an entity for performance reasons
    - only really makes sense if there's a reason to move up those arrays
        - implementation detail for querying, since it's possible that it might speed up sequential accesses

## One of the managers
```js
const manager = world.getManager(Manager);
manager.transaction(async (transManager) => {
    transManager.createEntity([])
});
manager.createEntity()
```
