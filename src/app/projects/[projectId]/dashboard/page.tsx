'use client';

import { notFound, useParams } from 'next/navigation';
import { projects, bhuSetuData } from '@/data';
import { KpiCard } from '@/components/kpi-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TrendingUp, AlertTriangle, BadgeCheck, MapPin, LayoutDashboard, ClipboardList, Construction, CheckCircle, BarChart2, FileCheck2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const project = projects.find((p) => p.id === projectId);
  
  if (!project) {
    notFound();
  }

  const phaseItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/planning', icon: ClipboardList, label: 'Planning' },
    { href: '/execution', icon: Construction, label: 'Execution' },
    { href: '/verification', icon: FileCheck2, label: 'Verification' },
    { href: '/monitor', icon: BarChart2, label: 'Monitor' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline tracking-tight">{project.name} Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">{project.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Return on Investment (ROI)"
          value={project.kpi.roi * 100}
          icon={<TrendingUp />}
          suffix="%"
          colorClass="text-green-500"
          description="Projected financial return"
        />
        <KpiCard
          title="Schedule Variance"
          value={project.kpi.delayDays}
          icon={<AlertTriangle />}
          suffix=" days"
          colorClass={project.kpi.delayDays > 0 ? 'text-destructive' : 'text-green-500'}
          description={project.kpi.delayDays > 0 ? 'Behind schedule' : 'Ahead of schedule'}
        />
        <KpiCard
          title="Overall Quality Score"
          value={project.kpi.quality}
          icon={<BadgeCheck />}
          suffix=" / 100"
          colorClass="text-primary"
          description="Composite quality metric"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5" /> Project Footprint</CardTitle>
            <CardDescription>Live operational view of project districts.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video relative rounded-lg overflow-hidden border">
              <Image src="https://placehold.co/800x450.png" alt="Project Map" fill className="object-cover" data-ai-hint="india map districts" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg">Bhu-Setu 2.0 Live View</h3>
                <p className="text-sm">4 active districts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Lifecycle</CardTitle>
            <CardDescription>Navigate through different phases of the project.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pt-8">
            <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-xs">
              <CarouselContent>
                {phaseItems.map((item) => (
                  <CarouselItem key={item.href} className="md:basis-1/2 lg:basis-1/1">
                    <Link href={`/projects/${project.id}${item.href}`}>
                      <div className="p-1">
                        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:border-primary">
                          <CardContent className="flex flex-col items-center justify-center aspect-square p-6">
                            <item.icon className="h-12 w-12 text-primary mb-4" />
                            <span className="text-lg font-semibold font-headline">{item.label}</span>
                          </CardContent>
                        </Card>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
