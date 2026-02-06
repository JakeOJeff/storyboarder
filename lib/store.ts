import { create } from 'zustand';
import {
    Edge,
    Node,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Connection,
} from '@xyflow/react';

export interface StoryNodeData extends Record<string, unknown> {
    text: string;
    image?: string;
    _preview?: string;
    options?: { id: string; text: string }[];
}

export type StoryNode = Node<StoryNodeData>;

interface EditorState {
    nodes: StoryNode[];
    edges: Edge[];
    onNodesChange: OnNodesChange<StoryNode>;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    addNode: () => void;
    updateNodeData: (id: string, data: Partial<StoryNodeData>) => void;
    deleteSelected: () => void;
    setGraph: (nodes: StoryNode[], edges: Edge[]) => void;
}

export const defaultNodes: StoryNode[] = [
    {
        id: 'start',
        type: 'story',
        position: { x: 250, y: 100 },
        data: { text: 'Start your story here...', image: '' },
    }
];

export const useStore = create<EditorState>((set, get) => ({
    nodes: defaultNodes,
    edges: [],
    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    onConnect: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges),
        });
    },
    addNode: () => {
        const id = `node-${Date.now()}`;
        const newNode: StoryNode = {
            id,
            type: 'story',
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: { text: 'New Scene', image: '' },
        };
        set({ nodes: [...get().nodes, newNode] });
    },
    updateNodeData: (id, data) => {
        set({
            nodes: get().nodes.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, ...data } } : node
            ),
        });
    },
    deleteSelected: () => {
        const nodesToDelete = get().nodes.filter(n => n.selected).map(n => n.id);
        const edgesToDelete = get().edges.filter(e => e.selected).map(e => e.id);

        if (nodesToDelete.length === 0 && edgesToDelete.length === 0) return;

        set({
            nodes: get().nodes.filter(n => !n.selected),
            edges: get().edges.filter(e => !e.selected)
        });
    },
    setGraph: (nodes: StoryNode[], edges: Edge[]) => {
        set({ nodes, edges });
    },
}));
