import React, { useCallback, useContext, useEffect, useState } from "react";
import  { Background, BackgroundVariant, ControlButton, Controls, Edge, MiniMap, Node, NodeTypes, ReactFlow, ReactFlowInstance, ReactFlowProvider, useReactFlow, ViewportPortal } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { nodeTypes } from "../components/nodes/nodeTypes";
import { NodeStore, useNodeStore } from "../state/store";
import { DarkModeToggleButton } from "../components/ControlButtons/DarkModeToggleButton";
import { useColorMode } from "../components/context/ColorMode";
import Sidebar from "../components/Sidebar";
import { useDnD } from "../components/DndContext";
import { nanoid } from "nanoid";

const selector = (store: NodeStore) => ({
    nodes: store.nodes,
    edges: store.edges,
    onNodesChange: store.onNodesChange,
    onEdgesChange: store.onEdgesChange,
    addEdge: store.addEdge,
    addNode: store.addNode,
});

export function GraphView() {
    // const nodes = useContext(NodeContext);
    // const edges = useContext(NodeEdgesContext);

    const store = useNodeStore(selector);
    const [colorMode] = useColorMode();
    const [type] = useDnD();

    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<any, Edge>>();

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();

        const data = event.dataTransfer.getData('text/plain');

        console.log('onDrop', type, reactFlowInstance, event, data);

        if (!data || !reactFlowInstance) {
            return;
        }

        const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        store.addNode({
            id: nanoid(),
            type: data,
            name: data,
            labels: ['dnd'],
        }, position);
    }, [reactFlowInstance, type]);

    useEffect(() => {
        console.log('type updated:', type);
    }, [type]);

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
                onDrop={onDrop}
                colorMode={colorMode}
                onInit={(instance) => setReactFlowInstance(instance)}
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
