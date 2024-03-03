# Websocket Networking Server Spec

The websocket server is a cached messaging service.

Like the preceeding project, JSGE, the networking module follows a Publish-Subscribe model, where a client can join a room and subscribe to different events to receive updates. Upon joining a room, a client will automatically be subscribed to all other objects present in the room as well as new objects that are created.

Most messages are sent to all clients by default, but is determined by the `target` field in most cases. For example, if a client creates a new object, all clients will automatically

## Message Format

### MessageData

This is sent from the client to the server after joining a room.

```js
class MesageData {
    type: string, // the type of message
    target?: string, // target of the message
    id?: string, // id of the object in question
    data?: any, // data payload to update
    owner?: OwnerInfo, // owner of the object
}
```

## Message Types (Commands)

### Create

Allows creating a new object. By default, the object is owned by the creator, and all other clients are automatically subscribed.

#### Options

- owner: set the owner of the object, can also make it publicly ownable
- subscribeAll: can allow preventing all clients automatically subscribing on the object
- id: set the ID of the object
- permissionOptions: Sets the permissions on the object

### Read

Retrieve data for an object, given an id.

#### Returns

This returns the object along with some metadata

```js
class ReadResponse {
    type: 'read',
    target: 'client',
    id: '<id>',
    data: {...}, // Complete state of the object
    owner: OwnerInformation, // owner information object
    messageNumber: number, // current update number of the object in question
    updatedAt: 'timestamp', // timestamp of last update
}
```

Or if the client doesn't have permission, an error:

```js
class ErrorResponse {
    type: 'read',
    target: 'client',
    id: '<id>',
    error: {
        code: '401',
        message: `Client cannot read ${id}`
    }
}
```

Or if the object doesn't exist (or was deleted)

```js
class ErrorResponse {
    type: 'read',
    target: 'client',
    id: '<id>',
    error: {
        code: '404',
        message: `Object ${id} doesn't exist`
    }
}
```

### Update

Update the data or owner of an object. Returns an error if the client isn't authorized to update the object or the object has not been created.

#### Options

- data: sets the data on the object
- mode: (default put) allows incrementally updating the data on an object
    - values: `put`, `patch`
- owner: change the owner of the object
- id: ID of the object to update

### Delete

Deletes an object and unsubscribes all clients from the object updates. Also should flush permissions and data on the object. There can be certain operation modes where information about the object being deleted is persisted, probably to help with debugging.

#### Options

- id: ID of the object to delete

### List

Lists all object IDs that can be read by the client.

#### Returns

```js
class ListResponse {
    type: 'list',
    target: 'client',
    data: [
        '<id_1>',
        '<id_2>',
        ...
    ]
}
```

### Subscribe

Subscribe to an object's updates. This is only useful if an object is created without subscribing all clients by default.

#### Options

- id: ID of object to subscribe to

### Unsubscribe

Unsubscribe from an object's updates.

#### Options

- id: ID of object to unsubscribe from

### Message

Send a message directly to a particular client

#### Options

- target: id of client
- data: (any) message to send to the client
- id: can allow specifying an id (string) to the remote client

## Measuring Ping and Lag

While some games will not need to make use of measuring lag, some will, so the server will be responsible for pinging connected clients and measuring lag and determining if connections are dead.

The server will be responsible for setting the lag time based on the highest connection lag, and will operate on the assumption of the updates being scheduled on the client side (they are sent ASAP, but with an active time field). In addition, there is another message that can be sent from the server to set the current game time, and a message that will notify the client of their ping and lag time.

### Set Gametime Message

This will set the current game time for all clients in an effort to sync their state. This is sent from the server to the client.

#### Response

```js
class GametimeSetResponse {
    type: 'set_time',
    target: 'client',
    data: 0, // the time to set the game to
    scheduledTime: -1, // Not applicable in this case
    currentPing: 0, // time in ms of current ping time between the server and client
    currentTime: 0, // The current game time as kept by the server in ms
}
```

### Notify Client of Ping

By default, all messages will notify the client of their current ping time in each message being sent with time tracking turned on (serverside config value)

### Game Time Measurement fields

The following fields are added to message responses if the game time is being tracked.

- scheduledTime: time at which the message takes effect on the client (if less than current, immediately)
- currentPing: duration of the last ping value
- currentTime: current game time as tracked by the server

### Starting the game timer on the server

In our server, we'll treat the game time as a special object that is owned by the server and readable by all clients.

Object ID: `gametime`
data: current time in ms

## Connections and Disconnections

The server will by default broadcast when clients connect and disconnect from the server. These messages look like:

```js
class ConnectionResponse {
    type: 'join | leave'
    target: '<client id>',
    reason?: string, // can indicate if a client was kicked, disconnected due to lag, or left on their own accord
}
```
