import {MusicEnginePort, MusicEngineNode} from "../";

export function getPortArray(node: MusicEngineNode): MusicEnginePort[] {
    const ports = [];

    const keys = Reflect.ownKeys(node) as (keyof MusicEngineNode)[];
    for (const key of keys) {
        if (node[key] instanceof MusicEnginePort) {
            // @TODO is this correct?
            ports.push(node[key] as unknown as MusicEnginePort);
        }
    }

    return ports;
}
