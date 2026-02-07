'use client';

import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { SettingsModal } from '@/components/editor/SettingsModal';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = typeof params?.projectId === 'string' ? params.projectId : '';
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    if (!projectId) return null;

    return (
        <div className="h-screen w-screen overflow-hidden bg-white">
            <header className="fixed top-6 left-6 z-50 pointer-events-none">
                <button
                    onClick={() => router.push('/')}
                    className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ec3750] text-white shadow-lg shadow-[#ec3750]/20 transition-all hover:scale-110 hover:bg-[#d12a3f] active:scale-90"
                    title="Back to Dashboard"
                >
                    <LogOut size={20} />
                </button>
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
