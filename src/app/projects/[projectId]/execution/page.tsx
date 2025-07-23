'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, Wand2, ArrowRight } from 'lucide-react';
import { planningData } from '@/data/planning';
import { useToast } from '@/hooks/use-toast';
import { AiCopilot } from '@/components/ai-copilot';

const initialTasks = planningData.wbs.map(t => ({ ...t, subtasks: [] }));

const optimizedSubtasks: Record<number, { id: string; task: string }[]> = {
  1: [
    { id: '1-1', task: 'Fly drone grid pattern for Zone A' },
    { id: '1-2', task: 'Process photogrammetry data' },
    { id: '1-3', task: 'QA/QC initial parcel boundaries' },
  ],
  4: [
    { id: '4-1', task: 'Deploy Notary Smart Contract' },
    { id: '4-2', task: 'Onboard first notary cohort' },
    { id: '4-3', task: 'Integrate with e-Stamping API' },
  ],
  5: [
      { id: '5-1', task: 'Define Core Parcel Data API Spec' },
      { id: '5-2', task: 'Build secure API Gateway' },
      { id: '5-3', task: 'Develop SDKs for key partners (Banks, Insurers)' },
  ]
};

export default function ExecutionPage() {
  const [isOptimized, setIsOptimized] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const { toast } = useToast();

  const handleOptimize = () => {
    setIsOptimized(true);
    const newTasks = tasks.map(t => ({
      ...t,
      subtasks: optimizedSubtasks[t.id] || [],
    }));
    setTasks(newTasks);
    toast({
      title: 'Workplan Optimized',
      description: 'High-level tasks have been broken down into parallel workstreams.',
    });
  };
  
  const handleHelpClick = (taskName: string) => {
    setSelectedTask(taskName);
    setIsCopilotOpen(true);
  }

  return (
    <>
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div className="text-center">
            <h1 className="text-4xl font-bold font-headline tracking-tight">Execution Work-Breakdown Twin</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Deconstruct the project plan into parallel, executable tasks.
            </p>
        </div>
        <Button size="lg" onClick={handleOptimize} disabled={isOptimized}>
          <Wand2 className="mr-2"/>
          Auto-Optimize Workplan
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Project Task List</CardTitle>
            <CardDescription>
                {isOptimized ? 'Optimized view with parallel sub-tasks.' : 'High-level work breakdown structure.'}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            <AnimatePresence>
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="p-4 bg-secondary/30">
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
                    {isOptimized && task.subtasks.length > 0 && (
                      <div className="mt-4 pl-8 space-y-2">
                        {task.subtasks.map((sub, subIndex) => (
                          <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: (subIndex + 1) * 0.1 }}
                            className="flex items-center gap-3 p-2 rounded-md bg-background/50"
                          >
                            <ArrowRight className="h-4 w-4 text-primary" />
                            <span className="text-sm">{sub.task}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            </div>
        </CardContent>
      </Card>
    </div>
    <AiCopilot 
        open={isCopilotOpen} 
        onOpenChange={setIsCopilotOpen}
        context={{ type: 'task', details: selectedTask }}
    />
    </>
  );
}
