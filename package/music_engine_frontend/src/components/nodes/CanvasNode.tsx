import React, { useEffect, useMemo, useRef } from "react";

import { Node, NodeProps } from "@xyflow/react";
import { MENode } from "../../types/MENodeRepresentation.type";
import { NodeBase } from "./NodeBase";

export function CanvasNode({ ...props }: NodeProps<Node<MENode>>) {
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current as HTMLCanvasElement | null;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        context.fillStyle = "lightblue";
        context.fillRect(0,0,300,300);
    }, [ref]);
    return <NodeBase 
        {...props}
        showTitlebar={false}
    >
        <canvas ref={ref} width={300} height={300}/>
    </NodeBase>
}
