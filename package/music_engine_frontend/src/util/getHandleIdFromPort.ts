import { PortDirection } from "music_engine/build/types/PortDirection.enum";

export function getHandleIdFromPort(nodeId: string, direction: PortDirection, portName: string) {
    return `${nodeId}:${direction}:${portName}`;
}
