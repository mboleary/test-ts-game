import { MusicEngineNode, MusicEnginePort, PortDirection } from "music_engine";
import { PortType } from "music_engine/build/types/PortType";

export type MENode<T extends MusicEngineNode = MusicEngineNode> = {
    name: string;
    nodeType: string;
    labels: string[];
    ports: MENodePortRepresentation[];
    props: MENodeProp<T, any>[]
};

export type MENodePortRepresentation = {
    id: string;
    type: PortType;
    name: string;
    direction: PortDirection;
};

export enum PropType {
    TEXT = 'TEXT',
    SELECT = 'SELECT',
    PORT = 'PORT',
    RANGE = 'RANGE'
}

export type MENodeProp<NodeType, ValueType> = {
    key: keyof NodeType,
    type: PropType,
    possibleValues?: ValueType[],
    portId?: string;
    value: ValueType;
    rangeMin?: number;
    rangeMax?: number;
}

// export type MENodePortRepresentation = typeof MusicEnginePort;
