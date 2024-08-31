import { XYPosition } from "@xyflow/react";
import { PortType } from "music_engine/build/types/PortType";

export type MENodeRepresentation = {
    id: string;
    name: string;
    type: string;
    inPorts: MENodePortRepresentation[];
    outPorts: MENodePortRepresentation[];
}

export type MENodePortRepresentation = {
    type: PortType;
    name: string;
}
