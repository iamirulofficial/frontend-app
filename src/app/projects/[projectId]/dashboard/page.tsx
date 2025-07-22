'use client';

import { useParams, notFound, redirect } from 'next/navigation';
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
  
  // If project is not Bhu-Setu, we can assume it's set up and redirect to a populated dashboard
  // For this prototype, we only have a "fresh" view for Bhu-Setu
  if (project.id !== 'bhu-setu-2') {
     // For other projects, you might have a different view or redirect
     // For now, we'll just show a placeholder message
    return <div className="p-8">This project dashboard is not yet configured.</div>
  }

  const phaseItems = [
    { href: '/planning', icon: ClipboardList, label: 'Planning' },
    { href: '/execution', icon: Construction, label: 'Execution' },
    { href: '/verification', icon: FileCheck2, label: 'Verification' },
    { href: '/monitor', icon: BarChart2, label: 'Monitor' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline tracking-tight">Welcome to {project.name}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{project.description}</p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
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
            <Link href={`/projects/${project.id}${item.href}`} key={item.label}>
              <Card className="h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:border-primary">
                <CardContent className="flex flex-col items-center justify-center text-center p-6">
                  <item.icon className="h-10 w-10 text-primary mb-3" />
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
