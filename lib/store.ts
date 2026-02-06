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
    description?: string;
    _preview?: string;
    options?: { id: string; text: string; targetNodeId?: string }[];
}

export type StoryNode = Node<StoryNodeData>;

interface EditorState {
    nodes: StoryNode[];
    edges: Edge[];
    onNodesChange: OnNodesChange<StoryNode>;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    addNode: () => void;
    addDraftNode: () => void;
    addChoiceWithConnector: (sourceId: string, handleId: string) => void;
    removeChoiceWithConnector: (nodeId: string, choiceId: string, type: 'story') => void;
    updateNodeData: (id: string, data: Partial<StoryNodeData>) => void;
    deleteSelected: () => void;
    setGraph: (nodes: StoryNode[], edges: Edge[]) => void;
}

export const defaultNodes: StoryNode[] = [
    {
        id: 'start',
        type: 'story',
        position: { x: 250, y: 100 },
        data: {
            text: 'Start your story here...',
            image: '',
            options: []
        },
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
        const { source, sourceHandle, target } = connection;

        // If it's a connection from a specific handle (like a choice)
        if (sourceHandle) {
            const nodes = get().nodes;
            const sourceNode = nodes.find(n => n.id === source);

            if (sourceNode) {
                const data = sourceNode.data as StoryNodeData;
                const optionIndex = data.options?.findIndex(o => o.id === sourceHandle);

                if (optionIndex !== undefined && optionIndex !== -1) {
                    const newOptions = [...(data.options || [])];
                    newOptions[optionIndex] = { ...newOptions[optionIndex], targetNodeId: target };
                    get().updateNodeData(source, { options: newOptions });
                }
            }
        }

        set({
            edges: addEdge(connection, get().edges),
        });
    },
    addNode: () => {
        get().addDraftNode();
    },
    addDraftNode: () => {
        const id = `node-${Date.now()}`;
        const newNode: StoryNode = {
            id,
            type: 'story',
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: { text: 'New Draft Scene', image: '', options: [] },
        };
        set({ nodes: [...get().nodes, newNode] });
    },
    addChoiceWithConnector: (sourceId: string, handleId: string) => {
        const connectorId = `connector-${handleId}`;
        const sourceNode = get().nodes.find(n => n.id === sourceId);
        if (!sourceNode) return;

        const connectorNode: StoryNode = {
            id: connectorId,
            type: 'connector',
            position: { x: 370, y: 150 }, // Relative to parent
            parentId: sourceId,
            extent: 'parent',
            draggable: false, // Keep it fixed relative to parent
            data: {} as any,
        };

        const newEdge: Edge = {
            id: `edge-${handleId}`,
            source: sourceId,
            sourceHandle: handleId,
            target: connectorId,
            type: 'smoothstep',
            animated: true,
        };

        set({
            nodes: [...get().nodes, connectorNode],
            edges: [...get().edges, newEdge],
        });
    },
    removeChoiceWithConnector: (nodeId: string, choiceId: string, type: 'story') => {
        const connectorId = `connector-${choiceId}`;

        // 1. Remove from node data
        const node = get().nodes.find(n => n.id === nodeId);
        if (node) {
            const data = node.data as StoryNodeData;
            const newOptions = (data.options || []).filter(o => o.id !== choiceId);
            get().updateNodeData(nodeId, { options: newOptions });
        }

        // 2. Remove connector node and edges
        set({
            nodes: get().nodes.filter(n => n.id !== connectorId),
            edges: get().edges.filter(e => e.sourceHandle !== choiceId && e.target !== connectorId)
        });
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
