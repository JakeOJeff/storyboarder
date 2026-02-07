'use client';

import { useProjectStore } from "@/lib/useProjectStore";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { CreateProjectButton } from "@/components/dashboard/CreateProjectButton";
import { UserMenu } from "@/components/auth/UserMenu";
import { ReportIssueButton } from "@/components/dashboard/ReportIssueButton";
import { useEffect, useState } from "react";

export default function Home() {
  const projects = useProjectStore((state) => state.projects);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const isLoading = useProjectStore((state) => state.isLoading);
  // Hydration fix for persisting state
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchProjects();
  }, [fetchProjects]);

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      {/* Header with Hack Club Banner */}
      <header className="sticky top-0 z-10 w-full border-b border-[#ec3750] bg-[#ec3750] px-6 py-4 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <UserMenu />
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-2xl font-bold tracking-tighter uppercase italic -skew-x-12">STORYBOARDER</span>
              <span className="font-mono text-white/80">|</span>
              <span className="font-bold tracking-tight">Hack Club</span>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:hidden">
            <ReportIssueButton />
            <span className="font-bold tracking-tight">Storyboarder</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="mt-1 text-zinc-500">Manage your stories and games.</p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <CreateProjectButton />
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[200px] animate-pulse rounded-xl bg-zinc-100" />
            ))
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                lastModified={project.lastModified}
                thumbnailUrl={project.thumbnailUrl}
                description={project.description}
              />
            ))
          )}
        </div>

        {/* Report Issue Button */}
        <div className="mt-12 flex justify-center pb-8">
          <ReportIssueButton />
        </div>
      </main>
    </div>
  );
}
