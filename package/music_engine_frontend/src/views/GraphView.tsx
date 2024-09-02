import React, { useContext } from "react";
import  { Background, BackgroundVariant, ControlButton, Controls, MiniMap, ReactFlow, ReactFlowProvider, ViewportPortal } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { nodeTypes } from "../components/nodes/nodeTypes";
import { NodeStore, useNodeStore } from "../state/store";

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

    return <>
        <ReactFlowProvider>
            <ReactFlow 
                nodeTypes={nodeTypes}
                nodes={store.nodes} 
                edges={store.edges}
                onNodesChange={store.onNodesChange}
                onEdgesChange={store.onEdgesChange}
                onConnect={store.addEdge}
            >
                <Background variant={BackgroundVariant.Dots} />
                <Controls>
                    <ControlButton></ControlButton>
                </Controls>
                <MiniMap />
                <ViewportPortal>
                    <div style={{transform: 'translate(0px, 0px)', position: 'absolute'}}>
                        <h1>BORK (Browser Orchestra)</h1>
                        <p>Text goes here about Browser Orchestra</p>
                    </div>
                </ViewportPortal>
            </ReactFlow>
        </ReactFlowProvider>
    </>;
}
