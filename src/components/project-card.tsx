import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/types';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const statusVariantMap: Record<Project['status'], 'default' | 'secondary' | 'destructive'> = {
  active: 'default',
  completed: 'secondary',
  'on-hold': 'destructive',
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <div className="relative aspect-video mb-4">
            <Image
            src={project.imageUrl}
            alt={project.name}
            fill
            className="object-cover rounded-t-lg"
            data-ai-hint="project governance"
            />
        </div>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl">{project.name}</CardTitle>
                <CardDescription>{project.sector}</CardDescription>
            </div>
            <Badge variant={statusVariantMap[project.status]} className="capitalize">
                {project.status.replace('-', ' ')}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{project.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/projects/${project.id}`}>
            View Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
