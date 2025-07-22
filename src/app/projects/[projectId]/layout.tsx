import { notFound } from 'next/navigation';
import { projects } from '@/data';
import { ProjectSidebar } from '@/components/project-sidebar';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const project = projects.find((p) => p.id === params.projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex min-h-screen">
      <ProjectSidebar project={project} />
      <div className="flex-1 flex flex-col">
        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </div>
    </div>
  );
}
