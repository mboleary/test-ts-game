import { Edge, Node, XYPosition } from "@xyflow/react";
import { MENodeRepresentation } from "../../types/MENodeRepresentation.type";

import { nanoid } from "nanoid";

export type NodeReducerAction = {
    type: "create" | "update" | "delete";
    payload: Node<MENodeRepresentation>
    // payload: Omit<MENodeRepresentation, 'inPorts' | 'outPorts'>;
};

// @TODO use whatever react flow type is used here
export function nodeReducer(nodes: Node<MENodeRepresentation>[], action: NodeReducerAction): Node<MENodeRepresentation>[] {
    switch (action.type) {
        case "create":
            return [
                ...nodes,
                {
                    id: nanoid(),
                    type: action.payload.type,
                    data: {...action.payload.data},
                    position: {...action.payload.position}
                }
            ];
        case "update":
            return [...nodes];
        case "delete":
            return [...(nodes.filter(n => n.id !== action.payload.id))];
        default:
            throw new Error(`Unknown Action ${action.type}`);
    }
}

export type EdgeReducerAction = {
    type: "connect" | "disconnect";
} & Edge;

export function edgeReducer(edges: Edge[], action: EdgeReducerAction): Edge[] {
    switch (action.type) {
        case "connect":
            return [
                ...edges,
                {
                    id: nanoid(),
                    type: action.type,
                    source: action.source,
                    sourceHandle: action.sourceHandle,
                    target: action.target,
                    targetHandle: action.targetHandle,
                }
            ];
        case "disconnect":
            return [...(edges.filter(e => e.id !== action.id))];
        default:
            throw new Error(`Unknown Action ${action.type}`);
    }
}
