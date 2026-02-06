'use client';

import React, { useCallback } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    NodeTypes,
    Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useStore } from '@/lib/store';
import { useProjectStore } from '@/lib/useProjectStore';
import { StoryNode } from './StoryNode';
import { Toolbar } from './Toolbar';

const nodeTypes: NodeTypes = {
    story: StoryNode,
};

export function EditorCanvas({ projectId, onOpenSettings }: { projectId: string; onOpenSettings?: () => void }) {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const onNodesChange = useStore((state) => state.onNodesChange);
    const onEdgesChange = useStore((state) => state.onEdgesChange);
    const onConnect = useStore((state) => state.onConnect);
    const setGraph = useStore((state) => state.setGraph);
    const [isSaving, setIsSaving] = React.useState(false);

    const saveProjectData = useProjectStore((state) => state.saveProjectData);
    const getProject = useProjectStore((state) => state.getProject);

    // Load project data
    React.useEffect(() => {
        const project = getProject(projectId);

        if (project?.data) {
            setGraph(project.data.nodes || [], project.data.edges || []);
            return;
        }

        const savedData = localStorage.getItem(`storyboarder-project-${projectId}`);
        if (savedData) {
            try {
                const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedData);
                setGraph(savedNodes || [], savedEdges || []);
            } catch (e) {
                console.error("Failed to load project", e);
                setGraph([], []);
            }
        } else {
            // Default start node if new project
            const defaultNodes = [
                {
                    id: 'start',
                    type: 'story',
                    position: { x: 250, y: 100 },
                    data: { text: 'Start your story here...', image: '' },
                }
            ];
            setGraph(defaultNodes, []);
        }
    }, [projectId, setGraph, getProject]);

    // Save project data (Debounced)
    React.useEffect(() => {
        if (nodes.length === 0 && edges.length === 0) return;

        const data = { nodes, edges };

        const timeoutId = setTimeout(() => {
            setIsSaving(true);
            saveProjectData(projectId, data).finally(() => {
                setTimeout(() => setIsSaving(false), 1000); // Keep indicator for better UX
            });
            localStorage.setItem(`storyboarder-project-${projectId}`, JSON.stringify(data));
        }, 1000); // 1s debounce

        return () => clearTimeout(timeoutId);
    }, [nodes, edges, projectId, saveProjectData]);

    return (
        <div className="h-full w-full bg-white">
            {isSaving && (
                <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm backdrop-blur">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ec3750]" />
                    Saving...
                </div>
            )}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-white"
            >
                <Background gap={12} size={1} />
                <Controls className="bg-white fill-zinc-600 text-zinc-600" />
                <MiniMap
                    className="bg-white"
                    nodeColor={(n) => '#3b82f6'}
                    maskColor="rgba(0,0,0, 0.05)"
                />
                <Panel position="top-center">
                    <Toolbar onOpenSettings={onOpenSettings} />
                </Panel>
            </ReactFlow>
        </div>
    );
}
