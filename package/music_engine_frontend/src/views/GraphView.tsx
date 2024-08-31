import React, { useContext } from "react";
import  { Background, BackgroundVariant, ControlButton, Controls, MiniMap, ReactFlow, ReactFlowProvider, ViewportPortal } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { NodeContext, NodeEdgesContext } from "../state/nodes/context";
import { nodeTypes } from "../components/nodes/nodeTypes";

export function GraphView() {
    const nodes = useContext(NodeContext);
    const edges = useContext(NodeEdgesContext);

    return <>
        <ReactFlowProvider>
            <ReactFlow nodes={nodes} nodeTypes={nodeTypes}>
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
