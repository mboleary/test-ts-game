# Archetecture

The Networking Plugin will be structured in such a way that it can implement syncing the game state using different underlying transport mechanisms, such as a Websocket, or WebRTC, and the server-side library written in such a way that it could be used to run the game locally as part of the server and then immediately sync the game state.

