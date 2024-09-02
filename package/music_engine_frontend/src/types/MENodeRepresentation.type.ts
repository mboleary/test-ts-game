import { PortDirection } from "music_engine";
import { PortType } from "music_engine/build/types/PortType";

export type MENodeRepresentation = {
    id: string;
    name: string;
    type: string;
    labels?: string[];
    inPorts?: MENodePortRepresentation[];
    outPorts?: MENodePortRepresentation[];
}

export type MENodePortRepresentation = {
    type: PortType;
    name: string;
    direction: PortDirection;
}
