'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, Loader2, Lightbulb, ShieldAlert, BookOpen, Wand2, ArrowRight, User } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { getProjectCopilotSummary, type ProjectCopilotSummaryOutput } from '@/ai/flows/project-copilot-summary';
import { getTaskExplanation, type TaskExplanationOutput } from '@/ai/flows/explain-task';
import { getFollowUpExplanation, type FollowUpTaskExplanationInput } from '@/ai/flows/follow-up-task-explanation';
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

type ChatMessage = {
    role: 'user' | 'assistant';
    content: string | React.ReactNode;
}

const mockSplitSuggestion = {
    split: ["Legal-Spec drafting (2d)", "Smart-contract coding (3d)", "On-chain notarization tests (3d)"]
};

export function AiCopilot({ open, onOpenChange, context = { type: 'default', details: null }, onApplySuggestion }: AiCopilotProps) {
  const pathname = usePathname();
  const [summary, setSummary] = useState<ProjectCopilotSummaryOutput | null>(null);
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [splitSuggestion, setSplitSuggestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followUpInput, setFollowUpInput] = useState('');
  
  const contentRef = useRef<HTMLDivElement>(null);


  const { project, phase } = useMemo(() => {
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length >= 3 && pathParts[0] === 'projects') {
      const proj = projects.find((p) => p.id === pathParts[1]);
      return { project: proj, phase: pathParts[2] };
    }
    return { project: null, phase: null };
  }, [pathname]);

  useEffect(() => {
    if (open) {
      // Reset state when opening
      setIsLoading(true);
      setError(null);
      setSummary(null);
      setConversation([]);
      setSplitSuggestion(null);
      setFollowUpInput('');

      const fetchExplanation = async (taskName: string) => {
        try {
          const result = await getTaskExplanation({
            taskName: taskName,
            projectName: project!.name
          });
          const explanationContent = (
            <div className="space-y-4 prose prose-sm max-w-none">
              <p>{result.analogy}</p>
              <Separator />
              <h4 className="font-semibold">Key Objectives:</h4>
              <ul>{result.objectives.map((obj, i) => <li key={i}>{obj}</li>)}</ul>
              <h4 className="font-semibold">Potential Challenges:</h4>
              <ul>{result.challenges.map((cha, i) => <li key={i}>{cha}</li>)}</ul>
            </div>
          );
          setConversation([{ role: 'assistant', content: explanationContent }]);
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
            projectName: project!.name,
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

      if(project) {
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
    }
  }, [open, project, phase, context]);

  useEffect(() => {
    // Scroll to bottom of chat on new message
    if (contentRef.current) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpInput.trim() || !project) return;

    const userMessage: ChatMessage = { role: 'user', content: followUpInput };
    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);
    setFollowUpInput('');
    
    // Find the original explanation to provide context
    const originalExplanationNode = conversation.find(c => c.role === 'assistant')?.content;
    // A bit hacky: serialize the React node to a string for the prompt
    const originalExplanation = (originalExplanationNode as React.ReactElement)?.props.children.map((child: any) => child.props.children).join(' ');

    try {
      const result = await getFollowUpExplanation({
        taskName: context.details?.name,
        originalExplanation: originalExplanation,
        followUpQuestion: followUpInput,
      });
      const assistantMessage: ChatMessage = { role: 'assistant', content: <p>{result.answer}</p> };
      setConversation(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = { role: 'assistant', content: <p className="text-destructive">Sorry, I had trouble getting an answer. Please try again.</p> };
      setConversation(prev => [...prev, errorMessage]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


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
    if (isLoading && conversation.length === 0 && !splitSuggestion && !summary) {
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
            return (
                <div className="space-y-4">
                    {conversation.map((msg, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                {msg.role === 'assistant' ? <Bot className="w-5 h-5"/> : <User className="w-5 h-5"/>}
                            </div>
                            <div className="flex-grow p-3 rounded-lg bg-background border">
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-center gap-3">
                           <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                <Bot className="w-5 h-5"/>
                            </div>
                            <div className="flex-grow p-3 rounded-lg bg-background border flex items-center">
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                <span className="ml-2 text-muted-foreground text-sm">Thinking...</span>
                            </div>
                        </div>
                    )}
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
        <div className="p-6 flex-grow overflow-y-auto" ref={contentRef}>
          {renderContent()}
        </div>
        {context.type === 'explain' && (
            <>
                <Separator />
                <SheetFooter className="p-4 bg-background border-t">
                    <form onSubmit={handleFollowUpSubmit} className="flex items-center w-full gap-2">
                        <Input 
                            placeholder="Ask a follow-up question..." 
                            value={followUpInput}
                            onChange={(e) => setFollowUpInput(e.target.value)}
                            disabled={isLoading}
                         />
                        <Button type="submit" disabled={isLoading || !followUpInput.trim()}>Send</Button>
                    </form>
                </SheetFooter>
            </>
        )}
      </SheetContent>
    </Sheet>
  );
}
