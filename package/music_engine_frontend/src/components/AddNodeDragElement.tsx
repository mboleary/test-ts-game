import { MusicEngineOscillatorNode, SerializedMusicEngineNode } from "music_engine";
import { ReactElement, useCallback } from "react";

export type AddNodeDragElementProps<T extends SerializedMusicEngineNode = SerializedMusicEngineNode> = {
    type: string,
    name: string,
    serializedNodeData?: Partial<Omit<T, "id" | "type" | "name">>
    icon?: ReactElement
};

export const defaultAddNodeDragElementProps: Partial<AddNodeDragElementProps> = {};

export function AddNodeDragElement<
    T extends SerializedMusicEngineNode = SerializedMusicEngineNode
>({ name, icon, type, serializedNodeData }: AddNodeDragElementProps<T>) {

    const onDragStart = useCallback((event: React.DragEvent) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('application/json', JSON.stringify(Object.assign({}, { type, name }, serializedNodeData)));
      }, [serializedNodeData]);

    return <div className="drag-node" 
        onDragStart={(event) => onDragStart(event)} 
        draggable> 
        <span style={{marginRight: "5px"}}>
            { icon }
        </span>
        { name }
    </div>
}