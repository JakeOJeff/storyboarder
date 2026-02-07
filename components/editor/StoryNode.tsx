import React, { useCallback, useState } from 'react';
import { Plus, Trash2, Image, Music, MessageSquare, Zap, ChevronDown, ChevronRight, User } from 'lucide-react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useStore, StoryNodeData, DialogueEntry, StoryNodeChoice } from '@/lib/store';
import { useParams } from 'next/navigation';
import { useProjectStore } from '@/lib/useProjectStore';

export function StoryNode({ id, data, selected }: NodeProps) {
    const updateNodeData = useStore((state) => state.updateNodeData);
    const params = useParams();
    const projectId = typeof params?.projectId === 'string' ? params.projectId : '';
    const project = useProjectStore((state) => state.projects.find(p => p.id === projectId));

    const storyData = data as unknown as StoryNodeData;

    // Local state for toggling sections (optional, but keeps it tidy)
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        visuals: true,
        audio: false,
        dialogue: true,
        choices: true,
        logic: false
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const processPath = (rawPath: string) => {
        if (!project?.gameDirectory) return rawPath;
        const normalizedGameDir = project.gameDirectory.replace(/\\/g, '/');
        const normalizedRaw = rawPath.replace(/\\/g, '/');
        if (normalizedRaw.startsWith(normalizedGameDir)) {
            let rel = normalizedRaw.substring(normalizedGameDir.length);
            if (rel.startsWith('/')) rel = rel.substring(1);
            return rel;
        }
        return rawPath;
    };

    const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const relativePath = `images/bg/${file.name}`;
        const objectUrl = URL.createObjectURL(file);
        updateNodeData(id, {
            visuals: { ...storyData.visuals, background: relativePath, _bgPreview: objectUrl }
        });
    };

    const handleDialogueImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const relativePath = `images/dialogue/${file.name}`;
        const objectUrl = URL.createObjectURL(file);

        const newDialogue = [...storyData.dialogue];
        newDialogue[index] = { ...newDialogue[index], image: relativePath, _preview: objectUrl };
        updateNodeData(id, { dialogue: newDialogue });
    };

    const sectionHeader = (title: string, key: string, icon: React.ReactNode) => (
        <div
            className="flex cursor-pointer items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-3 py-1.5 hover:bg-zinc-100"
            onClick={() => toggleSection(key)}
        >
            <div className="flex items-center gap-2">
                <span className="text-zinc-400">{icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{title}</span>
            </div>
            {expandedSections[key] ? <ChevronDown size={14} className="text-zinc-400" /> : <ChevronRight size={14} className="text-zinc-400" />}
        </div>
    );

    return (
        <div className={`w-[350px] rounded-xl border bg-white shadow-2xl transition-all ${selected ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-zinc-200'}`}>
            <Handle type="target" position={Position.Top} className="!h-3 !w-3 !bg-indigo-500" />

            {/* Title / Header */}
            <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3">
                <input
                    className="w-full bg-transparent text-sm font-bold text-zinc-800 placeholder:text-zinc-300 focus:outline-none"
                    placeholder="Scene Title..."
                    value={storyData.title || ''}
                    onChange={(e) => updateNodeData(id, { title: e.target.value })}
                />
            </div>

            <div className="max-h-[600px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-zinc-200">
                {/* Visuals Section */}
                {sectionHeader('Visuals', 'visuals', <Image size={14} />)}
                {expandedSections.visuals && (
                    <div className="space-y-3 p-3">
                        <div>
                            <label className="mb-1 block text-[10px] font-medium text-zinc-400">Background</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                                    placeholder="bg/beach.png"
                                    value={storyData.visuals.background}
                                    onChange={(e) => updateNodeData(id, { visuals: { ...storyData.visuals, background: processPath(e.target.value) } })}
                                />
                                <label className="flex items-center justify-center rounded border border-zinc-200 bg-white px-2 py-1 text-xs hover:bg-zinc-50 cursor-pointer">
                                    <Plus size={14} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleBgUpload} />
                                </label>
                            </div>
                            {storyData.visuals._bgPreview && (
                                <img src={storyData.visuals._bgPreview} className="mt-2 h-20 w-full rounded object-cover border border-zinc-100" />
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-[10px] font-medium text-zinc-400">Characters (JSON array)</label>
                            <input
                                type="text"
                                className="w-full rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                                placeholder='["eileen happy", "john sad"]'
                                value={JSON.stringify(storyData.visuals.characters)}
                                onChange={(e) => {
                                    try {
                                        const chars = JSON.parse(e.target.value);
                                        if (Array.isArray(chars)) updateNodeData(id, { visuals: { ...storyData.visuals, characters: chars } });
                                    } catch (err) { }
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Audio Section */}
                {sectionHeader('Audio', 'audio', <Music size={14} />)}
                {expandedSections.audio && (
                    <div className="space-y-2 p-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="mb-1 block text-[10px] font-medium text-zinc-400">BGM</label>
                                <input
                                    type="text"
                                    className="w-full rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                                    placeholder="music/main.mp3"
                                    value={storyData.audio.bgm}
                                    onChange={(e) => updateNodeData(id, { audio: { ...storyData.audio, bgm: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-[10px] font-medium text-zinc-400">SFX</label>
                                <input
                                    type="text"
                                    className="w-full rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                                    placeholder="sfx/click.wav"
                                    value={storyData.audio.sfx}
                                    onChange={(e) => updateNodeData(id, { audio: { ...storyData.audio, sfx: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Dialogue Section */}
                {sectionHeader('Dialogue', 'dialogue', <MessageSquare size={14} />)}
                {expandedSections.dialogue && (
                    <div className="space-y-4 p-3">
                        {storyData.dialogue.map((entry, idx) => (
                            <div key={idx} className="relative space-y-2 rounded-lg border border-zinc-100 bg-zinc-50/30 p-2">
                                <button
                                    className="absolute -right-2 -top-2 rounded-full bg-white p-1 text-zinc-400 shadow-sm hover:text-red-500"
                                    onClick={() => {
                                        const newD = [...storyData.dialogue];
                                        newD.splice(idx, 1);
                                        updateNodeData(id, { dialogue: newD });
                                    }}
                                >
                                    <Trash2 size={12} />
                                </button>
                                <div className="flex gap-2">
                                    <div className="w-1/3">
                                        <label className="mb-1 block text-[10px] font-medium text-zinc-400">Speaker</label>
                                        <input
                                            className="w-full rounded border border-zinc-200 bg-white px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                                            value={entry.speaker}
                                            placeholder="Eileen"
                                            onChange={(e) => {
                                                const newD = [...storyData.dialogue];
                                                newD[idx] = { ...entry, speaker: e.target.value };
                                                updateNodeData(id, { dialogue: newD });
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="mb-1 block text-[10px] font-medium text-zinc-400">Animation</label>
                                        <select
                                            className="w-full rounded border border-zinc-200 bg-white px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                                            value={entry.animation || ''}
                                            onChange={(e) => {
                                                const newD = [...storyData.dialogue];
                                                newD[idx] = { ...entry, animation: e.target.value };
                                                updateNodeData(id, { dialogue: newD });
                                            }}
                                        >
                                            <option value="">Default</option>
                                            <option value="fade">Fade In</option>
                                            <option value="zoom">Zoom</option>
                                            <option value="shake">Shake</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1 block text-[10px] font-medium text-zinc-400">Text</label>
                                    <textarea
                                        className="nodrag h-16 w-full resize-none rounded border border-zinc-200 bg-white px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                                        value={entry.text}
                                        onChange={(e) => {
                                            const newD = [...storyData.dialogue];
                                            newD[idx] = { ...entry, text: e.target.value };
                                            updateNodeData(id, { dialogue: newD });
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="flex cursor-pointer items-center gap-1 rounded bg-white px-2 py-1 text-[10px] border border-zinc-200 hover:bg-zinc-50">
                                        <Plus size={10} /> Image
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleDialogueImageUpload(idx, e)} />
                                    </label>
                                    {entry._preview && (
                                        <img src={entry._preview} className="h-6 w-6 rounded object-cover" />
                                    )}
                                    <span className="truncate text-zinc-400 text-[10px]">{entry.image}</span>
                                </div>
                            </div>
                        ))}
                        <button
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-200 py-2 text-xs text-zinc-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30"
                            onClick={() => updateNodeData(id, { dialogue: [...storyData.dialogue, { speaker: '', text: '' }] })}
                        >
                            <Plus size={14} /> Add Dialogue Line
                        </button>
                    </div>
                )}

                {/* Choices Section */}
                {sectionHeader('Choices', 'choices', <User size={14} />)}
                {expandedSections.choices && (
                    <div className="space-y-2 p-3">
                        {storyData.choices.map((choice, idx) => (
                            <div key={choice.id} className="relative flex items-center gap-2">
                                <input
                                    className="nodrag flex-1 rounded border border-zinc-200 bg-white px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                                    placeholder={`Choice ${idx + 1}`}
                                    value={choice.text}
                                    onChange={(e) => {
                                        const newC = [...storyData.choices];
                                        newC[idx] = { ...choice, text: e.target.value };
                                        updateNodeData(id, { choices: newC });
                                    }}
                                />
                                <button
                                    className="text-zinc-300 hover:text-red-500"
                                    onClick={() => useStore.getState().removeChoiceWithConnector(id, choice.id, 'story')}
                                >
                                    <Trash2 size={12} />
                                </button>
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={choice.id}
                                    className="!h-2.5 !w-2.5 !bg-indigo-500 !-right-[5px]"
                                    style={{ top: '50%' }}
                                />
                            </div>
                        ))}
                        <button
                            className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 hover:text-indigo-600"
                            onClick={() => {
                                const choiceId = crypto.randomUUID();
                                updateNodeData(id, { choices: [...(storyData.choices || []), { id: choiceId, text: '' }] });
                            }}
                        >
                            <Plus size={12} /> ADD CHOICE
                        </button>
                    </div>
                )}

                {/* Logic Section */}
                {sectionHeader('Logic', 'logic', <Zap size={14} />)}
                {expandedSections.logic && (
                    <div className="space-y-2 p-3">
                        <div>
                            <label className="mb-1 block text-[10px] font-medium text-zinc-400">Conditions (JSON)</label>
                            <input
                                className="w-full rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] focus:border-indigo-500 focus:outline-none font-mono"
                                value={JSON.stringify(storyData.logic.conditions)}
                                onChange={(e) => {
                                    try {
                                        const conds = JSON.parse(e.target.value);
                                        updateNodeData(id, { logic: { ...storyData.logic, conditions: conds } });
                                    } catch (err) { }
                                }}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[10px] font-medium text-zinc-400">Effects (JSON)</label>
                            <input
                                className="w-full rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] focus:border-indigo-500 focus:outline-none font-mono"
                                value={JSON.stringify(storyData.logic.effects)}
                                onChange={(e) => {
                                    try {
                                        const effs = JSON.parse(e.target.value);
                                        updateNodeData(id, { logic: { ...storyData.logic, effects: effs } });
                                    } catch (err) { }
                                }}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[10px] font-medium text-zinc-400">Python Logic</label>
                            <textarea
                                className="nodrag h-20 w-full resize-none rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] focus:border-indigo-500 focus:outline-none font-mono"
                                placeholder="if gold > 10: ..."
                                value={storyData.logic.python}
                                onChange={(e) => updateNodeData(id, { logic: { ...storyData.logic, python: e.target.value } })}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Default Handle (Only if no choices) */}
            {storyData.choices.length === 0 && (
                <Handle type="source" position={Position.Bottom} className="!h-3 !w-3 !bg-indigo-500" />
            )}
        </div>
    );
}
