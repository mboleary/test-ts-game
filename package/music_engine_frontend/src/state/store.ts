/**
 * State storage for nodes, interfaces with underlying container to make state consistent
 */

import { applyNodeChanges, applyEdgeChanges, NodeChange, Connection, Node, EdgeChange, Edge, Position } from '@xyflow/react';
import { PortDirection, PortType } from 'music_engine';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { MENodeRepresentation } from '../types/MENodeRepresentation.type';

export type NodeStore = {
    nodes: Node<MENodeRepresentation>[],
    edges: Edge[],

    onNodesChange: (changes: NodeChange<Node<MENodeRepresentation>>[]) => void,
    onEdgesChange: (changes: EdgeChange[]) => void,
    addEdge: (data: Connection) => void,
};

export const useNodeStore = create<NodeStore>()((set, get) => ({
    nodes: [
        { id: 'a', type: 'default', data: { type: 'oscillator', id: 'a', name: 'test', inPorts: [
            {type: PortType.MIDI, name: 'mid_in', direction: PortDirection.IN},
            {type: PortType.AUDIO, name: 'aud_in', direction: PortDirection.IN},
            {type: PortType.TRIGGER, name: 'trg_in', direction: PortDirection.IN},
            {type: PortType.PARAM, name: 'prm_in', direction: PortDirection.IN},
            {type: 'invalid' as PortType, name: 'inv', direction: PortDirection.IN}
        ], outPorts: [
            {type: PortType.MIDI, name: 'mid_out', direction: PortDirection.OUT},
            {type: PortType.AUDIO, name: 'aud_out', direction: PortDirection.OUT},
            {type: PortType.TRIGGER, name: 'trg_out', direction: PortDirection.OUT},
            {type: PortType.PARAM, name: 'prm_out', direction: PortDirection.OUT},
            {type: 'invalid' as PortType, name: 'inv', direction: PortDirection.OUT}
        ] }, position: { x: 0, y: 0 }},
        { id: 'b', type: 'ButtonInputNode', data: { type: 'gain', id: 'b', name: 'test' }, position: { x: 50, y: 50 } },
        { id: 'c', data: { type: 'output', id: 'c', name: 'test' }, position: { x: -50, y: 100 } },
        {id: 'd', type: 'input', data: {id: 'x', name: 'test', type: 'test'}, position: {x: 100, y: 100}},
        {id: 'e', type: 'output', data: {id: 'x', name: 'test', type: 'test'}, position: {x: 100, y: 100}},
        {id: 'f', type: 'group', data: {id: 'x', name: 'test', type: 'test'}, position: {x: 100, y: 100}},

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
