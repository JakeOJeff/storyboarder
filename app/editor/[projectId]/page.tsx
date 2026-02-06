'use client';

import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { SettingsModal } from '@/components/editor/SettingsModal';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function EditorPage() {
    const params = useParams();
    const projectId = typeof params?.projectId === 'string' ? params.projectId : '';
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    if (!projectId) return null; // or loading state

    return (
        <div className="h-screen w-screen overflow-hidden">
            <header className="fixed top-0 left-0 z-10 flex w-full items-center justify-between p-4 pointer-events-none">
                <a
                    href="/"
                    className="pointer-events-auto flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur transition-all hover:bg-white hover:text-black dark:bg-black/80 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                >
                    ← Back to Dashboard
                </a>
            </header>

            <EditorCanvas projectId={projectId} onOpenSettings={() => setIsSettingsOpen(true)} />

            <SettingsModal
                projectId={projectId}
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}
