import React, { useMemo, useRef } from "react";

import { Node, NodeProps } from "@xyflow/react";
import { MENode } from "../../types/MENodeRepresentation.type";
import { NodeBase } from "./NodeBase";

export function CanvasNode({ ...props }: NodeProps<Node<MENode>>) {
    const ref = useRef(null);
    return <NodeBase 
        {...props}
    >
        <canvas ref={ref} width={300} height={300}/>
    </NodeBase>
}
