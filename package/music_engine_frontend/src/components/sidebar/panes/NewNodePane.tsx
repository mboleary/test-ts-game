import { useCallback } from "react";
import { NodeStore, useNodeStore } from "../../../state/store";
import { nanoid } from "nanoid";
import { GraphicalAnalyserNode, GraphicalDataType, MusicEngineOscillatorNode, MusicEngineSamplerNode, SequenceNode, SerializedGraphicalAnalyserNode, SerializedMusicEngineSamplerNode } from "music_engine";
import { GraphicalMidiAnalyserNode } from "music_engine/build/subsystem/analyser/nodes/GraphicalMidiAnalyserNode";
import { AddNodeDragElement } from "../../AddNodeDragElement";
import { FiActivity, FiBarChart } from "react-icons/fi";

const selector = (store: NodeStore) => ({
    addNode: store.addNode,
    setupMidi: store.setupMidi,
    loadAssets: store.loadAssets,
    assetsLoaded: store.assetsLoaded,
    midiConnected: store.midiConnected,
});

export type NewNodePaneProps = {};

export const defaultNewNodePaneProps: Partial<NewNodePaneProps> = {};

export function NewNodePane({ }: NewNodePaneProps = defaultNewNodePaneProps) {
    const store = useNodeStore(selector);

    const setupMidi = useCallback(() => {
        store.setupMidi();
    }, [store]);

    const setupSamples = useCallback(() => {
        store.loadAssets();
    }, [store]);

    const addLoopingSample = useCallback(() => {
        const nodeData: SerializedMusicEngineSamplerNode = {
            id: nanoid(),
            type: MusicEngineSamplerNode.type,
            name: "Looping Sample Test",
            labels: ["sample"],
            samples: MusicEngineSamplerNode.sample("loop"),
        };
        store.addNode(nodeData);
    }, []);

    const addNonLoopingSample = useCallback(() => {
        const nodeData: SerializedMusicEngineSamplerNode = {
            id: nanoid(),
            type: MusicEngineSamplerNode.type,
            name: "Looping Sample Test",
            labels: ["sample"],
            samples: MusicEngineSamplerNode.sample("crow"),
        };
        store.addNode(nodeData);
    }, []);

    return <>
        <p className="description">Options:</p>
            <div>
                <button onClick={setupMidi} disabled={store.midiConnected}>Setup Midi</button>
                <button onClick={setupSamples} disabled={store.assetsLoaded}>Load Samples</button>
            </div>
            <div>
                <button disabled={!store.assetsLoaded} onClick={addLoopingSample}>Add Looping Sample Note</button>
                <button disabled={!store.assetsLoaded} onClick={addNonLoopingSample}>Add non-looping sample node</button>
            </div>
        <p className="description">You can drag these nodes to add them to the graph</p>
        <div className="flex-layout vertical" style={{ rowGap: "3px", }}>
            <AddNodeDragElement name="Oscillator Node" type={MusicEngineOscillatorNode.type} icon={<FiActivity />} />
            <AddNodeDragElement name="Sequence Node" type={SequenceNode.type} icon={<FiBarChart />} />
            <AddNodeDragElement name="Graphical Analyzer Node - Waveform" type={GraphicalAnalyserNode.type} icon={<FiActivity />} />
            <AddNodeDragElement<SerializedGraphicalAnalyserNode> name="Graphical Analyzer Node - Frequency" type={GraphicalAnalyserNode.type} icon={<FiActivity />} serializedNodeData={{dataType: GraphicalDataType.FREQUENCY}} />
            <AddNodeDragElement name="Graphical Midi Analyzer Node" type={GraphicalMidiAnalyserNode.type} icon={<FiBarChart />} />
        </div>
    </>;
}