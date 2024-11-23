# ECS Extensions

The Entity Component System is built in a way that supports extending the functionality of the World so that many needs can be met. This documents some ways in which the ECS can be extended.

## World Transactions

The purpose of adding transaction is to allow for modifying the database in any necesary way without _modifying_ the actual data until an operation completes successfully. It would probably work in a way where the modified data would be transferred to a sub-internals instance where the changes are staged, but reads for the unmodified objects are passed through to the parent instance. When the transaction is committed, the changes would be applied to the parent, and if the transaction is reverted, then the sub-instance is thrown away and nothing is changed.

```js
const world = new World();
world.transaction(txn => {
    try {
        // Read a file to load entities from
        // ...

        txn.addEntity(undefined, {key: 'TEST', value: {some: 'value'}});
    ...
    } catch {
        txn.rollback();
        return;
    }


    txn.commit();
});
```

## Virtual / Computed Components

Adding support for virtual or computed components will enable Entities to have a greater variety of components, and allow some compoents to generate just-in-time based on other data in the database so that the structure is more flexible. The idea is that for some usecases, components can be generated and accessed just-in-time so that the data is more flexible. Also, this is to be defined on the Entity, and getting the compoent data should be immediate.

```js
const world = new World();
const entity = world.createEntity(undefined, [...]);
entity.addComputedComponent([], VCOMP1, ([comp1, comp2], entity) => {
    return entity.getRelation('parent')[0]?getComponent(TEST); // Return data is what the virtual component is set to
});

// ....

entity.getComponent(VCOMP1); // returns virtual component
```
