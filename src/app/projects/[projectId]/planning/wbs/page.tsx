'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from '@/components/ui/sheet';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui/tooltip';
import { planningData, wbs, wbsRegenerated } from '@/data/planning';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles, RefreshCw, User, Edit3, X, MapPin,
  Clock, AlertTriangle, Settings, HelpCircle,
  Calendar, Users, Zap, Shield, Target
} from 'lucide-react';


const getRiskColor = (risk: number) => {
  if (risk > 0.6) return 'bg-rose-500';
  if (risk > 0.3) return 'bg-amber-500';
  return 'bg-emerald-500';
};

const getRiskBgColor = (risk: number) => {
  if (risk > 0.6) return 'bg-rose-200';
  if (risk > 0.3) return 'bg-amber-200';
  return 'bg-emerald-200';
};

const getRiskTextColor = (risk: number) => {
  if (risk > 0.6) return 'text-rose-800';
  if (risk > 0.3) return 'text-amber-800';
  return 'text-emerald-800';
};

const EditableCell = ({ value, onSave }: { value: number, onSave: (newValue: number) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);

    const handleBlur = () => {
        setIsEditing(false);
        onSave(currentValue);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 0 && val <= 100) {
            setCurrentValue(val);
        }
    };

    return (
        <motion.div
            className="font-bold cursor-pointer"
            onClick={() => setIsEditing(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {isEditing ? (
                <input
                    type="number"
                    value={currentValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                    className="w-16 text-center bg-background border-2 border-primary rounded-md px-2 py-1"
                />
            ) : (
                <motion.span
                    className="p-2 rounded-md hover:bg-muted/50 transition-colors"
                    animate={{ backgroundColor: isEditing ? '#10b981' : 'transparent' }}
                >
                    {currentValue}%
                </motion.span>
            )}
        </motion.div>
    );
};

// Keystone practices from SPARK Scan
const keystonePractices = [
  { id: 1, name: 'Bi-modal Authentication', color: 'bg-blue-100 text-blue-800' },
  { id: 2, name: 'API Interoperability', color: 'bg-green-100 text-green-800' },
  { id: 3, name: 'Consent-Driven Access', color: 'bg-purple-100 text-purple-800' },
  { id: 4, name: 'Real-time Settlement', color: 'bg-orange-100 text-orange-800' },
];

// Risk factors for heat map
const riskFactors = ['Drone Delay', 'OCR Errors', 'Boundary Disputes', 'API Downtime', 'Legal Blocks'];

export default function WBSPage() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const isRegenerateFlow = searchParams.get('regenerate') === 'true';

    const [riskAllocations, setRiskAllocations] = useState(planningData.pppRisk);
    const [wbsData, setWbsData] = useState(isRegenerateFlow ? wbsRegenerated : wbs);
    const [highlightedTasks, setHighlightedTasks] = useState<number[]>([]);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [showTaskDetail, setShowTaskDetail] = useState(false);
    const [pinnedPractices, setPinnedPractices] = useState(keystonePractices);
    const [isRegenerating, setIsRegenerating] = useState(false);

    useEffect(() => {
        if (isRegenerateFlow) {
            setWbsData(wbsRegenerated);
            toast({
                title: '🔄 WBS Re-drafted',
                description: 'Tasks driving failure have been re-prioritized and risks adjusted.',
                variant: 'default',
            });
            setHighlightedTasks([1, 4]);
            const timer = setTimeout(() => setHighlightedTasks([]), 2000);
            return () => clearTimeout(timer);
        }
    }, [isRegenerateFlow, toast]);

    const handleRiskChange = (index: number, type: 'gov' | 'private', value: number) => {
        const newAllocations = [...riskAllocations];
        if(type === 'gov') {
            newAllocations[index].gov = value;
            newAllocations[index].private = 100 - value;
        } else {
            newAllocations[index].private = value;
            newAllocations[index].gov = 100 - value;
        }
        setRiskAllocations(newAllocations);
    };

    const handleTaskClick = (task: any) => {
        setSelectedTask(task);
        setShowTaskDetail(true);
    };

    const handleRegenerateWBS = () => {
        setIsRegenerating(true);
        setTimeout(() => {
            setWbsData(wbsRegenerated);
            setIsRegenerating(false);
            toast({
                title: '✨ WBS Regenerated',
                description: 'AI has re-prioritized tasks based on latest risk analysis.',
            });
            setHighlightedTasks([1, 4]);
            setTimeout(() => setHighlightedTasks([]), 2000);
        }, 2000);
    };

    const removePractice = (id: number) => {
        setPinnedPractices(prev => prev.filter(p => p.id !== id));
    };

    const healthyTasksCount = wbsData.filter(task => task.p80Risk < 0.5).length;
    const isNextEnabled = healthyTasksCount >= 3;

  return (
    <TooltipProvider>
      <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">

        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/projects/bhu-setu-2/planning/scan" className="flex items-center">
                ← Charter
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">•</div>
            <span className="text-sm font-medium">Next: What-If Scenarios</span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI-drafted Work Breakdown Structure with risk analysis</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold font-headline tracking-tight text-slate-800 flex items-center justify-center">
            <Settings className="text-blue-600 mr-3 h-8 w-8" />
            AI-Drafted Work Breakdown Structure
          </h1>
          <p className="text-muted-foreground text-lg">
            Intelligent task breakdown with risk-aware scheduling and PPP allocation
          </p>
        </div>

        {/* 1. Keystone Practices */}
        <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="text-emerald-600 h-5 w-5" />
                <CardTitle>Keystone Practices</CardTitle>
                <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                  Imported from SPARK
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {pinnedPractices.map((practice) => (
                <motion.div
                  key={practice.id}
                  className={`px-3 py-2 rounded-full text-sm font-medium ${practice.color} cursor-pointer group relative`}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {practice.name}
                  <motion.button
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePractice(practice.id)}
                    whileHover={{ scale: 1.1 }}
                  >
                    <X className="h-3 w-3" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 2. AI-Drafted WBS Table */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <Zap className="text-blue-600 mr-3 h-6 w-6" />
                  Work Breakdown Structure
                </CardTitle>
                <CardDescription className="mt-2 flex items-center">
                  <motion.div
                    animate={{ rotate: isRegenerating ? 360 : 0 }}
                    transition={{ duration: 2, repeat: isRegenerating ? Infinity : 0 }}
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                  </motion.div>
                  Drafted in 3s by AI Copilot • Risk overlays updated from PPP sheet
                </CardDescription>
              </div>
              <Button
                onClick={handleRegenerateWBS}
                disabled={isRegenerating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                Regenerate WBS
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wbsData.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    "group grid grid-cols-12 gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg",
                    highlightedTasks.includes(item.id)
                      ? 'border-rose-500 bg-rose-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300'
                  )}
                  onClick={() => handleTaskClick(item)}
                  whileHover={{ y: -2 }}
                >
                  {/* Task Name */}
                  <div className="col-span-3 flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(item.p80Risk)}`}></div>
                    <span className="font-medium text-sm group-hover:text-blue-600 transition-colors">
                      {item.task}
                    </span>
                  </div>

                  {/* Duration with Progress Bar */}
                  <div className="col-span-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.duration} days</span>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          <Progress
                            value={item.duration / 30 * 100}
                            className="h-2 bg-gray-200"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.duration} days duration</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* P-80 Risk */}
                  <div className="col-span-2 flex items-center space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          className={`${getRiskBgColor(item.p80Risk)} ${getRiskTextColor(item.p80Risk)} border-0`}
                        >
                          P-80: {(item.p80Risk * 100).toFixed(0)}%
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>80th percentile overrun risk</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Owner */}
                  <div className="col-span-2 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {item.task.charAt(0)}
                    </div>
                    <span className="text-sm text-muted-foreground truncate">
                      {['Ops Team', 'Data Cell', 'Survey Squad', 'Legal Ops', 'Dev Squad', 'Revenue Rail', 'QA Team'][i % 7]}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end">
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3. Risk Heat Map */}
          <Card className="border-2 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="text-amber-600 mr-2 h-5 w-5" />
                Risk Heat Map
              </CardTitle>
              <CardDescription>
                Cross-matrix of tasks vs risk factors. Click to regenerate WBS.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Headers */}
                <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground">
                  <div></div>
                  {riskFactors.map((factor) => (
                    <div key={factor} className="text-center truncate">{factor}</div>
                  ))}
                </div>

                {/* Risk Grid */}
                {wbsData.slice(0, 5).map((task, taskIndex) => (
                  <div key={task.id} className="grid grid-cols-6 gap-2">
                    <div className="text-xs font-medium truncate pr-2">{task.task}</div>
                    {riskFactors.map((factor, factorIndex) => {
                      const riskValue = Math.random();
                      return (
                        <Tooltip key={`${taskIndex}-${factorIndex}`}>
                          <TooltipTrigger asChild>
                            <motion.div
                              className={`h-8 rounded cursor-pointer ${getRiskBgColor(riskValue)}`}
                              whileHover={{ scale: 1.1, z: 10 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={handleRegenerateWBS}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{factor}: P80={Math.round(riskValue * 100)}% → schedule +{Math.round(riskValue * 15)}d</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* PPP Risk Allocation */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="text-purple-600 mr-2 h-5 w-5" />
                PPP Risk Allocation
              </CardTitle>
              <CardDescription>
                Allocate risk between Government and Private entities. Click to edit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Risk Factor</TableHead>
                    <TableHead className="text-center">Govt %</TableHead>
                    <TableHead className="text-center">Private %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riskAllocations.map((item, i) => (
                    <motion.tr
                      key={item.factor}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="hover:bg-muted/30"
                    >
                      <TableCell className="font-medium">{item.factor}</TableCell>
                      <TableCell className="text-center">
                         <EditableCell value={item.gov} onSave={(val) => handleRiskChange(i, 'gov', val)} />
                      </TableCell>
                       <TableCell className="text-center">
                         <EditableCell value={item.private} onSave={(val) => handleRiskChange(i, 'private', val)} />
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8">
          <Button variant="outline" asChild>
            <Link href="/projects/bhu-setu-2/planning/scan" className="flex items-center">
              ← Back to SPARK Scan
            </Link>
          </Button>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {healthyTasksCount}/3 healthy tasks (P-80 &lt; 50%)
            </div>
            <motion.div
              animate={isNextEnabled ? {
                boxShadow: ['0 0 0 0 rgba(16, 185, 129, 0.7)', '0 0 0 10px rgba(16, 185, 129, 0)', '0 0 0 0 rgba(16, 185, 129, 0)']
              } : {}}
              transition={{ duration: 2, repeat: isNextEnabled ? Infinity : 0 }}
            >
              <Button
                size="lg"
                className={cn(
                  "transition-all duration-300",
                  isNextEnabled
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/50"
                    : "bg-gray-400 cursor-not-allowed"
                )}
                disabled={!isNextEnabled}
                asChild={isNextEnabled}
              >
                {isNextEnabled ? (
                  <Link href={`/projects/bhu-setu-2/planning/sandbox?regenerated=${isRegenerateFlow}`}>
                    <Target className="mr-2 h-5 w-5" />
                    Next: Sandbox & What-If →
                  </Link>
                ) : (
                  <span>
                    <Target className="mr-2 h-5 w-5" />
                    Next: Sandbox & What-If →
                  </span>
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Task Detail Panel */}
        <Sheet open={showTaskDetail} onOpenChange={setShowTaskDetail}>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Task Details
              </SheetTitle>
              <SheetDescription>
                Adjust task parameters and view linked practices
              </SheetDescription>
            </SheetHeader>

            {selectedTask && (
              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="font-semibold text-lg">{selectedTask.task}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Critical infrastructure component requiring drone-based surveying and boundary validation for land parcel digitization.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Duration (days)</label>
                    <Slider
                      value={[selectedTask.duration]}
                      onValueChange={(value) => {
                        setSelectedTask({...selectedTask, duration: value[0]});
                      }}
                      max={30}
                      min={5}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Current: {selectedTask.duration} days
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Linked Practices</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pinnedPractices.slice(0, 2).map((practice) => (
                        <Badge key={practice.id} variant="outline" className="text-xs">
                          {practice.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <MapPin className="mr-2 h-4 w-4" />
                    Sync to Digital Twin
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}