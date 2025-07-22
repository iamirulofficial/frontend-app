'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, Loader2, Lightbulb, ShieldAlert } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getProjectCopilotSummary, type ProjectCopilotSummaryOutput } from '@/ai/flows/project-copilot-summary';
import { projects, bhuSetuData } from '@/data';

interface AiCopilotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AiCopilot({ open, onOpenChange }: AiCopilotProps) {
  const pathname = usePathname();
  const [summary, setSummary] = useState<ProjectCopilotSummaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { project, phase } = useMemo(() => {
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length >= 3 && pathParts[0] === 'projects') {
      const project = projects.find((p) => p.id === pathParts[1]);
      return { project, phase: pathParts[2] };
    }
    return { project: null, phase: null };
  }, [pathname]);

  useEffect(() => {
    if (open && project && phase) {
      const fetchSummary = async () => {
        setIsLoading(true);
        setError(null);
        setSummary(null);

        try {
          // This uses mock data. A real implementation would fetch phase-specific data.
          const phaseData = JSON.stringify(bhuSetuData[phase as keyof typeof bhuSetuData] || bhuSetuData, null, 2);

          const result = await getProjectCopilotSummary({
            projectName: project.name,
            phaseData: phaseData,
          });
          setSummary(result);
        } catch (e) {
          setError('Failed to get insights. Please try again.');
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSummary();
    }
  }, [open, project, phase]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full p-0">
        <SheetHeader className="p-6">
          <SheetTitle className="flex items-center text-2xl font-headline">
            <Bot className="mr-3 h-8 w-8 text-primary" />
            Project Copilot
          </SheetTitle>
          <SheetDescription>
            AI-powered insights for {project?.name} - {phase} phase.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="p-6 h-[calc(100vh-120px)] overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Analyzing project data...</p>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center h-full text-destructive">
               <p>{error}</p>
            </div>
          )}
          {summary && (
             <div className="space-y-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">Key Delay Risks & Countermeasures</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {summary.risks.map((risk, index) => (
                    <div key={index} className="p-4 rounded-lg bg-background border">
                      <div className="flex items-start space-x-3">
                        <ShieldAlert className="h-5 w-5 mt-1 text-destructive" />
                        <div>
                          <p className="font-semibold text-foreground">{risk.riskDescription}</p>
                        </div>
                      </div>
                       <Separator className="my-3"/>
                       <div className="flex items-start space-x-3 mt-2">
                        <Lightbulb className="h-5 w-5 mt-1 text-accent" />
                        <div>
                           <p className="font-semibold text-muted-foreground">Suggestion:</p>
                           <p className="text-sm text-foreground">{risk.countermeasureSuggestion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
