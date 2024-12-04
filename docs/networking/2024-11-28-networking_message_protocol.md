# Networking Message Protocol

Before reading this, read through `Websocket.md`.

There are a few additional messages that need to be sent back and forth in order to communicate other events to the client and server.

This protocol should support both star and graph-shaped topologies for Websocket and WebRTC respectively.

## Order of Operations When Establishing a Connection

- Client connects to server via transport mechanism
- Server responds with meessage
    - Client connection state moves to Initialized from Disconnected
    - Server sends owner ID to client as well as current role
    - Server at this point can authenticate client using a token
        - Identity information is then sent to the client
    - Permissions are sent to the client
    - Server should send a reconnect token to the client
        - Client would use this if the connection is lost and needs to reconnect
- Client can request sync from server
    - Sync doesn't necessarily need to happen immediately
    - When server is responding with sync, the server is in effect sending a snapshot of the current state of the game
    - The server sends over all registered entities to the client
        - includes the entity id and components
    - The client then registers its owned entities
    - The client should understand this as a refresh of the entire game state and should remove all other registered entities
    - Right before the game starts, the server will send over the current gametime
    - Game should be paused until the start state is reached
    - Server keeps track of all client sync states
    - Server sends current game time to client
- Server sends Start event
    - Connection state transitions to Connected (I might call this Started later on)
    - Clients unpause and begin to run the game code
    - Clients owning entities send updates (deltas) from last update on the update schedule
        - update schedule is based on time to help with debouncing the state update messages
        - updates are batched and then dispatched within the defined timeperiod
        - each client update to the server should contain a message number to help track messages sent and indicate missed messages
- If using a Star Topology:
    - The server receives the update messages and then sends that to the other connected clients
        - those messages are batched
        - only the deltas are sent
        - the server can use this to measure ping time
- If sending updates directly to clients (WebRTC):
    - TBD
- If the client loses its connection:
    - Connection state shifts to Reconnecting
    - the client tries to reconnect using the reconnect token as a header
    - After making the connection to the server, the server responds with a Sync. Connection state moves to Sync
    - After sync, the client reconciles its owned entities with the entities on the server and retains control of them
    - the server sends the current gametime to the client
    - Client rejoins game, connection state transitions to Connected

## Other events

- Entity (client-initiated)
    - create
    - get (entity, component keys, component keys and values, relationships)
    - delete
    - update component
        - set value
        - unset value
    - update relationship
        - add
        - remove
    - list: Get all entity ids
- Entity (server-initiated, for subscribed entities)
    - delete
    - update component
        - set value
        - unset value
    - update relationship
        - add
        - remove
- System (server-initiaited)
    - client join
        - give id to other clients
        - If server is configured, also provide identity information like an id
    - client leave
    - Reconnect Sync
    - set game time
- System (client-initiaited)
    - sync game state
    - message: Sending message to a client with arbitrary data
    - subscribe to updates for an entity
    - unsubscribe to an entity


## Operating theory

The server should try to operate slightly ahead of the current playable game state so that everything can operate in near-real-time.

### How this would work

- For server-owned entities in a setup where the networking library is combined with the server-operated version of the game, assuming that all updates originate from the server
    - (optimal case for anti-cheat)
    - Client send messages on input
    - Server alters entity component state
    - Server sends update message
    - Client receives message and applies to local game state
    - In this setup the source of truth has the current game time
- For a setup where the client is the source of truth for an entity:
    - we need to figure out how to separate the calculated (based on current player input) vs the current state, since all clients need to be in sync
        - goal is that the client's owned entity state is ahead of the actual game state to account for lag
        - the network client then dispatches the state change at the same time that the other cients would get it
        - could have a setup where all entity data being shared across the network are duplicated, or have a second entity labelled as the master state
