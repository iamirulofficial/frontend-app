'use client';

import { useState } from 'react';
import { notFound, usePathname } from 'next/navigation';
import { projects } from '@/data';
import { ProjectSidebar } from '@/components/project-sidebar';
import { AiCopilot } from '@/components/ai-copilot';
import { PlanningStepper } from '@/components/planning-stepper';

export function ProjectLayoutClient({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  const pathname = usePathname();
  const project = projects.find((p) => p.id === projectId);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  if (!project) {
    notFound();
  }

  const isPlanningPage = pathname.includes('/planning');

  return (
    <div className="flex min-h-screen">
      <ProjectSidebar project={project} onAiCopilotClick={() => setIsCopilotOpen(true)} />
      <AiCopilot open={isCopilotOpen} onOpenChange={setIsCopilotOpen} />
      <div className="flex-1 flex flex-col">
        {isPlanningPage && <PlanningStepper />}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 bg-gray-50">{children}</div>
      </div>
    </div>
  );
}
