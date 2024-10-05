/**
 * State storage for nodes, interfaces with underlying container to make state consistent
 */

import { applyNodeChanges, applyEdgeChanges, NodeChange, Connection, Node, EdgeChange, Edge, Position } from '@xyflow/react';
import { PortDirection, PortType } from 'music_engine';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { MENode } from '../types/MENodeRepresentation.type';

export type NodeStore = {
    nodes: Node<MENode>[],
    edges: Edge[],

    onNodesChange: (changes: NodeChange<Node<MENode>>[]) => void,
    onEdgesChange: (changes: EdgeChange[]) => void,
    addEdge: (data: Connection) => void,
};

export const useNodeStore = create<NodeStore>()((set, get) => ({
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
        ], }, position: { x: 0, y: 0 }},
        { id: 'b', type: 'ButtonInputNode', data: { nodeType: 'gain', name: 'test', labels: [], ports: [] }, position: { x: 50, y: 50 } },
        { id: 'c', type: 'CanvasNode', data: { nodeType: 'output', name: 'test', labels: [], ports: [
            {id: '2', type: PortType.AUDIO, name: 'aud_in', direction: PortDirection.IN},
        ] }, position: { x: -50, y: 100 } },
        // {id: 'd', type: 'input', data: {id: 'x', name: 'test', type: 'test'}, position: {x: 100, y: 100}},
        // {id: 'e', type: 'output', data: {id: 'x', name: 'test', type: 'test'}, position: {x: 100, y: 100}},
        // {id: 'f', type: 'group', data: {id: 'x', name: 'test', type: 'test'}, position: {x: 100, y: 100}},
        
    ],
    edges: [],

    onNodesChange(changes) {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },

    onEdgesChange(changes) {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },

    addEdge(data) {
        const id = nanoid(6);
        const edge = { id, ...data };

        set({ edges: [edge, ...get().edges] });
    },
}));
