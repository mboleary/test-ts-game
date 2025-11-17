import { useCallback, useState } from "react";
import { Node, useOnSelectionChange } from "@xyflow/react";

export type NodeEditorProps = {};

export const defaultNodeEditorProps: Partial<NodeEditorProps> = {};

export function NodeEditor({}: NodeEditorProps = defaultNodeEditorProps) {

    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const onChange = useCallback(({ nodes }: { nodes: Node[] }) => {
        setSelectedNode(nodes[0]);
    }, []);

    useOnSelectionChange({ onChange });

    return <>
        <p>Node Editor</p>

        <div> Selected Node {selectedNode?.id} </div>
    </>;
}