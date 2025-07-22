'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Construction,
  CheckCircle,
  BarChart2,
  Archive,
  Bot
} from 'lucide-react';
import type { Project } from '@/lib/types';
import { GovernaiLogo } from './icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ProjectSidebarProps {
  project: Project;
}

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/planning', icon: ClipboardList, label: 'Planning' },
  { href: '/execution', icon: Construction, label: 'Execution' },
  { href: '/verification', icon: CheckCircle, label: 'Verification' },
  { href: '/monitor', icon: BarChart2, label: 'Monitor' },
];

export function ProjectSidebar({ project }: ProjectSidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="w-16 flex flex-col items-center space-y-4 py-4 bg-card border-r">
        <Link href={`/projects/${project.id}/dashboard`} className="mb-4">
            <GovernaiLogo className="h-8 w-8 text-primary" />
        </Link>
        <nav className="flex flex-col items-center space-y-2">
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
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
        <div className="mt-auto flex flex-col items-center space-y-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href="/archive"
                        className={`p-3 rounded-lg transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground`}
                    >
                        <Archive className="h-6 w-6" />
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>Archive</p>
                </TooltipContent>
            </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
