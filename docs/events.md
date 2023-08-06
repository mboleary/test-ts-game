# Events

The Event system povides a way to decouple logic and trigger actions between the engine and other behavior-components.

The event system should be tightly coupled with the Observer as Observers will emit events when an observed Entity or Component changes.


Events will follow an EventBus, which determines the path and lifetime of the event. For example, Events emitted on an Entity will bubble up through the Entity's parent until they reach the root scene node. Events emitted by the Plugins (that which implements functionality in the engine) will follow a more linear EventBus path, where it will not bubble up but will instead be sent linearly.

Following the exampe of an Entity, an event would be emitted on the actual entity, where it could be dispatched to any subscribers on the Event itself before being propagated to the entity's parents.

## Implementation

### Example Code

```js
// Generic Event Example
let evt = new Event();
this.entity.emit("test.event", evt);
this.entity.subscribe("test.*", (event) => {
    console.log(event);
});
entityA.subscribe("test.event", (event) => {
    event.stopPropagation();
});

```

### Event
Will mirror the Web Browser's implementation of [Events](https://developer.mozilla.org/en-US/docs/Web/API/Event) but without certain properties.

- bubbles: boolean
- target: Entity | Component
- type: T  - Type of event
- stopPropagation()

### EventBus (generic)
Is responsible for forwarding the event and managing subscriptions. This is made up of the event emitters and dispatchers. This will probably not be implemented as its own class.

### EventEmiter
This is responsible for emitting events
- emit(type: string, data: any, options?: EventOptions)
- subscribe(type: string, handler: function)
- unsubscribe(handler: function)
- once(type: string, handler: function)
- 

### Subscription
Manages a subscription and allows for easy unsubscribing.
- close()
- 