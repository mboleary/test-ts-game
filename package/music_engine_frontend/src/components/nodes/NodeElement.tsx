import React, { useMemo } from "react";

import { Node, NodeProps } from "@xyflow/react";
import { MENode } from "../../types/MENodeRepresentation.type";
import { NodeBase } from "./NodeBase";

export function NodeElement({ ...props }: NodeProps<Node<MENode>>) {
    return <NodeBase 
        {...props}
    />
}
