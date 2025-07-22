'use client';

import { useState } from 'react';
import { GlobalHeader } from '@/components/global-header';
import { AiCopilot } from '@/components/ai-copilot';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <GlobalHeader onAiCopilotClick={() => setIsCopilotOpen(true)} />
      <AiCopilot open={isCopilotOpen} onOpenChange={setIsCopilotOpen} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
