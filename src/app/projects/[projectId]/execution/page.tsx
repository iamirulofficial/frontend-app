
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { AiCopilot } from '@/components/ai-copilot';
import { TwinPreviewMap, type Parcel } from '@/components/twin-preview-map';
import { Wand2, Layers, Bot, GitCommitHorizontal, Milestone, Play, Pause, ChevronRight, AlertTriangle, ShieldQuestion, Hourglass, CheckCircle2, Loader } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const initialTasks = [
  { id: 'T1', name: 'Deploy IoT Beacons', duration: 12, owner: 'Ops Team', status: 'In-Progress', progress: 30 },
  { id: 'T2', name: 'Launch Citizen Portal', duration: 10, owner: 'Dev Squad', status: 'In-Progress', progress: 60 },
  { id: 'T3', name: 'Notary-DAO Integration', duration: 8, owner: 'Legal Ops', status: 'Blocked', progress: 10 },
  { id: 'T4', name: 'Bulk Data Migration', duration: 15, owner: 'Data Cell', status: 'At-Risk', progress: 25 },
  { id: 'T5', name: 'Setup Geo-Fence Alerts', duration: 5, owner: 'Ops Team', status: 'Pending', progress: 0 },
  { id: 'T6', name: 'Finalize PPP Contracts', duration: 9, owner: 'Legal Ops', status: 'Done', progress: 100 },
  { id: 'T7', name: 'Develop Analytics Dashboard', duration: 11, owner: 'Dev Squad', status: 'In-Progress', progress: 45 },
  { id: 'T8', name: 'Train Field Surveyors', duration: 7, owner: 'HR Team', status: 'Done', progress: 100 },
  { id: 'T9', name: 'API Marketplace UAT', duration: 6, owner: 'QA Team', status: 'Pending', progress: 0 },
  { id: 'T10', name: 'Integrate with State Treasury', duration: 14, owner: 'Dev Squad', status: 'Blocked', progress: 30 },
  { id: 'T11', name: 'Conduct Security Audit', duration: 10, owner: 'InfoSec', status: 'At-Risk', progress: 50 },
  { id: 'T12', name: 'Scale OCR Infrastructure', duration: 8, owner: 'Data Cell', status: 'In-Progress', progress: 80 },
  { id: 'T13', name: 'Draft Citizen Communication', duration: 4, owner: 'Comm Team', status: 'Done', progress: 100 },
  { id: 'T14', name: 'Setup Grievance Redressal', duration: 7, owner: 'Support', status: 'Pending', progress: 0 },
  { id: 'T15', name: 'Onboard NGO Partners', duration: 9, owner: 'Outreach', status: 'In-Progress', progress: 65 },
  { id: 'T16', name: 'Procure Drone Fleet', duration: 18, owner: 'Ops Team', status: 'At-Risk', progress: 40 },
  { id: 'T17', name: 'User Authentication Module', duration: 10, owner: 'Dev Squad', status: 'Done', progress: 100 },
  { id: 'T18', name: 'Real-time Data Pipeline', duration: 13, owner: 'Data Cell', status: 'In-Progress', progress: 55 },
  { id: 'T19', name: 'Mobile Van Outfitting', duration: 10, owner: 'Ops Team', status: 'Pending', progress: 0 },
  { id: 'T20', name: 'Finalize Data Policy', duration: 6, owner: 'Legal Ops', status: 'Blocked', progress: 20 },
];


const optimizedSubtasks = [
    { id: 'S1-1', parentId: 'T1', name: 'Procure sensors', duration: 6, owner: 'Ops Team', status: 'Done', progress: 100 },
    { id: 'S1-2', parentId: 'T1', name: 'Install sensors', duration: 6, owner: 'Ops Team', status: 'In-Progress', progress: 50 },
    { id: 'S2-1', parentId: 'T2', name: 'Frontend UI/UX', duration: 5, owner: 'Dev Squad', status: 'In-Progress', progress: 70 },
    { id: 'S2-2', parentId: 'T2', name: 'Backend API', duration: 5, owner: 'Dev Squad', status: 'In-Progress', progress: 50 },
    { id: 'S3-1', parentId: 'T3', name: 'Legal-Spec drafting', duration: 4, owner: 'Legal Ops', status: 'Blocked', progress: 20 },
    { id: 'S3-2', parentId: 'T3', name: 'Smart-contract coding', duration: 4, owner: 'Dev Squad', status: 'Pending', progress: 0 },
    { id: 'S4-1', parentId: 'T4', name: 'Export 32Cr pages', duration: 8, owner: 'Data Cell', status: 'At-Risk', progress: 40 },
    { id: 'S4-2', parentId: 'T4', name: 'Run OCR & cleaning', duration: 7, owner: 'Data Cell', status: 'Pending', progress: 0 },
    // Add more optimized tasks to simulate a full breakdown
    { id: 'S7-1', parentId: 'T7', name: 'Data model design', duration: 4, owner: 'Dev Squad', status: 'Done', progress: 100 },
    { id: 'S7-2', parentId: 'T7', name: 'Chart component dev', duration: 7, owner: 'Dev Squad', status: 'In-Progress', progress: 20 },
    { id: 'S10-1', parentId: 'T10', name: 'Resolve API spec conflict', duration: 7, owner: 'Dev Squad', status: 'Blocked', progress: 0 },
    { id: 'S10-2', parentId: 'T10', name: 'Implement payment gateway', duration: 7, owner: 'Dev Squad', status: 'Pending', progress: 0 },
];


const valueMatrix = [
  { icon: Layers, module: 'Parcel-Twin Backbone', stack: 'GeoJSON parcels + IoT beacons; Hyperledger', value: 'Real-time, tamper-proof title → unlocks credit', ppp: 'Private SPV funds sensors under DBFOT; recovers via API fees' },
  { icon: Bot, module: 'RPA Revenue Rail', stack: 'UiPath + UPI AutoPay for stamp-duty', value: '24x7 self-service payments → citizen convenience', ppp: 'Revenue share: 85% govt / 15% operator' },
  { icon: GitCommitHorizontal, module: 'Inclusive-Biz Marketplace', stack: 'Kong open APIs + valuation + micro-loans', value: 'SHGs sell produce collateralised by land titles; fintechs build on same rails', ppp: 'Platform fee: ₹2/API; zero for NGOs' },
  { icon: Milestone, module: 'Value-Add Bundles', stack: 'Drone survey desk + mobile vans', value: 'Paid add-ons keep operator profitable; doorstep service', ppp: 'Ancillary revenue allowed per concession' },
];

const parcels: Parcel[] = [
    { type: 'Feature', properties: { progress: 0.94, id: 'P-1023' }, geometry: { type: 'Polygon', coordinates: [ [[77.60,12.92], [77.61,12.92], [77.61,12.93], [77.60,12.93], [77.60,12.92]] ] } },
    { type: 'Feature', properties: { progress: 0.52, id: 'P-1047', isBPL: true }, geometry: { type: 'Polygon', coordinates: [ [[77.58,12.90], [77.59,12.90], [77.59,12.91], [77.58,12.91], [77.58,12.90]] ] } },
    { type: 'Feature', properties: { progress: 0.35, id: 'P-1055' }, geometry: { type: 'Polygon', coordinates: [ [[77.62,12.91], [77.63,12.91], [77.63,12.92], [77.62,12.92], [77.62,12.91]] ] } },
];


const statusConfig = {
  'In-Progress': { icon: Loader, color: 'text-blue-500', label: 'In Progress' },
  'Pending': { icon: Hourglass, color: 'text-gray-500', label: 'Pending' },
  'Done': { icon: CheckCircle2, color: 'text-emerald-500', label: 'Done' },
  'At-Risk': { icon: ShieldQuestion, color: 'text-amber-500', label: 'At Risk' },
  'Blocked': { icon: AlertTriangle, color: 'text-destructive', label: 'Blocked' },
};


const LoadingOverlay = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-lg"
    >
        <Wand2 className="h-12 w-12 text-primary animate-pulse mb-4" />
        <h3 className="text-lg font-semibold">Contacting Agentic AI...</h3>
        <p className="text-muted-foreground animate-pulse">Analyzing dependencies... Generating optimized workstreams...</p>
    </motion.div>
);


export default function ExecutionPage() {
    const [tasks, setTasks] = useState<any[]>(initialTasks);
    const [isOptimized, setIsOptimized] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isCopilotOpen, setIsCopilotOpen] = useState(false);
    const [copilotContext, setCopilotContext] = useState<any>(null);

    const handleOptimize = () => {
        setIsOptimizing(true);
        setTimeout(() => {
            setIsOptimized(true);
            // In a real app, you'd get this from an API call
            const relevantSubtasks = optimizedSubtasks.filter(st => initialTasks.some(it => it.id === st.parentId));
            setTasks(relevantSubtasks);
            setIsOptimizing(false);
            toast({
                title: 'Task graph re-optimized!',
                description: 'Timeline shrinks 40% with 4-way parallelism.',
            });
        }, 3000);
    };
    
    const openCopilotWithContext = (type: 'explain' | 'split', details: any) => {
        setCopilotContext({ type, details });
        setIsCopilotOpen(true);
    }

    return (
        <TooltipProvider>
            <div className="space-y-8 relative">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold font-headline tracking-tight">✈️ Execution: Deliver & Create Value</h1>
                        <p className="text-muted-foreground mt-1">Manage the project rollout, monitor progress, and discover value-creation opportunities.</p>
                    </div>
                     <Button variant="ghost" size="icon" onClick={() => openCopilotWithContext('default', null)}>
                        <Bot className="h-6 w-6" />
                    </Button>
                </div>

                {/* Section 1 & 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="relative flex flex-col">
                        {isOptimizing && <LoadingOverlay />}
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>1. Task List & AI-Parallelizer</CardTitle>
                                    <CardDescription>{isOptimized ? 'Sub-tasks re-optimized for 4-way parallelism.' : 'High-level project tasks.'}</CardDescription>
                                </div>
                                {!isOptimized && (
                                    <Button onClick={handleOptimize} disabled={isOptimizing}>
                                        <Wand2 className="mr-2" />
                                        Optimize for Parallelism
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow overflow-hidden">
                           <ScrollArea className="h-96 pr-4">
                                <AnimatePresence>
                                    <motion.div layout className="overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Task Name</TableHead>
                                                    <TableHead className="w-[100px]">Duration</TableHead>
                                                    <TableHead className="w-[120px]">Owner</TableHead>
                                                    <TableHead className="w-[120px]">Status</TableHead>
                                                    <TableHead className="text-right w-[80px]">Help</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <AnimatePresence>
                                                    {tasks.map((task, index) => {
                                                        const statusInfo = statusConfig[task.status as keyof typeof statusConfig] || statusConfig['Pending'];
                                                        return (
                                                        <motion.tr
                                                            key={task.id}
                                                            layoutId={task.id}
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                                            className="group"
                                                        >
                                                            <TableCell className={cn("font-medium", task.parentId && "pl-8")}>{task.name}</TableCell>
                                                            <TableCell>{task.duration} d</TableCell>
                                                            <TableCell>{task.owner}</TableCell>
                                                            <TableCell>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <Badge variant={task.status === 'Blocked' ? 'destructive' : 'outline'} className="flex items-center gap-2">
                                                                            <statusInfo.icon className={cn("h-3 w-3", statusInfo.color)} />
                                                                            <span>{statusInfo.label}</span>
                                                                        </Badge>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>{task.progress}% complete</TooltipContent>
                                                                </Tooltip>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button variant="ghost" size="sm" onClick={() => openCopilotWithContext(isOptimized ? 'explain' : 'split', task)}>
                                                                    {isOptimized ? 'Explain' : 'Split'}
                                                                </Button>
                                                            </TableCell>
                                                        </motion.tr>
                                                    );
                                                    })}
                                                </AnimatePresence>
                                            </TableBody>
                                        </Table>
                                    </motion.div>
                                </AnimatePresence>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>2. PPP Delivery-Twin Map & Timeline</CardTitle>
                             <CardDescription>Live spatial simulation combined with Gantt timeline.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full h-[300px] rounded-lg shadow-inner bg-slate-100 overflow-hidden border mb-4">
                                <TwinPreviewMap parcels={parcels} />
                            </div>
                            <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                                <div className="flex items-center gap-2">
                                     <Button variant="outline" size="icon"><Play className="h-4 w-4"/></Button>
                                     <span className="text-sm font-mono">Day 12 / 90</span>
                                </div>
                                <div className="text-xs text-muted-foreground">Gantt Chart Coming Soon</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Section 3 */}
                <Card>
                    <CardHeader>
                        <CardTitle>3. Value-Creation & Service Matrix</CardTitle>
                        <CardDescription>How the project delivers value to citizens and partners.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[25%]">Sub-Module</TableHead>
                                        <TableHead className="w-[25%]">Stack / Process</TableHead>
                                        <TableHead className="w-[25%]">Value & Service</TableHead>
                                        <TableHead className="w-[25%]">PPP Alignment</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {valueMatrix.map((item, index) => (
                                        <TableRow key={index} className="hover:bg-accent/50">
                                            <TableCell className="font-semibold flex items-center gap-2"><item.icon className="h-5 w-5 text-primary" /> {item.module}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{item.stack}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{item.value}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{item.ppp}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                       </div>
                        <div className="flex justify-end mt-4">
                            <Button variant="link" asChild>
                                <Link href="#" onClick={() => openCopilotWithContext('default', null)}>
                                    Learn More <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AiCopilot
                open={isCopilotOpen}
                onOpenChange={setIsCopilotOpen}
                context={copilotContext || { type: 'default', details: null }}
                onApplySuggestion={(suggestion) => {
                    // This is a mock of applying the suggestion.
                    // In a real app, you would update state more robustly.
                    const parentTaskIndex = tasks.findIndex(t => t.id === copilotContext?.details?.id);
                    if (parentTaskIndex !== -1) {
                        const newSubtasks = suggestion.split.map((sub: string, i: number) => ({
                            id: `S${parentTaskIndex+1}-${i+3}`, // Mock ID
                            parentId: copilotContext.details.id,
                            name: sub,
                            duration: 2, // Mock duration
                            owner: tasks[parentTaskIndex].owner,
                            status: 'Pending',
                            progress: 0,
                        }));
                         const newTasks = [...tasks];
                        // Replace parent with subtasks
                        newTasks.splice(parentTaskIndex, 1, ...newSubtasks);
                        setTasks(newTasks);
                         toast({ title: "Suggestion Applied!", description: `${copilotContext.details.name} was split into sub-tasks.` });
                         setIsCopilotOpen(false);
                    }
                }}
            />
        </TooltipProvider>
    );
}
