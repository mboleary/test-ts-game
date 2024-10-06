import React, { useCallback, useContext } from "react";
import  { Background, BackgroundVariant, ControlButton, Controls, MiniMap, ReactFlow, ReactFlowProvider, ViewportPortal } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { nodeTypes } from "../components/nodes/nodeTypes";
import { NodeStore, useNodeStore } from "../state/store";
import { DarkModeToggleButton } from "../components/ControlButtons/DarkModeToggleButton";
import { useColorMode } from "../components/context/ColorMode";
import Sidebar from "../components/Sidebar";

const selector = (store: NodeStore) => ({
    nodes: store.nodes,
    edges: store.edges,
    onNodesChange: store.onNodesChange,
    onEdgesChange: store.onEdgesChange,
    addEdge: store.addEdge,
});

export function GraphView() {
    // const nodes = useContext(NodeContext);
    // const edges = useContext(NodeEdgesContext);

    const store = useNodeStore(selector);
    const [colorMode] = useColorMode();

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return <>
        <ReactFlowProvider>
            <ReactFlow 
                nodeTypes={nodeTypes}
                nodes={store.nodes} 
                edges={store.edges}
                onNodesChange={store.onNodesChange}
                onEdgesChange={store.onEdgesChange}
                onConnect={store.addEdge}
                onDragOver={onDragOver}
                colorMode={colorMode}
            >
                <Background variant={BackgroundVariant.Dots} />
                <Controls>
                    <DarkModeToggleButton />
                </Controls>
                <MiniMap />
                <ViewportPortal>
                    <div style={{transform: 'translate(0px, 0px)', position: 'absolute', zIndex: -100}}>
                        <h1>BORK (Browser Orchestra)</h1>
                        <p>Text goes here about Browser Orchestra</p>
                    </div>
                </ViewportPortal>
                
            </ReactFlow>
            
        </ReactFlowProvider>
    </>;
}
