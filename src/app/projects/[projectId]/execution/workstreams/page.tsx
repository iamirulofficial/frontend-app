'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, Wand2, ArrowRight, Users, Shield, Code, Drone } from 'lucide-react';
import { planningData } from '@/data/planning';
import { useToast } from '@/hooks/use-toast';
import { AiCopilot } from '@/components/ai-copilot';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const initialTasks = planningData.wbs.map(t => ({ ...t, subtasks: [], isOptimized: false }));

const optimizedSubtasks: Record<number, { id: string; task: string; team: 'Drone Ops' | 'Data Sci' | 'DevOps' | 'Legal'; isCritical: boolean }[]> = {
  1: [
    { id: '1-1', task: 'Fly drone grid pattern for Zone A', team: 'Drone Ops', isCritical: true },
    { id: '1-2', task: 'Process photogrammetry data', team: 'Data Sci', isCritical: true },
    { id: '1-3', task: 'QA/QC initial parcel boundaries', team: 'Data Sci', isCritical: false },
  ],
  4: [
    { id: '4-1', task: 'Deploy Notary Smart Contract', team: 'DevOps', isCritical: true },
    { id: '4-2', task: 'Onboard first notary cohort', team: 'Legal', isCritical: true },
    { id: '4-3', task: 'Integrate with e-Stamping API', team: 'DevOps', isCritical: false },
  ],
  5: [
      { id: '5-1', task: 'Define Core Parcel Data API Spec', team: 'DevOps', isCritical: true },
      { id: '5-2', task: 'Build secure API Gateway', team: 'DevOps', isCritical: true },
      { id: '5-3', task: 'Develop SDKs for key partners (Banks, Insurers)', team: 'DevOps', isCritical: false },
  ]
};

const teamIcons: Record<string, React.ReactNode> = {
    'Drone Ops': <Drone className="h-5 w-5 text-sky-500" />,
    'Data Sci': <Shield className="h-5 w-5 text-amber-500" />,
    'DevOps': <Code className="h-5 w-5 text-emerald-500" />,
    'Legal': <Users className="h-5 w-5 text-rose-500" />,
}

const LoadingOverlay = ({ messages }: { messages: string[] }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  });

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
       <Wand2 className="h-16 w-16 text-primary animate-pulse" />
       <div className="mt-4 text-lg font-semibold text-muted-foreground text-center">
            <AnimatePresence mode="wait">
                <motion.p
                    key={messages[currentMessageIndex]}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {messages[currentMessageIndex]}
                </motion.p>
            </AnimatePresence>
       </div>
    </motion.div>
  )
}

export default function ExecutionWorkstreamsPage() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const { toast } = useToast();

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
        const newTasks = tasks.map(t => ({
          ...t,
          isOptimized: true,
          subtasks: optimizedSubtasks[t.id] || [],
        }));
        setTasks(newTasks);
        setIsOptimizing(false);
        toast({
          title: 'Workplan Optimized',
          description: 'High-level tasks have been broken down into parallel workstreams.',
        });
    }, 6000) // Simulate AI thinking for 6 seconds
  };
  
  const handleHelpClick = (taskName: string) => {
    setSelectedTask(taskName);
    setIsCopilotOpen(true);
  }
  
  const isOptimized = tasks.some(t => t.isOptimized);
  const loadingMessages = [
      "Contacting Agentic AI...",
      "Analyzing dependencies...",
      "Generating optimized workstreams..."
  ];

  return (
    <TooltipProvider>
    <div className="container mx-auto py-8 px-4 max-w-6xl relative">
      {isOptimizing && <LoadingOverlay messages={loadingMessages} />}
      <div className="flex justify-between items-center mb-8">
        <div className="text-center">
            <h1 className="text-4xl font-bold font-headline tracking-tight">Execution Work-Breakdown Twin</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Deconstruct the project plan into parallel, executable tasks.
            </p>
        </div>
        <Button size="lg" onClick={handleOptimize} disabled={isOptimized || isOptimizing}>
          <Wand2 className="mr-2"/>
          Auto-Optimize Workplan
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Project Task List</CardTitle>
            <CardDescription>
                {isOptimized ? 'Optimized view with parallel sub-tasks, critical path, and team allocation.' : 'High-level work breakdown structure.'}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  layout
                  transition={{ duration: 0.5, type: 'spring' }}
                >
                  <Card className="p-4 bg-secondary/30 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-primary font-bold text-lg">{`T-${task.id}`}</span>
                        <Separator orientation="vertical" className="h-6" />
                        <h3 className="font-semibold text-lg">{task.task}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{task.duration} days</span>
                        <Button variant="ghost" size="icon" onClick={() => handleHelpClick(task.task)}>
                            <HelpCircle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                        </Button>
                      </div>
                    </div>
                    <AnimatePresence>
                    {task.isOptimized && task.subtasks.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pl-8 space-y-2">
                        {task.subtasks.map((sub, subIndex) => (
                          <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: (subIndex + 1) * 0.1 }}
                            className={cn(
                                "flex items-center justify-between gap-3 p-2 rounded-md bg-background/50 border-l-4",
                                sub.isCritical ? 'border-amber-500' : 'border-transparent'
                             )}
                          >
                            <div className="flex items-center gap-3">
                                <ArrowRight className="h-4 w-4 text-primary" />
                                <span className="text-sm">{sub.task}</span>
                                {sub.isCritical && (
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>This task is on the critical path.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                            <Tooltip>
                                <TooltipTrigger>
                                    {teamIcons[sub.team]}
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Assigned to: {sub.team}</p>
                                </TooltipContent>
                            </Tooltip>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </div>
        </CardContent>
      </Card>
    </div>
    <AiCopilot 
        open={isCopilotOpen} 
        onOpenChange={setIsCopilotOpen}
        context={{ type: 'task', details: selectedTask }}
    />
    </TooltipProvider>
  );
}
