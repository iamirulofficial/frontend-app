'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, Loader2, Lightbulb, ShieldAlert, BookOpen } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { getProjectCopilotSummary, type ProjectCopilotSummaryOutput } from '@/ai/flows/project-copilot-summary';
import { getTaskExplanation, type TaskExplanationOutput } from '@/ai/flows/explain-task';
import { projects, bhuSetuData } from '@/data';

type CopilotContext = 
  | { type: 'phase'; }
  | { type: 'task'; details: string | null };

interface AiCopilotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: CopilotContext;
}

export function AiCopilot({ open, onOpenChange, context = { type: 'phase' } }: AiCopilotProps) {
  const pathname = usePathname();
  const [summary, setSummary] = useState<ProjectCopilotSummaryOutput | null>(null);
  const [explanation, setExplanation] = useState<TaskExplanationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { project, phase } = useMemo(() => {
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length >= 3 && pathParts[0] === 'projects') {
      const proj = projects.find((p) => p.id === pathParts[1]);
      return { project: proj, phase: pathParts[2] };
    }
    return { project: null, phase: null };
  }, [pathname]);

  useEffect(() => {
    if (open && project) {
      setIsLoading(true);
      setError(null);
      setSummary(null);
      setExplanation(null);

      if (context.type === 'task' && context.details) {
        const fetchExplanation = async () => {
          try {
            const result = await getTaskExplanation({
              taskName: context.details!,
              projectName: project.name
            });
            setExplanation(result);
          } catch (e) {
            setError('Failed to get explanation. Please try again.');
            console.error(e);
          } finally {
            setIsLoading(false);
          }
        };
        fetchExplanation();
      } else if (context.type === 'phase' && phase) {
        const fetchSummary = async () => {
          try {
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
      } else {
        setIsLoading(false);
      }
    }
  }, [open, project, phase, context]);

  const getTitle = () => {
    if (context.type === 'task') return "Task Explainer";
    return "Project Copilot";
  }
  
  const getDescription = () => {
    if (context.type === 'task' && context.details) {
        return `AI-powered explanation for task: "${context.details}"`;
    }
    return `AI-powered insights for ${project?.name} - ${phase} phase.`;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full p-0">
        <SheetHeader className="p-6">
          <SheetTitle className="flex items-center text-2xl font-headline">
            <Bot className="mr-3 h-8 w-8 text-primary" />
            {getTitle()}
          </SheetTitle>
          <SheetDescription>
            {getDescription()}
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="p-6 h-[calc(100vh-120px)] overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Analyzing...</p>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center h-full text-destructive">
               <p>{error}</p>
            </div>
          )}
          {summary && context.type === 'phase' && (
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
           {explanation && context.type === 'task' && (
             <div className="space-y-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800 flex items-center"><BookOpen className="mr-3"/> Simplified Explanation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 prose prose-sm max-w-none">
                  <p>{explanation.analogy}</p>
                  <Separator />
                  <h4 className="font-semibold">Key Objectives:</h4>
                  <ul>
                    {explanation.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                  </ul>
                  <h4 className="font-semibold">Potential Challenges:</h4>
                  <ul>
                    {explanation.challenges.map((cha, i) => <li key={i}>{cha}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
