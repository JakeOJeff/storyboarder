import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project {
    id: string;
    title: string;
    lastModified: string;
    thumbnailUrl?: string;
    description?: string;
    gameDirectory?: string;
    data?: any;
}

interface ProjectState {
    projects: Project[];
    isLoading: boolean;
    addProject: (project: Project) => void;
    updateProject: (id: string, data: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    getProject: (id: string) => Project | undefined;
    fetchProjects: () => Promise<void>;
    saveProjectData: (id: string, data: any) => Promise<void>;
}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            projects: [],
            isLoading: false,
            addProject: async (project) => {
                set((state) => ({
                    projects: [project, ...state.projects],
                }));
            },
            updateProject: async (id, data) => {
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === id ? { ...p, ...data, lastModified: new Date().toISOString() } : p
                    ),
                }));
            },
            deleteProject: async (id) => {
                set((state) => ({
                    projects: state.projects.filter((p) => p.id !== id),
                }));
            },
            getProject: (id) => get().projects.find((p) => p.id === id),
            fetchProjects: async () => {
                // No-op: Data is automatically loaded from localStorage via persist middleware
            },
            saveProjectData: async (id, data) => {
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === id ? { ...p, data, lastModified: new Date().toISOString() } : p
                    ),
                }));
            },
        }),
        {
            name: 'storyboarder-storage',
        }
    )
);
