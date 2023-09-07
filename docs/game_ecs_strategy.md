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

## Systems and Plugins

The Engine will have a plugin to allow systems to run code, but we also need to figure out how to inject the plugin instances into the systems for usecases like controlling an entity or interfacing with a networking plugin

Here are some examples of how this could work.

In the `main.ts` file:
```js
function buildSystems(engineInternals) {
    const sysInit = System.for(SystemLifecycle.INIT, [...types], (entities) => {}, {priority: 0});
    const sysLoop = System.for(SystemLifecycle.LOOP, [...types], (entities) => {}, {priority: 0});
    const sysDestroy = System.for(SystemLifecycle.DESTROY, [...types], (entities) => {}, {priority: 0});

    return [sysInit, sysLoop, sysDestroy];
}
function main() {
    const engine = new Engine();

    const inputPlugin = new InputPlugin({...options});
    const systemPlugin = new SystemPlugin(buildSystems);

    engine.initialize([]);

    const scene = new Scene(uuidv4(), "default");

    engine.setCurrentScene(scene);

    engine.start();

    console.log(engine.getWorld());

    window.addEventListener("beforeunload", (e) => {
        engine.destroy();
    });
}
```
This approach would let the System Plugin provide the internals to a function that can provide them to each of the systems that needs them, but this has the downside of making it harder to control which scenes the systems are added to.

Bevy takes the approach of providing what they call Resources (in our lingo, these are the plugin instances) to each of the systems individually. Maybe we can do something similar. A few key things we need to keep in mind are that the core engine logic and the ECS implementation are split apart, so we need to work around that.

Given that we account for a `priority` value in the system, perhaps we could abandon the current plugin implementation of those lifecycle functions (`init`, `loop`, etc.)? If this is done, there will need to be a way to handle behaviors globally so that plugins have a lifecycle point that can still be called to initialize the plugin functionality irrespective of the current ECS world.

The following could be passed into the constructor for a Plugin:
- engine components
- a way to get other plugins
- a way to get the current world
- a way to set resources for other systems to use
    - this replaces the current Plugin's build system

Actually, we could keep the concept of having a separate class to construct the plugin, but remove the lifecycle functions and replace it work the resources thing mentioned above. We definitely want to keep the pattern of being able to construct the plugin and pass it into the engine's constructor parameters.

```js
const demoPlugin = new DummyPlugin({...options});
const engine = new Engine([demoPlugin]);
```

## Querying

The Query Engine should probably be implemented as an abstract interface to allow arbitrary query engines to be installed into the engine. A usecase of this is to allow a custom query engine for querying Entities and Components.
