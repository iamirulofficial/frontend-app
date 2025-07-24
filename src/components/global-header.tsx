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

    </header>
  );
}
