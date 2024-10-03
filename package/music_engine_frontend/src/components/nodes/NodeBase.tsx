import React, { PropsWithChildren, useMemo } from "react";

import { Node, Handle, Position, NodeProps } from "@xyflow/react";
import { MENodePortRepresentation, MENodeRepresentation } from "../../types/MENodeRepresentation.type";
import { PORT_SPACING } from "../../constants";
import { PortTypeColors, PortTypeKey } from "../../types/PortTypeColors.enum";
import { getHandleIdFromPort } from "../../util/getHandleIdFromPort";
import { PortDirection } from "music_engine";

export type NodeBaseProps = {
    inPorts?: MENodePortRepresentation[],
    outPorts?: MENodePortRepresentation[],
}

export function NodeBase({ children, inPorts, outPorts, data, selected, isConnectable, id, type, ...props }: NodeProps<Node<MENodeRepresentation>> & PropsWithChildren & NodeBaseProps) {
    const leftHandles = useMemo(() => {
        return inPorts?.map((item, index) => <Handle 
            key={getHandleIdFromPort(data.id, PortDirection.IN, item.name)}
            id={item.name}
            type="target"
            position={Position.Left}
            style={{
                background: PortTypeColors[item.type] || PortTypeColors.INVALID, // @TODO add port colors
                top: PORT_SPACING * (index + 1),
                color: "#666"
            }}
            title={item.name}
            isConnectable={isConnectable}
        />) || []
    }, [data.inPorts, isConnectable]);

    const rightHandles = useMemo(() => {
        return outPorts?.map((item, index) => <Handle 
            key={getHandleIdFromPort(data.id, PortDirection.IN, item.name)}
            id={item.name}
            type="source"
            position={Position.Right}
            style={{
                background: PortTypeColors[item.type] || PortTypeColors.INVALID, // @TODO add port colors
                top: PORT_SPACING * (index + 1),
                color: "#666"
            }}
            title={item.name}
            isConnectable={isConnectable}
        />) || []
    }, [data.outPorts, isConnectable]);

    // const mode = leftHandles.length === 0 && rightHandles.length > 0 ? "input" : leftHandles.length > 0 && rightHandles.length === 0 ? "output" : "default";

    return <div className="music-engine-node" style={{ minHeight: PORT_SPACING * Math.max(leftHandles.length, rightHandles.length)}}>
        {leftHandles}
        {children}
        <div className="padding">
            <div>
                <b>{data.type}</b>
            </div>
            <div>
                <i>{data.name}</i>
                {id}
            </div>
        </div>
        {rightHandles}
    </div>
}
