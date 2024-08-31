import { createContext } from "react";
import { MENodeRepresentation } from "../../types/MENodeRepresentation.type";
import { Edge, Node } from "@xyflow/react";
import { EdgeReducerAction, NodeReducerAction } from "./reducer";

const noop = () => {console.warn("using noop!")};

export const NodeContext = createContext<Node<MENodeRepresentation>[]>([]);
export const NodeDispatchContext = createContext<React.Dispatch<NodeReducerAction>>(noop);
export const NodeEdgesContext = createContext<Edge[]>([]);
export const NodeEdgesDispatchContext = createContext<React.Dispatch<EdgeReducerAction>>(noop);
