'use client';

import Link from 'next/link';
import { Bot, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GovernaiLogo } from '@/components/icons';
import { usePathname } from 'next/navigation';

type GlobalHeaderProps = {
  onAiCopilotClick: () => void;
};

export function GlobalHeader({ onAiCopilotClick }: GlobalHeaderProps) {
  const pathname = usePathname();
  const isProjectPage = pathname.startsWith('/projects/');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <GovernaiLogo className="h-8 w-8 text-primary" />
            <span className="font-bold font-headline text-lg">
              GovernAI Studio
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {isProjectPage && (
            <Button onClick={onAiCopilotClick} variant="outline" size="sm">
              <Bot className="mr-2 h-4 w-4" />
              Project Copilot
            </Button>
          )}
           {isProjectPage && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                Exit Project
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
