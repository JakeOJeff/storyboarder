import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Plus, Trash2, Download, Check, Settings } from 'lucide-react';
// We'll import the generator later
import { generateLuaCode } from '@/lib/luaGenerator';

export function Toolbar({ onOpenSettings }: { onOpenSettings?: () => void }) {
    const addNode = useStore((state) => state.addNode);
    const addDraftNode = useStore((state) => state.addDraftNode);
    const deleteSelected = useStore((state) => state.deleteSelected);
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);

    const [copied, setCopied] = useState(false);

    const handleExport = () => {
        const code = generateLuaCode(nodes, edges);
        console.log(code);
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            alert("Lua code copied to clipboard! Check console for full output.");
        });
    };

    return (
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 p-2 shadow-xl backdrop-blur-sm">
            <button
                onClick={addDraftNode}
                className="flex items-center justify-center rounded-full bg-[#ec3750] px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 uppercase tracking-tighter"
                title="Add Scene"
            >
                <Plus size={18} className="mr-1" />
                SCENE
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            <button
                onClick={deleteSelected}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-red-100 hover:text-red-600"
                title="Delete Selected"
            >
                <Trash2 size={20} />
            </button>

            {onOpenSettings && (
                <button
                    onClick={onOpenSettings}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                    title="Project Settings"
                >
                    <Settings size={20} />
                </button>
            )}

            <div className="h-6 w-px bg-slate-200"></div>

            <button
                onClick={handleExport}
                className="flex h-10 items-center gap-2 rounded-full bg-slate-900 pl-4 pr-5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
                {copied ? <Check size={16} /> : <Download size={16} />}
                {copied ? 'Copied' : 'Export Lua'}
            </button>
        </div>
    );
}
