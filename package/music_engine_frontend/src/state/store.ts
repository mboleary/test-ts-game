/**
 * State storage for nodes, interfaces with underlying container to make state consistent
 */

import { applyNodeChanges, applyEdgeChanges, NodeChange, Connection, Node, EdgeChange, Edge, Position } from '@xyflow/react';
import { MusicEngineNode, MusicEngineOscillatorNode, PortDirection, PortType, SequenceNode, Container, SerializedMusicEngineNode, MusicEnginePort, MidiAccess, AudioOutputNode } from 'music_engine';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { MENode, PropType } from '../types/MENodeRepresentation.type';
import { PortTypeColors } from '../types/PortTypeColors.enum';
import { nodeBuilder } from './musicEngineNodeBuilder';
import { getNodeTypeBinding, nodeTypeBindings } from './nodeTypeBindings';

export type PropNodeType = {
    type: string;
    assetName?: string;
    displayValue: string;
}

/**
 * Generate Graph Node data from a Music Engine Node
 * @param node 
 * @returns 
 */
function getNodeData(node: MusicEngineNode): Node<NodeType> {
    return {
        id: node.id,
        type: getNodeTypeBinding(node.type, nodeTypeBindings),
        data: {
            nodeType: node.type,
            name: node.name,
            labels: node.labels,
            ports: (node.getPorts() as MusicEnginePort[]).map(port => ({
                id: port.id,
                type: port.type,
                name: port.name,
                direction: port.direction,
            })),
            props: [],
        },
        position: {x: 0, y: 0},
    };
}

/**
 * Connect Nodes in a container
 * @param container 
 * @param sourceNodeId 
 * @param sourcePortId 
 * @param targetNodeId 
 * @param targetPortId 
 */
function connectNodesInContainer(container: Container, sourceNodeId: string, sourcePortId: string, targetNodeId: string, targetPortId: string) {
    const sourceNode = container.getNode(sourceNodeId);
    const targetNode = container.getNode(targetNodeId);

    if (!sourceNode || !targetNode) throw new Error(`Node(s) not found: ${sourceNodeId} ${targetNodeId}`);

    const sourcePort = sourceNode.getPort(sourcePortId);
    const targetPort = targetNode.getPort(targetPortId);

    if (!sourcePort || !targetPort) throw new Error(`Port(s) not found on nodes: ${sourceNodeId}:${sourcePortId} ${targetNodeId}:${targetPortId}`);

    sourcePort.connect(targetPort);
}

type NodeType = MENode<MusicEngineNode | MusicEngineOscillatorNode | SequenceNode>;

export type NodeStore = {
    nodes: Node<NodeType>[],
    edges: Edge[],

    container: Container,

    midiConnected: boolean,

    onNodesChange: (changes: NodeChange<Node<NodeType>>[]) => void,
    onEdgesChange: (changes: EdgeChange[]) => void,
    addEdge: (data: Connection) => void,
    removeEdge: (id: string) => void,
    addNode: (data: any) => void,
    removeNode: (id: string) => void,
    getMusicEngineNode: <T extends MusicEngineNode>(id: string) => T | null;
    setupMidi: () => Promise<void>;
};

// Construct Container
console.log("building container");
const container = new Container(nodeBuilder);
const audioOutNode = new AudioOutputNode(container.audioContext)
container.registerNode(audioOutNode);

Object.defineProperty(globalThis, "__music_engine_container", {writable: false, value: container});

export const useNodeStore = create<NodeStore>()((set, get) => {
    return {
        nodes: [
            { id: 'a', type: 'defaultNode', data: { nodeType: 'oscillator', name: 'test', labels:[], ports: [
                {id: '1', type: PortType.MIDI, name: 'mid_in', direction: PortDirection.IN},
                {id: '2', type: PortType.AUDIO, name: 'aud_in', direction: PortDirection.IN},
                {id: '3', type: PortType.TRIGGER, name: 'trg_in', direction: PortDirection.IN},
                {id: '4', type: PortType.PARAM, name: 'prm_in', direction: PortDirection.IN},
                {id: '5', type: 'invalid' as PortType, name: 'inv', direction: PortDirection.IN},
                {id: '6', type: PortType.MIDI, name: 'mid_out', direction: PortDirection.OUT},
                {id: '7', type: PortType.AUDIO, name: 'aud_out', direction: PortDirection.OUT},
                {id: '8', type: PortType.TRIGGER, name: 'trg_out', direction: PortDirection.OUT},
                {id: '9', type: PortType.PARAM, name: 'prm_out', direction: PortDirection.OUT},
                {id: '0', type: 'invalid' as PortType, name: 'inv', direction: PortDirection.OUT}
            ], props: [
                {key: 'type', type: PropType.SELECT, possibleValues: ['sine', 'saw', 'square', 'triangle'], value: 'sine'},
                {key: 'velocity' as keyof MusicEngineNode, type: PropType.RANGE, min: 0, max: 100, value: 10},
                {key: 'something' as keyof MusicEngineNode, type: PropType.PORT, direction: PortDirection.IN, value: 'foo'},
                {key: 'something_else' as keyof MusicEngineNode, type: PropType.PORT, direction: PortDirection.OUT, value: 'foo'}
            ] }, position: { x: 0, y: 0 }},
            { id: 'b', type: 'ButtonInputNode', data: { nodeType: 'gain', name: 'test', labels: [], ports: [], props: [] }, position: { x: 50, y: 50 } },
            // { id: 'c', type: 'CanvasNode', data: { nodeType: 'output', name: 'test', labels: [], ports: [
            //     {id: '2', type: PortType.AUDIO, name: 'aud_in', direction: PortDirection.IN},
            // ], props: [] }, position: { x: -50, y: 100 } },
            // {id: 'd', type: 'input', data: {id: 'x', name: 'test', type: 'test'}, position: {x: 100, y: 100}},
            // {id: 'e', type: 'output', data: {id: 'x', name: 'test'r, type: 'test'}, position: {x: 100, y: 100}},
            // {id: 'f', type: 'group', data: {id: 'x', name: 'test', type: 'test'}, position: {x: 100, y: 100}},
            
            // Actual Nodes
            getNodeData(audioOutNode),
        ],
        edges: [],

        midiConnected: false,

        container,

        onNodesChange(changes) {
            console.log("node change", changes);
            set({
                nodes: applyNodeChanges(changes, get().nodes),
            });
        },

        onEdgesChange(changes) {
            console.log(changes);
            set({
                edges: applyEdgeChanges(changes, get().edges),
            });
        },

        addEdge(data) {
            if (!(data && data.sourceHandle && data.targetHandle)) return;
            const id = nanoid(6);
            const sourceNode = get().nodes.filter(node => node.id === data.source)[0];
            const sourcePort = sourceNode?.data.ports.filter(port => port.id === data.sourceHandle)[0];
            const targetNode = get().nodes.filter(node => node.id === data.target)[0];
            const targetPort = targetNode?.data.ports.filter(port => port.id === data.targetHandle)[0];

            console.log(sourceNode, sourcePort, targetNode, targetPort, data);

            // Check for props
            if (sourceNode && targetNode && !sourcePort && !targetPort) {
                const sourceProp = sourceNode?.data.props.filter(prop => prop.key === data.sourceHandle)[0];
                const targetProp = targetNode?.data.props.filter(prop => prop.key === data.sourceHandle)[0];

                if (sourceProp && targetProp) {
                    const edge = { id, ...data, style: {
                        // Set the color based on the source port type
                        stroke: PortTypeColors.PROP
                    } };
                    set({ edges: [edge, ...get().edges] });
                }
                return;
            } else if (!(sourceNode && sourcePort && targetNode && targetPort)) {
                return;
            }

            if (sourcePort.type === targetPort.type || (sourcePort.type === PortType.AUDIO && targetPort.type === PortType.PARAM)) {
                const edge = { id, ...data, style: {
                    // Set the color based on the source port type
                    stroke: PortTypeColors[sourcePort.type]
                } };
                // Connect nodes in container

                connectNodesInContainer(get().container, data.source, data.sourceHandle, data.target, data.targetHandle);

                set({ edges: [edge, ...get().edges] });
            }
        },

        removeEdge(id) {
            const edges = [...get().edges];
            // @TODO actually remove connection from node
            set({edges: edges.filter(edge => edge.id !== id)});
        },

        addNode<T extends SerializedMusicEngineNode>(data: T) {
            const container = get().container;
            const node = container.buildAndRegisterNode(data);
            console.log("added node to container", node, container);
            const nodeData: Node<NodeType> = getNodeData(node);
            set({ nodes: [nodeData, ...get().nodes], container });
        },

        removeNode(id: string) {
            const nodes = [...get().nodes];
            get().container.deleteNode(id);
            set({nodes: nodes.filter(node => node.id !== id)});
        },

        getMusicEngineNode<T extends MusicEngineNode>(id: string): T | null {
            return get().container.getNode(id) as T;
        },

        async setupMidi() {
            if (get().midiConnected) {
                return;
            }
            const c = get().container;
            const midiAccess = await MidiAccess.start(c.audioContext);
            c.registerNode(midiAccess.midiInputNode);
            c.registerNode(midiAccess.midiOutputNode);

            console.log("Midi is setup", midiAccess);

            set({ nodes: [getNodeData(midiAccess.midiInputNode), getNodeData(midiAccess.midiOutputNode), ...get().nodes], midiConnected: true });
        }
    };
});
