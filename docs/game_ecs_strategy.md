# Game ECS Strategy

The goal of this engine is to build a low-friction and intuitive interface for building arbitrary games with arbitrary plugins.

## Examples

This example shows how we can build Entities in a more functional way.

```js
const engine = new Engine();
engine.initialize([...plugins]);
const health = Component.build(Symbol.for("Health"), 100);
const hero = Component.build(Symbol.for("Hero"));
const name = Component.build(Symbol.for("Name"), "Hero");
const entity = Entity.build([health, hero, name]);
const sys = System.for(System.LOOP, [Symbol.for("Hero"), Symbol.for("Health")], (entities) => console.log(entities), {...options});
const scene = new Scene();
scene.attachChild(entity);
engine.setScene(scene);
```

This should create an entity with Health + Hero + Name components and a system that processes all Entities with Hero and Health components.

Essentially, this just leaves the Entity class with an ID and a collection of components. The ECSDB stores the relation between entities and componets as well as the hierarchy of entities.

There are going to be a few built-in Component Types for conveinence:
```js
const name = Name.build("Hero");
const tag = Tag.build("PC");
const group = Group.build("group1");
```

In addition, there is a special type of component that doesn't have a type! These are called Atoms:
```js
const atom = Component.build(null, 100);
const atom1 = Component.build(null, "ATOM");
```

Systems are a way to process Components attached to an entity. This is how the game state will be mutated. 

```js
const sysInit = System.for(SystemLifecycle.INIT, [...types], (entities) => {}, {priority: 0});
const sysLoop = System.for(SystemLifecycle.LOOP, [...types], (entities) => {}, {priority: 0});
const sysDestroy = System.for(SystemLifecycle.DESTROY, [...types], (entities) => {}, {priority: 0});
scene.world.systemsManager.add([sysInit, sysLoop, sysDestroy]);
```

The Systems are attached to each ECS World, so that when a new scene is loaded, all systems are removed so that no latent behaviors exist across World boundaries.

SystemManager:
- add(System): void
- remove(System): boolean
- systems: System[]


There are times where we will need to override the ECSDB for an Entity, and this particularly happens when initially creating an Entity structure to be inserted into an existing scene. This will happen by creating the new hierarchy using a temporary ECSDB instance, done by passing parameters into the constructor:

```js
// world here was made using temporary ECSDB
await world.transactionManager.transaction(async (tempWorld, tempECSDB) => {
    const e = new Entity(uuidv4(), tempECSDB);
    e.setParent(scene);
});
```

This is also used internally when building an Entity using the static `build` method:

```js
const e = Entity.build([hero, health, name]);
scene.appendChild(e);
```

In that case, the newly-created Entity's ECSDB instance will be replaced as soon as it is added to the scene, and the new ECSDB will likely not be able to be overridden.

