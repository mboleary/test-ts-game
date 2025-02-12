import React, { PropsWithChildren, ReactElement, useMemo } from "react";

import { Node, Handle, Position, NodeProps } from "@xyflow/react";
import { MENode, MENodePortRepresentation, PropType } from "../../types/MENodeRepresentation.type";
import { PortTypeColors, PortTypeKey } from "../../types/PortTypeColors.enum";
import { PortDirection, PortType } from "music_engine";

export const PORT_SPACING = 15;
export const PORT_TOP_OFFSET = PORT_SPACING;
export const PORT_BOTTOM_OFFSET = PORT_SPACING * 2;

export type NodeBaseProps = {
    icon?: ReactElement;
    showTitlebar?: boolean;
    titlebarButton?: ReactElement;
}

export function NodeBase({ children, data, selected, isConnectable, id, type, icon, showTitlebar = true, titlebarButton, ...props }: NodeProps<Node<MENode>> & PropsWithChildren & NodeBaseProps) {
    const leftPortHandles = useMemo(() => {
        return data.ports.filter(port => port.direction === PortDirection.IN).map((item, index) => <Handle 
            key={item.id}
            id={item.id}
            type="target"
            position={Position.Left}
            style={{
                background: PortTypeColors[item.type] || PortTypeColors.INVALID, // @TODO add port colors
                top: (showTitlebar ? PORT_TOP_OFFSET : 0) + (PORT_SPACING * (index + 1)),
                color: "#666",
                // PortType.PROP
                // borderRadius: item.type === 'MIDI' ? 0 : undefined
            }}
            title={item.name}
            isConnectable={isConnectable}
        />) || []
    }, [data.ports, isConnectable]);

    const leftPropHandles = useMemo(() => {
        const offset = leftPortHandles.length;
        return data.props.filter(prop => prop.type === PropType.PORT && prop.direction === PortDirection.IN).map((item, index) => <Handle 
            key={item.key}
            id={item.key}
            type="target"
            position={Position.Left}
            style={{
                background: PortTypeColors.PROP,
                top: (showTitlebar ? PORT_TOP_OFFSET : 0) + (PORT_SPACING * (index + 1 + offset)),
                color: "#666",
                // PortType.PROP
                borderRadius: 0,
            }}
            title={item.key}
            isConnectable={isConnectable}
        />) || []
    }, [data.props, leftPortHandles, isConnectable]);

    const rightPortHandles = useMemo(() => {
        return data.ports.filter(port => port.direction === PortDirection.OUT).map((item, index) => <Handle 
            key={item.id}
            id={item.id}
            type="source"
            position={Position.Right}
            style={{
                background: PortTypeColors[item.type] || PortTypeColors.INVALID, // @TODO add port colors
                top: (showTitlebar ? PORT_TOP_OFFSET : 0) + (PORT_SPACING * (index + 1)),
                color: "#666",
                // PortType.PROP
                // borderRadius: item.type === 'MIDI' ? 0 : undefined
            }}
            title={item.name}
            isConnectable={isConnectable}
        />) || []
    }, [data.ports, isConnectable]);

    const rightPropHandles = useMemo(() => {
        const offset = rightPortHandles.length;
        return data.props.filter(prop => prop.type === PropType.PORT && prop.direction === PortDirection.OUT).map((item, index) => <Handle 
            key={item.key}
            id={item.key}
            type="source"
            position={Position.Right}
            style={{
                background: PortTypeColors.PROP,
                top: (showTitlebar ? PORT_TOP_OFFSET : 0) + (PORT_SPACING * (index + 1 + offset)),
                color: "#666",
                // PortType.PROP
                borderRadius: 0,
            }}
            title={item.key}
            isConnectable={isConnectable}
        />) || []
    }, [data.props, rightPortHandles, isConnectable]);

    const mode = leftPortHandles.length + leftPropHandles.length === 0 && rightPortHandles.length + rightPropHandles.length > 0 ? "input" : leftPortHandles.length + leftPropHandles.length > 0 && rightPortHandles.length + rightPropHandles.length === 0 ? "output" : "default";

    return <div className="music-engine-node" style={{ minHeight: PORT_SPACING * (Math.max(leftPortHandles.length + leftPropHandles.length, rightPortHandles.length + rightPropHandles.length)) + PORT_BOTTOM_OFFSET }}>
        {leftPortHandles}
        {leftPropHandles}
        {showTitlebar ? 
            <div className="titlebar flex-layout">
                <span className="title" title={data.nodeType}>{data.name || data.nodeType}</span>
                {icon ? <div className="icon">{icon}</div> : <></>}
                <div className="flex" />
                {titlebarButton ? <div className="right-slot">{titlebarButton}</div> : <></>}
            </div> : <></>
        }
        {children ? children : 
            <>
                <div className="padding">
                    <div>
                        <i>{data.name}</i>
                        {id}
                    </div>
                </div>
            </>
        }
        <div className="statusbar flex-layout">
            <span className="left flex">{id}</span>
            <span className="right flex">{data.nodeType}</span>
        </div>
        {rightPortHandles}
        {rightPropHandles}
    </div>
}
