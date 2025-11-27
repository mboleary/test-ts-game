import { useCallback, useEffect, useState } from "react";
import { Node, useOnSelectionChange } from "@xyflow/react";
import { NodeStore, useNodeStore } from "../../../state/store";
import { MusicEngineNode } from "music_engine";
import { FiTrash } from "react-icons/fi";

const selector = (store: NodeStore) => ({
    getMusicEngineNode: store.getMusicEngineNode
});

export type NodeEditorProps = {};

export const defaultNodeEditorProps: Partial<NodeEditorProps> = {};

export function NodeEditor({}: NodeEditorProps = defaultNodeEditorProps) {
    const store = useNodeStore(selector);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [meNode, setMeNode] = useState<MusicEngineNode | null>(null);

    const onChange = useCallback(({ nodes }: { nodes: Node[] }) => {
        if (nodes[0]) {
            setSelectedNode(nodes[0]);
            const n = store.getMusicEngineNode(nodes[0].id);
            console.log(n);
            setMeNode(n);
        }
    }, []);

    useOnSelectionChange({ onChange });

    return <>
        <h2>Node Editor</h2>

        <p> Selected Node: 
            <ul>
                <li>ID: <code>{selectedNode?.id}</code></li>
                <li>Type: <i>{selectedNode?.type}</i></li>
            </ul>
        </p>
        <div></div>

        <div>
            <button><FiTrash/> Delete</button>
        </div>

        <hr />
        {
            selectedNode ? <>
                <ObjectList object={selectedNode} />
            </> : <></>
        }
    </>;
}

export type ObjectListProps = {
    object: any
};

export function ObjectList({object}: ObjectListProps) {
    return <ul>
        {
            Object.keys(object).map(k => <li key={k}>
                <b>{k}</b>: 
                {typeof object[k] === 'object' ? <ObjectList object={object[k]} /> : <i>{object[k]}</i>}
            </li>)
        }
    </ul>;
}