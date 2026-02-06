'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useProjectStore } from '@/lib/useProjectStore';

interface SettingsModalProps {
    projectId: string;
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ projectId, isOpen, onClose }: SettingsModalProps) {
    const project = useProjectStore((state) => state.projects.find((p) => p.id === projectId));
    const updateProject = useProjectStore((state) => state.updateProject);

    // Local state for inputs
    const [gameDir, setGameDir] = useState(project?.gameDirectory || '');
    const [title, setTitle] = useState(project?.title || '');
    const [description, setDescription] = useState(project?.description || '');
    const [thumbnail, setThumbnail] = useState(project?.thumbnailUrl || '');

    // Sync local state when modal opens or project changes
    React.useEffect(() => {
        if (project) {
            setGameDir(project.gameDirectory || '');
            setTitle(project.title || '');
            setDescription(project.description || '');
            setThumbnail(project.thumbnailUrl || '');
        }
    }, [project, isOpen]);

    const handleSave = () => {
        updateProject(projectId, {
            gameDirectory: gameDir,
            title,
            description,
            thumbnailUrl: thumbnail
        });
        onClose();
    };

    if (!isOpen) return null;

    if (!project) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="w-[400px] rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <p className="text-zinc-600 dark:text-zinc-400">Loading project settings...</p>
                        <button onClick={onClose} className="text-sm text-blue-500 hover:underline">Close</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[500px] rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Project Settings</h2>
                    <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Project Name
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm focus:border-[#ec3750] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                            placeholder="My Awesome Story"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Description
                        </label>
                        <textarea
                            className="w-full resize-none rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm focus:border-[#ec3750] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                            placeholder="A brief description of your project..."
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Thumbnail URL
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm focus:border-[#ec3750] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                            placeholder="https://example.com/image.jpg"
                            value={thumbnail}
                            onChange={(e) => setThumbnail(e.target.value)}
                        />
                    </div>

                    <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Game Directory
                        </label>
                        <p className="mb-2 text-xs text-slate-500">
                            The root folder of your LÖVE game (e.g., C:/Projects/MyGame). This is used to calculate relative paths for images.
                        </p>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm focus:border-[#ec3750] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                placeholder="C:/Path/To/Game"
                                value={gameDir}
                                onChange={(e) => setGameDir(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded-lg bg-[#ec3750] px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
