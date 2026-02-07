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

export interface DialogueEntry {
    speaker: string;
    text: string;
    image?: string;
    animation?: string;
    _preview?: string; // For local UI preview
}

export interface StoryNodeChoice {
    id: string;
    text: string;
    targetNodeId?: string;
}

export interface StoryNodeData extends Record<string, unknown> {
    title: string;
    visuals: {
        background: string;
        _bgPreview?: string;
        characters: string[];
        transition: string;
    };
    audio: {
        bgm: string;
        sfx: string;
    };
    dialogue: DialogueEntry[];
    choices: StoryNodeChoice[];
    logic: {
        conditions: any[];
        effects: any[];
        python: string;
    };
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
            title: 'Start Scene',
            visuals: {
                background: '',
                characters: [],
                transition: 'none'
            },
            audio: {
                bgm: '',
                sfx: ''
            },
            dialogue: [
                { speaker: 'Narrator', text: 'Start your story here...' }
            ],
            choices: [],
            logic: {
                conditions: [],
                effects: [],
                python: ''
            }
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
                const choiceIndex = data.choices?.findIndex(o => o.id === sourceHandle);

                if (choiceIndex !== undefined && choiceIndex !== -1) {
                    const newChoices = [...(data.choices || [])];
                    newChoices[choiceIndex] = { ...newChoices[choiceIndex], targetNodeId: target };
                    get().updateNodeData(source, { choices: newChoices });
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
            data: {
                title: 'New Draft Scene',
                visuals: {
                    background: '',
                    characters: [],
                    transition: 'none'
                },
                audio: {
                    bgm: '',
                    sfx: ''
                },
                dialogue: [],
                choices: [],
                logic: {
                    conditions: [],
                    effects: [],
                    python: ''
                }
            },
        };
        set({ nodes: [...get().nodes, newNode] });
    },
    removeChoiceWithConnector: (nodeId: string, choiceId: string, type: 'story') => {
        const node = get().nodes.find(n => n.id === nodeId);
        if (node) {
            const data = node.data as StoryNodeData;
            const newChoices = (data.choices || []).filter(o => o.id !== choiceId);
            get().updateNodeData(nodeId, { choices: newChoices });
        }

        // Also clean up any edges associated with this choice handle
        set({
            edges: get().edges.filter(e => e.sourceHandle !== choiceId)
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
