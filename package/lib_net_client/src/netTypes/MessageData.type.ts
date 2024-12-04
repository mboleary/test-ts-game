import { MessageType } from "./MessageType.enum"

export type MessageData = {
  type: MessageType, // the type of message
  target?: string, // target of the message
  id?: string, // id of the object in question
  data?: any, // data payload to update
  owner?: string, // owner of the object (id of the owner)
  messageNumber?: number, // Number of the message
  updatedAt: number, // timestamp of the update
}
