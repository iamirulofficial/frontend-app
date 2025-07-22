import { projects } from '@/data';
import { ProjectCard } from '@/components/project-card';
import { Archive } from 'lucide-react';

export default function ArchivePage() {
  const completedProjects = projects.filter((p) => p.status === 'completed');
  
  return (
     <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight flex items-center"><Archive className="mr-4 h-10 w-10"/>Project Archive</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A record of completed governance projects and their outcomes.
        </p>
      </div>
      {completedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
            ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No completed projects yet.</p>
        </div>
      )}
    </div>
  );
}
