import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Plus, Trash2, Download, Check, Settings } from 'lucide-react';
// We'll import the generator later
import { generateLuaCode } from '@/lib/luaGenerator';
import { generateRenpyCode } from '@/lib/renpyGenerator';

export function Toolbar({ onOpenSettings }: { onOpenSettings?: () => void }) {
    const addNode = useStore((state) => state.addNode);
    const addDraftNode = useStore((state) => state.addDraftNode);
    const deleteSelected = useStore((state) => state.deleteSelected);
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);

    const [copiedLua, setCopiedLua] = useState(false);
    const [copiedRenpy, setCopiedRenpy] = useState(false);

    const handleExportLua = () => {
        const code = generateLuaCode(nodes, edges);
        navigator.clipboard.writeText(code).then(() => {
            setCopiedLua(true);
            setTimeout(() => setCopiedLua(false), 2000);
        });
    };

    const handleExportRenpy = () => {
        const code = generateRenpyCode(nodes, edges);
        navigator.clipboard.writeText(code).then(() => {
            setCopiedRenpy(true);
            setTimeout(() => setCopiedRenpy(false), 2000);
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

            <div className="flex gap-1">
                <button
                    onClick={handleExportLua}
                    className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all ${copiedLua ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:opacity-90'}`}
                >
                    {copiedLua ? <Check size={16} /> : <Download size={16} />}
                    {copiedLua ? 'Copied Lua' : 'Export Lua'}
                </button>

                <button
                    onClick={handleExportRenpy}
                    className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all ${copiedRenpy ? 'bg-[#ec3750] text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                >
                    {copiedRenpy ? <Check size={16} /> : <div className="h-4 w-4 rounded-full border-2 border-slate-900/20" />}
                    {copiedRenpy ? 'Copied Ren\'Py' : 'Export Ren\'Py'}
                </button>
            </div>
        </div>
    );
}
