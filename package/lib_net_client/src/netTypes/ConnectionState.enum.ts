export enum ConnectionState {
  // Websocket was previously disconnected and a connection is being re-established
  RECONNECTING = 'RECONNECTING',
  // Websocket is disconnected
  DISCONNECTED = 'DISCONNECTED',
  // Websocket made the initial connection and is awaiting a response from the server
  INITIALIZED = 'INITIALIZED',
  // Syncing client game state to server
  SYNCING = 'SYNCING',
  // Client is fully connected and synced to the server
  CONNECTED = 'CONNECTED',
}
