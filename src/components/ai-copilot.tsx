'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, Loader2, Lightbulb, ShieldAlert, BookOpen, Wand2, ArrowRight } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getProjectCopilotSummary, type ProjectCopilotSummaryOutput } from '@/ai/flows/project-copilot-summary';
import { getTaskExplanation, type TaskExplanationOutput } from '@/ai/flows/explain-task';
import { projects, bhuSetuData } from '@/data';

type CopilotContext = 
  | { type: 'phase'; details: any }
  | { type: 'explain'; details: any }
  | { type: 'split'; details: any }
  | { type: 'default'; details: any };

interface AiCopilotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: CopilotContext;
  onApplySuggestion?: (suggestion: any) => void;
}

const mockSplitSuggestion = {
    split: ["Legal-Spec drafting (2d)", "Smart-contract coding (3d)", "On-chain notarization tests (3d)"]
};

export function AiCopilot({ open, onOpenChange, context = { type: 'default', details: null }, onApplySuggestion }: AiCopilotProps) {
  const pathname = usePathname();
  const [summary, setSummary] = useState<ProjectCopilotSummaryOutput | null>(null);
  const [explanation, setExplanation] = useState<TaskExplanationOutput | null>(null);
  const [splitSuggestion, setSplitSuggestion] = useState<any>(null);
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
      setSplitSuggestion(null);

      const fetchExplanation = async (taskName: string) => {
        try {
          const result = await getTaskExplanation({
            taskName: taskName,
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
      
      const fetchSplitSuggestion = async (taskName: string) => {
        // Mocking the API call for now
        setTimeout(() => {
            setSplitSuggestion(mockSplitSuggestion);
            setIsLoading(false);
        }, 1000);
      };

      switch(context.type) {
        case 'explain':
        case 'split':
            if (context.details?.name) {
                if(context.type === 'explain') fetchExplanation(context.details.name);
                else fetchSplitSuggestion(context.details.name);
            } else {
                setIsLoading(false);
            }
            break;
        case 'phase':
        case 'default':
        default:
             if (phase) {
                fetchSummary();
            } else {
                setIsLoading(false);
            }
            break;
      }
    }
  }, [open, project, phase, context]);

  const getTitle = () => {
    switch(context.type) {
        case 'explain': return "Task Explainer";
        case 'split': return "Task Splitter";
        default: return "Project Copilot";
    }
  }
  
  const getDescription = () => {
     switch(context.type) {
        case 'explain': return `AI-powered explanation for task: "${context.details?.name}"`;
        case 'split': return `AI-powered suggestions to parallelize: "${context.details?.name}"`;
        default: return `AI-powered insights for ${project?.name}.`;
    }
  }

  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Analyzing...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex items-center justify-center h-full text-destructive">
               <p>{error}</p>
            </div>
        );
    }

    switch(context.type) {
        case 'explain':
            return explanation && (
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
            );
        case 'split':
            return splitSuggestion && (
                 <div className="space-y-6">
                    <Card className="bg-emerald-50 border-emerald-200">
                        <CardHeader>
                            <CardTitle className="text-lg text-emerald-800 flex items-center"><Wand2 className="mr-3"/> Parallelization Suggestion</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm text-muted-foreground">This can be split into these sub-tasks:</p>
                           {splitSuggestion.split.map((s: string, i: number) => (
                               <div key={i} className="flex items-center gap-2 bg-background p-2 rounded-md border">
                                   <ArrowRight className="h-4 w-4 text-primary"/>
                                   <span className="text-sm font-medium">{s}</span>
                               </div>
                           ))}
                        </CardContent>
                        <SheetFooter className="p-4 bg-emerald-50 border-t border-emerald-200">
                             <Button onClick={() => onApplySuggestion && onApplySuggestion(splitSuggestion)}>
                                Apply Suggestion
                            </Button>
                        </SheetFooter>
                    </Card>
                </div>
            )
        default:
            return summary && (
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
             );
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full p-0 flex flex-col">
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
        <div className="p-6 flex-grow overflow-y-auto">
          {renderContent()}
        </div>
      </SheetContent>
    </Sheet>
  );
}
