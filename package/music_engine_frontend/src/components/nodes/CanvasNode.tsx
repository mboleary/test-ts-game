import React, { useEffect, useMemo, useRef } from "react";

import { Node, NodeProps } from "@xyflow/react";
import { MENode } from "../../types/MENodeRepresentation.type";
import { NodeBase } from "./NodeBase";
import { NodeStore, useNodeStore } from "../../state/store";
import { GraphicalAnalyserNode } from "music_engine";

const selector = (store: NodeStore) => ({
    getMusicEngineNode: store.getMusicEngineNode,
});

export function CanvasNode({ id, ...props }: NodeProps<Node<MENode>>) {
    const store = useNodeStore(selector);
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current as HTMLCanvasElement | null;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        context.fillStyle = "lightblue";
        context.fillRect(0,0,300,300);
    }, [ref]);

    useEffect(() => {
        if (!ref.current || !id) return;

        const musicEngineNode = store.getMusicEngineNode<GraphicalAnalyserNode>(id);

        if (!musicEngineNode) return;

        musicEngineNode.setCanvas(ref.current);
        musicEngineNode.start();
    }, [id, ref]);

    return <NodeBase
        {...props}
        id={id}
        showTitlebar={false}
    >
        <canvas ref={ref} width={300} height={300}/>
    </NodeBase>
}
