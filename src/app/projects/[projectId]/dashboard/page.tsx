'use client';

import { useParams, notFound, redirect } from 'next/navigation';
import { use } from 'react';
import { projects } from '@/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, LayoutDashboard, ClipboardList, Construction, FileCheck2, BarChart2, Rocket } from 'lucide-react';
import { KpiCard } from '@/components/kpi-card';

export default function DashboardPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    notFound();
  }
  
  if (project.id !== 'bhu-setu-2') {
    return <div className="p-8 bg-gray-50">This project dashboard is not yet configured.</div>
  }

  const phaseItems = [
    { href: '/planning', icon: ClipboardList, label: 'Planning' },
    { href: '/execution', icon: Construction, label: 'Execution', disabled: true },
    { href: '/verification', icon: FileCheck2, label: 'Verification', disabled: true },
    { href: '/monitor', icon: BarChart2, label: 'Monitor', disabled: true },
  ];

  return (
    <div className="space-y-8 bg-gray-50">
      <div>
        <h1 className="text-4xl font-bold font-headline tracking-tight">Welcome to {project.name}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{project.description}</p>
      </div>

      <Card className="bg-blue-50 border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle>Project Setup</CardTitle>
          <CardDescription>Your project is ready. The first step is to define the project plan and run simulations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-background rounded-lg border">
            <div>
              <h3 className="font-semibold text-lg">Start with the AI-SPARK Hub</h3>
              <p className="text-muted-foreground">Go to the Planning phase to analyze scenarios and structure your project.</p>
            </div>
            <Button asChild>
              <Link href={`/projects/${projectId}/planning`}>
                Go to Planning <Rocket className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Return on Investment (ROI)"
          value={project.kpi.roi}
          suffix="%"
          description="Awaiting planning data"
        />
        <KpiCard
          title="Schedule Variance"
          value={project.kpi.delayDays}
          suffix=" days"
          description="Awaiting execution data"
        />
        <KpiCard
          title="Overall Quality Score"
          value={project.kpi.quality}
          suffix=" / 100"
          description="Awaiting verification data"
        />
      </div>

      <div>
        <h3 className="text-2xl font-bold font-headline mb-4">Project Lifecycle</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {phaseItems.map((item) => (
            <Link href={!item.disabled ? `/projects/${project.id}${item.href}` : '#'} key={item.label} className={item.disabled ? 'pointer-events-none' : ''}>
              <Card className={`h-full transform transition-transform duration-300 ${item.disabled ? 'bg-gray-100 opacity-50' : 'hover:scale-105 hover:shadow-xl hover:border-primary'}`}>
                <CardContent className="flex flex-col items-center justify-center text-center p-6">
                  <item.icon className={`h-10 w-10 mb-3 ${item.disabled ? 'text-gray-400' : 'text-primary'}`} />
                  <span className="font-semibold">{item.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
