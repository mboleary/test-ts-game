import React, { PropsWithChildren, useMemo } from "react";

import { Node, Handle, Position, NodeProps } from "@xyflow/react";
import { MENode, MENodePortRepresentation } from "../../types/MENodeRepresentation.type";
import { PORT_SPACING } from "../../constants";
import { PortTypeColors, PortTypeKey } from "../../types/PortTypeColors.enum";
import { PortDirection, PortType } from "music_engine";

export type NodeBaseProps = {
    inPorts?: MENodePortRepresentation[],
    outPorts?: MENodePortRepresentation[],
}

export function NodeBase({ children, data, selected, isConnectable, id, type, ...props }: NodeProps<Node<MENode>> & PropsWithChildren & NodeBaseProps) {
    const leftHandles = useMemo(() => {
        return data.ports.filter(port => port.direction === PortDirection.IN).map((item, index) => <Handle 
            key={item.id}
            id={item.name}
            type="target"
            position={Position.Left}
            style={{
                background: PortTypeColors[item.type] || PortTypeColors.INVALID, // @TODO add port colors
                top: PORT_SPACING * (index + 1),
                color: "#666",
                // PortType.PROP
                borderRadius: item.type === 'MIDI' ? 0 : undefined
            }}
            title={item.name}
            isConnectable={isConnectable}
        />) || []
    }, [data.ports, isConnectable]);

    const rightHandles = useMemo(() => {
        return data.ports.filter(port => port.direction === PortDirection.OUT).map((item, index) => <Handle 
            key={item.id}
            id={item.name}
            type="source"
            position={Position.Right}
            style={{
                background: PortTypeColors[item.type] || PortTypeColors.INVALID, // @TODO add port colors
                top: PORT_SPACING * (index + 1),
                color: "#666",
                // PortType.PROP
                borderRadius: item.type === 'MIDI' ? 0 : undefined
            }}
            title={item.name}
            isConnectable={isConnectable}
        />) || []
    }, [data.ports, isConnectable]);

    const mode = leftHandles.length === 0 && rightHandles.length > 0 ? "input" : leftHandles.length > 0 && rightHandles.length === 0 ? "output" : "default";

    return <div className="music-engine-node" style={{ minHeight: PORT_SPACING * (Math.max(leftHandles.length, rightHandles.length) + 2) }}>
        {leftHandles}
        {children ? children : 
            <div className="padding">
                <div>
                    <b>{data.nodeType}</b>
                </div>
                <div>
                    <i>{data.name}</i>
                    {id}
                </div>
            </div>
        }
        <div className="statusbar flex-layout">
            <span className="left flex">{id}</span>
            <span className="right flex">{type}</span>
        </div>
        {rightHandles}
    </div>
}
