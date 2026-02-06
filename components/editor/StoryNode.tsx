import React, { useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useStore, StoryNodeData } from '@/lib/store';

// Uses generic NodeProps to satisfy React Flow's NodeTypes requirement
// Helper to get projectId (we need to know which project to get settings from)
import { useParams } from 'next/navigation';
import { useProjectStore } from '@/lib/useProjectStore';

// ... (inside component) ...
export function StoryNode({ id, data, selected }: NodeProps) {
    const updateNodeData = useStore((state) => state.updateNodeData);
    const params = useParams();
    // Safely get project ID from params
    const projectId = typeof params?.projectId === 'string' ? params.projectId : '';

    // Get project settings to know the Game Directory
    const project = useProjectStore((state) => state.projects.find(p => p.id === projectId));

    const storyData = data as unknown as StoryNodeData;

    // Handle File Selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create a fake relative path default
        const relativePath = `images/${file.name}`;

        // Create a local blob URL for immediate preview
        const objectUrl = URL.createObjectURL(file);

        updateNodeData(id, {
            image: objectUrl, // This is for preview (blob)
            // We might want to store the "path" separately if we want to show the Lua path vs the preview path.
            // But for now, let's use the same field or split them.
            // Let's use 'image' for the path (for Lua) and 'preview' for the display if we had it,
            // but the prompt says "display a filepath".
            // So we update the text field with the calculated path.
            // AND we update the preview.
        });

        // Actually, the prompt says "upload an image and then it will preview the image and display a filepath".
        // The blob URL is temporary and won't persist across reloads properly unless we store it in IndexedDB or similar,
        // but for now let's set the text field to the relative path
        // and maybe keep the blob for this session.
        // NOTE: React Flow nodes persist to localStorage. Blob URLs die on refresh.
        // For a seamless experience without a backend, we can't truly "upload".
        // SO: We will set the INPUT value to the relative path `images/filename.png`
        // AND validation relies on the user ensuring the file exists there.
        // For preview, we can show the selected file, but warn on reload it might be broken if not real local path.
        // HOWEVER, the user asked to "preview the image".

        // Let's rely on the user pasting the path mostly, but on "upload" we show the preview of THAT file.
        // We will separate "previewUrl" (runtime only) from "imagePath" (stored string).
        // Since `StoryNodeData` has `image` (string), let's use that for the PATH.
        // We can add `_tempPreview` to data if we want, or just rely on the path if it happens to be valid (unlikely for local file system paths).

        // Simplified approach:
        // 1. User picks file.
        // 2. We generate `images/filename.png`.
        // 3. We set `image` = `images/filename.png`.
        // 4. We set `_preview` = blobUrl (we need to add this to interface or cast/ignore type).

        updateNodeData(id, { image: relativePath, _preview: objectUrl });
    };

    const processPath = (rawPath: string) => {
        if (!project?.gameDirectory) return rawPath;

        // Normalize slashes
        const normalizedGameDir = project.gameDirectory.replace(/\\/g, '/');
        const normalizedRaw = rawPath.replace(/\\/g, '/');

        if (normalizedRaw.startsWith(normalizedGameDir)) {
            // Remove dir + slash
            let rel = normalizedRaw.substring(normalizedGameDir.length);
            if (rel.startsWith('/')) rel = rel.substring(1);
            return rel;
        }
        return rawPath;
    };

    return (
        <div className={`w-[300px] rounded-lg border bg-white shadow-xl transition-all ${selected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-zinc-200'}`}>
            <Handle type="target" position={Position.Top} className="!bg-blue-500" />

            {/* Header */}
            <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-2">
                <span className="text-xs font-semibold uppercase text-zinc-400">Draft Scene Node</span>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 p-4">
                <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-500">Image</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 rounded border border-zinc-200 bg-transparent px-2 py-1 text-xs text-zinc-700 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none"
                            placeholder="images/scene.png"
                            value={storyData.image || ''}
                            onChange={(evt) => updateNodeData(id, { image: processPath(evt.target.value) })}
                            onPaste={(evt) => {
                                evt.preventDefault();
                                const text = evt.clipboardData.getData('text');
                                updateNodeData(id, { image: processPath(text) });
                            }}
                        />
                        <label className="cursor-pointer rounded bg-zinc-100 px-2 py-1 text-xs font-medium hover:bg-zinc-200">
                            Upload
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
                        </label>
                    </div>
                </div>

                {(storyData._preview || storyData.image) && (
                    <div className="relative aspect-video w-full overflow-hidden rounded bg-zinc-100">
                        {/* Prefer the blob preview if available, otherwise try the path (which likely breaks for local paths but works for http) */}
                        <img
                            src={(storyData._preview as string) || storyData.image}
                            alt="Scene"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                // Fallback or hide if broken
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>
                )}

                <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-500">Story Text</label>
                    <textarea
                        className="nodrag h-24 w-full resize-none rounded border border-zinc-200 bg-transparent px-2 py-1 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none"
                        placeholder="What happens in this scene..."
                        value={storyData.text}
                        onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
                    />
                </div>

                {/* Options Section */}
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <label className="text-xs font-medium text-zinc-500">Options</label>
                        <button
                            onClick={() => {
                                const choiceId = crypto.randomUUID();
                                const newOption = { id: choiceId, text: '' };
                                updateNodeData(id, { options: [...(storyData.options || []), newOption] });
                                // Using the same store action for consistency
                                useStore.getState().addChoiceWithConnector(id, choiceId);
                            }}
                            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-blue-500 hover:bg-blue-50"
                        >
                            <Plus size={12} />
                            Add
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        {(storyData.options || []).map((option, index) => (
                            <div key={option.id} className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    className="nodrag flex-1 rounded border border-zinc-200 bg-transparent px-2 py-1 text-xs text-zinc-700 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none"
                                    placeholder={`Option ${index + 1}`}
                                    value={option.text}
                                    onChange={(evt) => {
                                        const newOptions = [...(storyData.options || [])];
                                        newOptions[index] = { ...option, text: evt.target.value };
                                        updateNodeData(id, { options: newOptions });
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        useStore.getState().removeChoiceWithConnector(id, option.id, 'story');
                                    }}
                                    className="text-zinc-400 hover:text-red-500"
                                >
                                    <Trash2 size={12} />
                                </button>
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={option.id}
                                    className="!bg-blue-500 !-right-[5px]"
                                    style={{ top: '50%' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Default Handle (Only if no options) */}
            {(!storyData.options || storyData.options.length === 0) && (
                <Handle type="source" position={Position.Bottom} className="!bg-blue-500" />
            )}
        </div>
    );
}
