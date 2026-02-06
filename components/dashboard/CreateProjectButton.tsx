'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/lib/useProjectStore';

export function CreateProjectButton() {
    const addProject = useProjectStore((state) => state.addProject);
    const router = useRouter();

    const handleCreateProject = () => {
        const newProjectId = crypto.randomUUID();
        const newProject = {
            id: newProjectId,
            title: 'Untitled Project',
            lastModified: new Date().toISOString(),
            description: 'A new creative adventure.',
        };

        addProject(newProject);
        router.push(`/editor/${newProjectId}`);
    };

    return (
        <button
            onClick={handleCreateProject}
            className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 transition-all hover:border-[#ec3750] hover:bg-slate-50 min-h-[250px] w-full"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-500 transition-transform group-hover:scale-110 group-hover:bg-[#ec3750] group-hover:text-white">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </div>
            <span className="mt-4 font-medium text-slate-600 group-hover:text-[#ec3750]">
                Create New Project
            </span>
        </button>
    );
}
