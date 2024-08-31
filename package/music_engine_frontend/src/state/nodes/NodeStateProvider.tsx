import React, { useReducer } from 'react';
import { edgeReducer, nodeReducer } from './reducer';
import { NodeContext, NodeDispatchContext, NodeEdgesContext, NodeEdgesDispatchContext } from './context';

export type NodeStateProviderProps = {
    children: React.ReactElement | React.ReactElement[]
}

export function NodeStateProvider({children}: NodeStateProviderProps) {
    const [nodes, nodesDispatch] = useReducer(nodeReducer, []);
    const [edges, edgesDispatch] = useReducer(edgeReducer, []);

    return (
        <NodeContext.Provider value={nodes}>
            <NodeDispatchContext.Provider value={nodesDispatch}>
                <NodeEdgesContext.Provider value={edges}>
                    <NodeEdgesDispatchContext.Provider value={edgesDispatch}>
                        {children}
                    </NodeEdgesDispatchContext.Provider>
                </NodeEdgesContext.Provider>
            </NodeDispatchContext.Provider>
        </NodeContext.Provider>
    )
}
