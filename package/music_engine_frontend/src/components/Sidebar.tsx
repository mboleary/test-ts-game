import React, { useCallback } from 'react';
import { useDnD } from './DndContext';
import { NodeStore, useNodeStore } from '../state/store';
import { defaultDrawingOptions, GraphicalAnalyserNode, GraphicalDataType, MusicEngineOscillatorNode, SerializedMusicEngineOscillatorNode } from 'music_engine';
import { nanoid } from 'nanoid';

const selector = (store: NodeStore) => ({
    addNode: store.addNode,
    setupMidi: store.setupMidi
});

export default () => {
  const [_, setType] = useDnD();

  const store = useNodeStore(selector);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

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
      drawingOptions: defaultDrawingOptions
    });
  }, [store]);

  const setupMidi = useCallback(() => {
    store.setupMidi();
  }, [store]);

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div>
        <button onClick={addNodeTest}>Add an actual Node</button>
        <button onClick={addCanvasTest}>Add a canvas</button>
        <button onClick={setupMidi}>Setup Midi</button>
      </div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Input Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        Default Node
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        Output Node
      </div>
    </aside>
  );
};
