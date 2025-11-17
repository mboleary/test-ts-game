import { useCallback } from "react";
import { NodeStore, useNodeStore } from "../../../state/store";
import { nanoid } from "nanoid";
import { GraphicalAnalyserNode, GraphicalDataType, MusicEngineOscillatorNode, MusicEngineSamplerNode, SequenceNode, SerializedMusicEngineSamplerNode } from "music_engine";
import { GraphicalMidiAnalyserNode } from "music_engine/build/subsystem/analyser/nodes/GraphicalMidiAnalyserNode";

const selector = (store: NodeStore) => ({
    addNode: store.addNode,
    setupMidi: store.setupMidi,
    loadAssets: store.loadAssets,
    assetsLoaded: store.assetsLoaded
});

export type NewNodePaneProps = {};

export const defaultNewNodePaneProps: Partial<NewNodePaneProps> = {};

export function NewNodePane({ }: NewNodePaneProps = defaultNewNodePaneProps) {
    const store = useNodeStore(selector);

    const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', nodeType)
    }, []);

    const addNodeTest = useCallback(() => {
        store.addNode({
            id: nanoid(),
            type: MusicEngineOscillatorNode.type,
            oscType: 'sine',
            name: 'This is a test',
            labels: []
        });
    }, [store]);

    const addCanvasTest = useCallback(() => {
        store.addNode({
            id: nanoid(),
            type: GraphicalAnalyserNode.type,
            name: 'Waveform',
            labels: [],
            dataType: GraphicalDataType.WAVEFORM,
        });
    }, [store]);

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
        <div className="description">You can drag these nodes to the pane on the right.</div>
        <div>
            <button onClick={setupMidi}>Setup Midi</button>
            <button onClick={setupSamples}>Load Samples</button>
            <button disabled={!store.assetsLoaded} onClick={addLoopingSample}>Add Looping Sample Note</button>
            <button disabled={!store.assetsLoaded} onClick={addNonLoopingSample}>Add non-looping sample node</button>
        </div>
        <div>
        </div>
        <div className="dndnode" onDragStart={(event) => onDragStart(event, MusicEngineOscillatorNode.type)} draggable data-node={{
            type: "test"
        }}>
            Oscillator Node
        </div>
        <div className="dndnode" onDragStart={(event) => onDragStart(event, SequenceNode.type)} draggable>
            Sequence Node
        </div>
        <div className="dndnode" onDragStart={(event) => onDragStart(event, GraphicalAnalyserNode.type)} draggable>
            Graphical Analyser Node
        </div>
        <div className="dndnode" onDragStart={(event) => onDragStart(event, GraphicalMidiAnalyserNode.type)} draggable>
            Graphical Midi Analyser Node
        </div>
    </>;
}