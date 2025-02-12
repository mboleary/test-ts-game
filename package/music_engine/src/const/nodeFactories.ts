import { NodeFactory } from "../NodeBuilder";
import { MusicEngineOscillatorNode, SerializedMusicEngineOscillatorNode } from "../nodes";
import { AudioOutputNode } from "../nodes/AudioOutputNode";
import { GraphicalAnalyserNode, SequenceNode, SerializedGraphicalAnalyserNode, SerializedSequenceNode } from "../subsystem";

type FactoryMap = 
    NodeFactory<MusicEngineOscillatorNode, SerializedMusicEngineOscillatorNode> |
    NodeFactory<SequenceNode, SerializedSequenceNode> |
    NodeFactory<GraphicalAnalyserNode, SerializedGraphicalAnalyserNode>;

export const nodeFactories: FactoryMap[] = [
    {name: MusicEngineOscillatorNode.type, build: MusicEngineOscillatorNode.fromJSON},
    {name: SequenceNode.type, build: SequenceNode.fromJSON},
    {name: GraphicalAnalyserNode.type, build: GraphicalAnalyserNode.fromJSON},
]