import React from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useProjectStore } from '@/lib/useProjectStore';

interface ProjectCardProps {
    id: string;
    title: string;
    lastModified: string;
    thumbnailUrl?: string;
    description?: string;
}

export function ProjectCard({ id, title, lastModified, description }: ProjectCardProps) {
    const deleteProject = useProjectStore((state) => state.deleteProject);

    // Format Date
    const date = new Date(lastModified).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this project?')) {
            deleteProject(id);
        }
    };

    return (
        <div className="group relative">
            <Link
                href={`/editor/${id}`}
                className="flex flex-col h-full overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-lg"
            >
                {/* Thumbnail Placeholder */}
                <div className="relative aspect-video w-full bg-gradient-to-br from-zinc-100 to-zinc-200 group-hover:from-zinc-200 group-hover:to-zinc-300">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium text-black shadow-sm backdrop-blur-sm">
                            Open Editor
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>
                    {description && (
                        <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                            {description}
                        </p>
                    )}
                    <div className="mt-auto pt-4 text-xs text-zinc-400 font-mono">
                        Last modified {date}
                    </div>
                </div>
            </Link>

            <button
                onClick={handleDelete}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-zinc-400 opacity-0 transition-all hover:bg-white hover:text-[#ec3750] shadow-sm backdrop-blur-sm group-hover:opacity-100 z-10"
                title="Delete Project"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}
