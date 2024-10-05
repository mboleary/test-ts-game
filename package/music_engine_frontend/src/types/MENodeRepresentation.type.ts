import { MusicEngineNode, MusicEnginePort, PortDirection } from "music_engine";
import { PortType } from "music_engine/build/types/PortType";

export type MENode<T extends MusicEngineNode = MusicEngineNode> = {
    name: string;
    nodeType: string;
    labels: string[];
    ports: MENodePortRepresentation[];
};

export type MENodePortRepresentation = {
    id: string;
    type: PortType;
    name: string;
    direction: PortDirection;
};

// export type MENodePortRepresentation = typeof MusicEnginePort;
