import { projects } from '@/data';
import { ProjectCard } from '@/components/project-card';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function HomePage() {
  const activeProjects = projects.filter((p) => p.status === 'active');
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Welcome to GovernAI Studio</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Select a project to view its dashboard or create a new one.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        <Link href="/new" className="h-full">
          <Card className="h-full flex flex-col items-center justify-center border-2 border-dashed hover:border-primary hover:bg-accent/50 transition-colors duration-200 ease-in-out group">
            <CardHeader className="text-center items-center">
                <PlusCircle className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                <CardTitle className="mt-4 font-headline text-xl">Create New Project</CardTitle>
                <CardDescription>Start a new governance initiative.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
