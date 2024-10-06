import React, { useCallback, useMemo } from "react";

import { Node, NodeProps } from "@xyflow/react";
import { MENode } from "../../types/MENodeRepresentation.type";
import { NodeBase } from "./NodeBase";
import { FiActivity } from "react-icons/fi";
import { NodePropInput } from "../NodePropInput";

export function NodeElement({ data, ...props }: NodeProps<Node<MENode>>) {
    const inputChange = useCallback((key: any, value: any) => {
        console.log("change", key, value);
        // @TODO add function to update node value in store
    }, [data.props]);
    return <NodeBase 
        {...props}
        data={data}
        icon={<FiActivity />}
    >
        <NodePropInput
            nodeProps={data.props}
            onChange={inputChange}
        />
    </NodeBase>
}
