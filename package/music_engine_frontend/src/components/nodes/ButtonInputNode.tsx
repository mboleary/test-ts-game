import React, { useMemo } from "react";

import { Node, Handle, Position, NodeProps } from "@xyflow/react";
import { MENodeRepresentation } from "../../types/MENodeRepresentation.type";
import { PORT_SPACING } from "../../constants";
import { PortTypeColors } from "../../types/PortTypeColors.enum";
import { getHandleIdFromPort } from "../../util/getHandleIdFromPort";
import { PortDirection } from "music_engine";

export function ButtonInputNode({ data, selected, isConnectable, ...props }: NodeProps<Node<MENodeRepresentation>>) {
    const leftHandles = useMemo(() => {
        return data.inPorts?.map((item, index) => <Handle 
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
        return data.outPorts?.map((item, index) => <Handle 
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
        <div className="padding">
            <div>
                <b>{data.type}</b>
            </div>
            <div>
                <i>{data.name}</i>
            </div>
            <div>
                <button type="button" onClick={() => {}} > {data.name} </button>
            </div>
        </div>
        <div className="statusbar">
            {props.id}
            {props.type}
        </div>
        {rightHandles}
    </div>
}
