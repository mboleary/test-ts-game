import React, { useMemo } from "react";

import { Node, NodeProps } from "@xyflow/react";
import { MENode } from "../../types/MENodeRepresentation.type";
import { NodeBase } from "./NodeBase";

export function ButtonInputNode({ data, ...props }: NodeProps<Node<MENode>>) {
    return <NodeBase data={data} {...props}>
        <div className="padding">
            <div>
                <b>{data.nodeType}</b>
            </div>
            <div>
                <i>{data.name}</i>
            </div>
            <div>
                <button type="button" onClick={() => {}} > {data.name} </button>
            </div>
        </div>
    </NodeBase>
}
