import {MusicEnginePort} from "music_engine";

export function getPortArray(node: MusicEngineAudioNode): MusicEnginePort[] {
    const ports = [];

    const keys = Reflect.ownKeys(node);
    for (const key of keys) {
        if (node[key] instanceof MusicEnginePort) {
            ports.push(node[key]);
        }
    }

    return ports;
}
