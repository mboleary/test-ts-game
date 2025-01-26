import { NodeFactory } from "../NodeBuilder";
import { MusicEngineOscillatorNode, SerializedMusicEngineOscillatorNode } from "../nodes";
import { SequenceNode, SerializedSequenceNode } from "../subsystem";

type FactoryMap = 
    NodeFactory<MusicEngineOscillatorNode, SerializedMusicEngineOscillatorNode> |
    NodeFactory<SequenceNode, SerializedSequenceNode> ;

export const nodeFactories: FactoryMap[] = [
    {name: MusicEngineOscillatorNode.type, build: MusicEngineOscillatorNode.fromJSON},
    {name: SequenceNode.type, build: SequenceNode.fromJSON},
]