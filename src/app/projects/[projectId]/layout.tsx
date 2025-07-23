import { ProjectLayoutClient } from '@/components/project-layout-client';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  return (
    <ProjectLayoutClient projectId={params.projectId}>
      {children}
    </ProjectLayoutClient>
  );
}
