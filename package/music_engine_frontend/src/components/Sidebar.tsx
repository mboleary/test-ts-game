import React, { useCallback } from 'react';
import { useDnD } from './DndContext';
import { NodeStore, useNodeStore } from '../state/store';
import { GraphicalAnalyserNode, GraphicalDataType, MusicEngineOscillatorNode, SequenceNode } from 'music_engine';
import { nanoid } from 'nanoid';
import { ButtonInputNode } from './nodes/ButtonInputNode';
import { GraphicalMidiAnalyserNode } from 'music_engine/build/subsystem/analyser/nodes/GraphicalMidiAnalyserNode';

const selector = (store: NodeStore) => ({
    addNode: store.addNode,
    setupMidi: store.setupMidi
});

export default () => {
  const [_, setType] = useDnD();

  const store = useNodeStore(selector);

  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    console.log("onDragStart", nodeType, setType);
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', nodeType)
  }, [setType]);

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

  return (
    <aside className="">
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div>
        <button onClick={addNodeTest}>Add an actual Node</button>
        <button onClick={addCanvasTest}>Add a canvas</button>
        <button onClick={setupMidi}>Setup Midi</button>
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, MusicEngineOscillatorNode.type)} draggable>
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

    </aside>
  );
};
