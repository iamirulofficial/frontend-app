'use client';

import { useState } from 'react';
import { notFound, usePathname } from 'next/navigation';
import { projects } from '@/data';
import { ProjectSidebar } from '@/components/project-sidebar';
import { AiCopilot } from '@/components/ai-copilot';
import { PlanningStepper } from '@/components/planning-stepper';
import { ExecutionStepper } from './execution-stepper';

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
  const isExecutionPage = pathname.includes('/execution');
  
  // Note: The main AiCopilot for the execution page is now managed within that page itself.
  // This one remains for other project pages that might use the sidebar button.

  return (
    <div className="flex min-h-screen">
      <ProjectSidebar project={project} onAiCopilotClick={() => setIsCopilotOpen(true)} />
      <AiCopilot open={isCopilotOpen} onOpenChange={setIsCopilotOpen} />
      <div className="flex-1 flex flex-col">
        {isPlanningPage && <PlanningStepper />}
        {isExecutionPage && <ExecutionStepper />}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 bg-gray-50">{children}</div>
      </div>
    </div>
  );
}
