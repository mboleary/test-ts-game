import React, { useMemo } from "react";

import { Node, Handle, Position, NodeProps } from "@xyflow/react";
import { MENodeRepresentation } from "../../types/MENodeRepresentation.type";
import { PORT_SPACING } from "../../constants";
import { PortTypeColors, PortTypeKey } from "../../types/PortTypeColors.enum";
import { getHandleIdFromPort } from "../../util/getHandleIdFromPort";
import { PortDirection } from "music_engine";

export function NodeElement({ data, selected, isConnectable, ...props }: NodeProps<Node<MENodeRepresentation>>) {
    const leftHandles = useMemo(() => {
        return data.inPorts.map((item, index) => <Handle 
            key={getHandleIdFromPort(data.id, PortDirection.IN, item.name)}
            id={item.name}
            type="target"
            position={Position.Left}
            style={{
                background: PortTypeColors.INVALID, // @TODO add port colors
                top: PORT_SPACING * (index + 1),
                color: "#666"
            }}
            title={item.name}
            isConnectable={isConnectable}
        />)
    }, [data.inPorts, isConnectable]);

    const rightHandles = useMemo(() => {
        return data.outPorts.map((item, index) => <Handle 
            key={getHandleIdFromPort(data.id, PortDirection.IN, item.name)}
            id={item.name}
            type="source"
            position={Position.Right}
            style={{
                background: PortTypeColors.INVALID, // @TODO add port colors
                top: PORT_SPACING * (index + 1),
                color: "#666"
            }}
            title={item.name}
            isConnectable={isConnectable}
        />)
    }, [data.outPorts, isConnectable]);

    const name = data.constructor.name;
    const mode = leftHandles.length === 0 && rightHandles.length > 0 ? "input" : leftHandles.length > 0 && rightHandles.length === 0 ? "output" : "default";

    return <div className={`react-flow__node-${mode} selectable ${selected ? "selected" : ""}`} style={{ minHeight: PORT_SPACING * Math.max(leftHandles.length, rightHandles.length)}}>
        {leftHandles}
        <div>
            <b>{name}</b>
        </div>
        <div>
            <i>{data.name}</i>
        </div>
        {rightHandles}
    </div>
}
