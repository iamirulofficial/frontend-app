'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { GlobalHeader } from '@/components/global-header';
import { AiCopilot } from '@/components/ai-copilot';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const pathname = usePathname();

  // Determine if the sidebar should be shown
  const showProjectSidebar = pathname.startsWith('/projects/');

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
       {!showProjectSidebar && <GlobalHeader onAiCopilotClick={() => setIsCopilotOpen(true)} />}
       <AiCopilot open={isCopilotOpen} onOpenChange={setIsCopilotOpen} />
       <main className="flex-1">{children}</main>
    </div>
  );
}
