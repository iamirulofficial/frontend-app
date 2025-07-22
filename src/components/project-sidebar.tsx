'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Construction,
  FileCheck2,
  BarChart2,
  Archive,
  Bot,
  LogOut
} from 'lucide-react';
import type { Project } from '@/lib/types';
import { GovernaiLogo } from './icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from './ui/button';

interface ProjectSidebarProps {
  project: Project;
  onAiCopilotClick: () => void;
}

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/planning', icon: ClipboardList, label: 'Planning' },
  { href: '/execution', icon: Construction, label: 'Execution' },
  { href: '/verification', icon: FileCheck2, label: 'Verification' },
  { href: '/monitor', icon: BarChart2, label: 'Monitor' },
];

export function ProjectSidebar({ project, onAiCopilotClick }: ProjectSidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="w-16 flex flex-col items-center space-y-4 py-4 bg-card border-r shadow-md">
        <Link href={`/`} className="mb-4">
            <GovernaiLogo className="h-8 w-8 text-primary" />
        </Link>
        <nav className="flex flex-col items-center space-y-2 flex-grow">
          {navItems.map((item) => {
            const fullPath = `/projects/${project.id}${item.href}`;
            const isActive = pathname === fullPath;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={fullPath}
                    className={`p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent/10 hover:text-primary'
                    }`}
                  >
                    <item.icon className="h-6 w-6" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
        <div className="flex flex-col items-center space-y-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={onAiCopilotClick} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Bot className="h-6 w-6" />
                    </Button>
                </TooltipTrigger>
                 <TooltipContent side="right">
                    <p>Project Copilot</p>
                </TooltipContent>
            </Tooltip>
             <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href="/"
                        className={`p-3 rounded-lg transition-colors text-muted-foreground hover:bg-accent/10 hover:text-primary`}
                    >
                        <LogOut className="h-6 w-6" />
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>Exit Project</p>
                </TooltipContent>
            </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
