'use client';

import React, { useState } from 'react';
import { X, Type, AlignLeft, Image as ImageIcon, FolderOpen, Save } from 'lucide-react';
import { useProjectStore } from '@/lib/useProjectStore';

interface SettingsModalProps {
    projectId: string;
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ projectId, isOpen, onClose }: SettingsModalProps) {
    const project = useProjectStore((state) => state.projects.find((p) => p.id === projectId));
    const updateProject = useProjectStore((state) => state.updateProject);

    const [gameDir, setGameDir] = useState(project?.gameDirectory || '');
    const [title, setTitle] = useState(project?.title || '');
    const [description, setDescription] = useState(project?.description || '');
    const [thumbnail, setThumbnail] = useState(project?.thumbnailUrl || '');

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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-[600px] rounded-[32px] border border-white/20 bg-white p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-200 ease-out">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">Project Settings</h2>
                        <p className="text-sm font-medium text-slate-500">Configure your storyboard properties</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-slate-100 p-2 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900 active:scale-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Project Name */}
                    <div className="group">
                        <div className="mb-2 flex items-center gap-2">
                            <Type size={16} className="text-[#ec3750]" />
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Project Name</label>
                        </div>
                        <input
                            type="text"
                            className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-300 transition-all focus:border-[#ec3750] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#ec3750]/5"
                            placeholder="e.g. My Awesome Visual Novel"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <AlignLeft size={16} className="text-[#ec3750]" />
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description</label>
                        </div>
                        <textarea
                            className="w-full resize-none rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-300 transition-all focus:border-[#ec3750] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#ec3750]/5"
                            placeholder="Tell us about your story..."
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Thumbnail */}
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <ImageIcon size={16} className="text-[#ec3750]" />
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Thumbnail URL</label>
                            </div>
                            <input
                                type="text"
                                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-300 transition-all focus:border-[#ec3750] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#ec3750]/5"
                                placeholder="https://..."
                                value={thumbnail}
                                onChange={(e) => setThumbnail(e.target.value)}
                            />
                        </div>

                        {/* Game Directory */}
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <FolderOpen size={16} className="text-[#ec3750]" />
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">LÖVE Directory</label>
                            </div>
                            <input
                                type="text"
                                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-300 transition-all focus:border-[#ec3750] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#ec3750]/5"
                                placeholder="C:/Projects/Game"
                                value={gameDir}
                                onChange={(e) => setGameDir(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="mt-10 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-full px-6 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-100 active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 rounded-full bg-[#ec3750] px-8 py-2.5 text-sm font-bold text-white shadow-[0_8px_16px_-4px_rgba(236,55,80,0.4)] transition-all hover:bg-[#d12a3f] hover:shadow-[0_12px_24px_-8px_rgba(236,55,80,0.5)] active:scale-95"
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
