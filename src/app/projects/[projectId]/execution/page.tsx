
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { AiCopilot } from '@/components/ai-copilot';
import { TwinPreviewMap, type Parcel } from '@/components/twin-preview-map';
import { Wand2, Layers, Bot, Play, Pause, AlertTriangle, ShieldQuestion, Hourglass, CheckCircle2, Loader, Users, Rocket, TestTube2, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export const initialTasks = [
  // Core technical rollout
  { id: 'T1',  name: 'Drone Aerial Survey',           duration: 20, owner: 'Ops Team',     status: 'In-Progress', progress: 45 },
  { id: 'T2',  name: 'High‑Res OCR & Data Ingestion', duration: 15, owner: 'Data Cell',     status: 'At-Risk',     progress: 30 },
  { id: 'T3',  name: 'Boundary Validation',           duration: 18, owner: 'Survey Squad', status: 'Pending',     progress: 0  },
  { id: 'T4',  name: 'Notary‑DAO Smart Contracts',    duration: 12, owner: 'Legal Ops',    status: 'Blocked',     progress: 10 },

  // API & citizen services
  { id: 'T5',  name: 'API Gateway & ULPIN API',       duration: 14, owner: 'Dev Squad',    status: 'In-Progress', progress: 55 },
  { id: 'T6',  name: 'Citizen Mobile App UAT',        duration: 10, owner: 'QA Team',      status: 'Pending',     progress: 0  },
  { id: 'T7',  name: 'RPA Payment Rail Integration',  duration: 16, owner: 'Bot',          status: 'At-Risk',     progress: 40 },
  { id: 'T8',  name: 'Field Surveyor Training',       duration: 8,  owner: 'HR Team',      status: 'Done',        progress: 100},
  { id: 'T9',  name: 'Grievance & Support Portal',    duration: 7,  owner: 'Support',      status: 'Pending',     progress: 0  },

  // Analytics & ops
  { id: 'T10', name: 'Analytics Dashboard Launch',    duration: 12, owner: 'Dev Squad',    status: 'In-Progress', progress: 50 },
  { id: 'T11', name: 'IoT Sensor Deployment',         duration: 22, owner: 'Ops Team',     status: 'In-Progress', progress: 35 },
  { id: 'T12', name: 'Blockchain Audit Trail Setup',  duration: 9,  owner: 'InfoSec',      status: 'Blocked',     progress: 5  },
  { id: 'T13', name: 'NGO Partner Onboarding',        duration: 10, owner: 'Outreach',     status: 'In-Progress', progress: 60 },
  { id: 'T14', name: 'PPP Contract Finalization',     duration: 14, owner: 'Legal Ops',    status: 'At-Risk',     progress: 25 },
  { id: 'T15', name: 'Data Privacy & Policy Review',  duration: 8,  owner: 'Legal Ops',    status: 'Pending',     progress: 0  },

  // Pan‑India coordination & compliance
  { id: 'T16', name: 'State‑Level Coordination',      duration: 30, owner: 'SPV Lead',     status: 'In-Progress', progress: 20 },
  { id: 'T17', name: 'Regulatory Approvals (MoHUA)',  duration: 25, owner: 'Gov Liaison',   status: 'At-Risk',     progress: 15 },
  { id: 'T18', name: 'Environmental Impact Assessment',duration: 20,owner: 'Consultants',  status: 'Pending',     progress: 0  },
  { id: 'T19', name: 'Cultural Heritage Audit',       duration: 14, owner: 'Cultural Dept',status: 'Pending',     progress: 0  },
  { id: 'T20', name: 'Accessibility Compliance Audit',duration: 12, owner: 'UX Team',      status: 'Pending',     progress: 0  },

  // Finance & PPP
  { id: 'T21', name: 'Financial Model Calibration',   duration: 18, owner: 'Finance',      status: 'In-Progress', progress: 40 },
  { id: 'T22', name: 'Viability Gap Funding Approv.',  duration: 16, owner: 'Finance',      status: 'Blocked',     progress: 10 },
  { id: 'T23', name: 'Treasury Integration (States)', duration: 22, owner: 'Dev Squad',    status: 'Pending',     progress: 0  },
  { id: 'T24', name: 'Revenue Collection Testing',    duration: 15, owner: 'QA Team',      status: 'At-Risk',     progress: 30 },

  // Community & outreach
  { id: 'T25', name: 'Community Workshops',           duration: 12, owner: 'Outreach',     status: 'In-Progress', progress: 35 },
  { id: 'T26', name: 'Citizen Communication Campaign',duration: 10, owner: 'Comm Team',    status: 'Pending',     progress: 0  },
  { id: 'T27', name: 'Mobile Van Circuit Planning',   duration: 16, owner: 'Ops Team',     status: 'In-Progress', progress: 45 },
  { id: 'T28', name: 'Localization & Translation',    duration: 14, owner: 'UX Team',      status: 'Pending',     progress: 0  },
  { id: 'T29', name: 'Disaster Recovery Planning',    duration: 20, owner: 'InfoSec',      status: 'Pending',     progress: 0  },
  { id: 'T30', name: 'Training‑of‑Trainers (TOT)',     duration: 18, owner: 'HR Team',      status: 'Pending',     progress: 0  },
];


// data/store/bhu-setu/optimizedSubtasks.ts

export const optimizedSubtasks = [
  // T1: Drone Aerial Survey
  { id:'S1-1',  parentId:'T1', name:'Procure Survey Drones',           duration:10, owner:'Ops Team',     status:'Done',        progress:100, critical:false, parcelId:'P-1023' },
  { id:'S1-2',  parentId:'T1', name:'Execute Aerial Imaging Flights',  duration:10, owner:'Ops Team',     status:'In-Progress', progress:45,  critical:true,  parcelId:'P-1023' },

  // T2: High‑Res OCR & Data Ingestion
  { id:'S2-1',  parentId:'T2', name:'Bulk Document Scanning',          duration:8,  owner:'Data Cell',    status:'At-Risk',     progress:30,  critical:true },
  { id:'S2-2',  parentId:'T2', name:'AI‑OCR Cleanup & Indexing',       duration:7,  owner:'Data Cell',    status:'Pending',     progress:0,   critical:false },

  // T3: Boundary Validation
  { id:'S3-1',  parentId:'T3', name:'Vector Overlay Analysis',         duration:9,  owner:'Survey Squad', status:'Pending',     progress:0,   critical:true,  parcelId:'P-1047' },
  { id:'S3-2',  parentId:'T3', name:'Field Re‑survey & Reconciliation',duration:9,  owner:'Survey Squad', status:'Pending',     progress:0,   critical:true,  parcelId:'P-1047' },

  // T4: Notary‑DAO Smart Contracts
  { id:'S4-1',  parentId:'T4', name:'Draft Legal Specification',        duration:6,  owner:'Legal Ops',    status:'Blocked',     progress:10,  critical:true,  parcelId:'P-1055' },
  { id:'S4-2',  parentId:'T4', name:'Code & Deploy Smart Contracts',    duration:6,  owner:'Dev Squad',    status:'Pending',     progress:0,   critical:true,  parcelId:'P-1055' },

  // T5: API Gateway & ULPIN API
  { id:'S5-1',  parentId:'T5', name:'Design API Schema',                duration:7,  owner:'Dev Squad',    status:'Done',        progress:100, critical:false },
  { id:'S5-2',  parentId:'T5', name:'Implement & Test Endpoints',       duration:7,  owner:'Dev Squad',    status:'In-Progress', progress:55,  critical:false },

  // T6: Citizen Mobile App UAT
  { id:'S6-1',  parentId:'T6', name:'Usability Testing',                duration:5,  owner:'QA Team',      status:'Pending',     progress:0,   critical:false },
  { id:'S6-2',  parentId:'T6', name:'Bug Fix & Regression',             duration:5,  owner:'Dev Squad',    status:'Pending',     progress:0,   critical:true },

  // T7: RPA Payment Rail Integration
  { id:'S7-1',  parentId:'T7', name:'Configure UiPath Workflows',       duration:8,  owner:'Bot',          status:'At-Risk',     progress:40,  critical:true },
  { id:'S7-2',  parentId:'T7', name:'Integrate UPI AutoPay Module',     duration:8,  owner:'Dev Squad',    status:'At-Risk',     progress:40,  critical:true },

  // T8: Field Surveyor Training
  { id:'S8-1',  parentId:'T8', name:'Curriculum Development',           duration:4,  owner:'HR Team',      status:'Done',        progress:100, critical:false },
  { id:'S8-2',  parentId:'T8', name:'Nationwide Training Rollout',      duration:4,  owner:'HR Team',      status:'Done',        progress:100, critical:false },

  // T9: Grievance & Support Portal
  { id:'S9-1',  parentId:'T9', name:'Ticketing System Setup',           duration:4,  owner:'Support',      status:'Pending',     progress:0,   critical:false },
  { id:'S9-2',  parentId:'T9', name:'Live Chat Integration',            duration:3,  owner:'Support',      status:'Pending',     progress:0,   critical:false },

  // T10: Analytics Dashboard Launch
  { id:'S10-1', parentId:'T10',name:'Data Model & ETL Pipelines',        duration:6,  owner:'Dev Squad',    status:'In-Progress', progress:50,  critical:true },
  { id:'S10-2', parentId:'T10',name:'UI Component Development',          duration:6,  owner:'Dev Squad',    status:'In-Progress', progress:50,  critical:true },

  // T11: IoT Sensor Deployment
  { id:'S11-1', parentId:'T11',name:'Install LoRaWAN Gateways',         duration:12, owner:'Ops Team',     status:'In-Progress', progress:35,  critical:true,  parcelId:'P-1023' },
  { id:'S11-2', parentId:'T11',name:'Deploy Road Roughness Sensors',     duration:10, owner:'Ops Team',     status:'Pending',     progress:0,   critical:false },

  // T12: Blockchain Audit Trail Setup
  { id:'S12-1', parentId:'T12',name:'Hyperledger Network Setup',         duration:5,  owner:'InfoSec',      status:'Blocked',     progress:5,   critical:true },
  { id:'S12-2', parentId:'T12',name:'Smart Audit‑Log Implementation',    duration:4,  owner:'Dev Squad',    status:'Pending',     progress:0,   critical:false },

  // T13: NGO Partner Onboarding
  { id:'S13-1', parentId:'T13',name:'Identify Key NGOs',                duration:5,  owner:'Outreach',     status:'In-Progress', progress:60,  critical:false },
  { id:'S13-2', parentId:'T13',name:'Onboard & Train NGO Staff',        duration:5,  owner:'Outreach',     status:'In-Progress', progress:60,  critical:false },

  // T14: PPP Contract Finalization
  { id:'S14-1', parentId:'T14',name:'Draft Concession Agreement',        duration:7,  owner:'Legal Ops',    status:'At-Risk',     progress:25,  critical:true },
  { id:'S14-2', parentId:'T14',name:'Stakeholder Legal Review',         duration:7,  owner:'Legal Ops',    status:'At-Risk',     progress:25,  critical:true },

  // T15: Data Privacy & Policy Review
  { id:'S15-1', parentId:'T15',name:'Draft Data Policy Document',       duration:4,  owner:'Legal Ops',    status:'Pending',     progress:0,   critical:false },
  { id:'S15-2', parentId:'T15',name:'Compliance Audit with MoHUA',      duration:4,  owner:'Legal Ops',    status:'Pending',     progress:0,   critical:false },

  // T16: State‑Level Coordination
  { id:'S16-1', parentId:'T16',name:'Schedule State Kickoff Meetings',  duration:10, owner:'SPV Lead',     status:'In-Progress', progress:20,  critical:true },
  { id:'S16-2', parentId:'T16',name:'Establish Regional Hubs',          duration:20, owner:'SPV Lead',     status:'In-Progress', progress:20,  critical:true },

  // T17: Regulatory Approvals (MoHUA)
  { id:'S17-1', parentId:'T17',name:'Prepare Regulatory Submission',    duration:12, owner:'Gov Liaison',  status:'At-Risk',     progress:15,  critical:true },
  { id:'S17-2', parentId:'T17',name:'Follow Up & Clarifications',       duration:13, owner:'Gov Liaison',  status:'At-Risk',     progress:15,  critical:true },

  // T18: Environmental Impact Assessment
  { id:'S18-1', parentId:'T18',name:'Conduct Field Survey',             duration:10, owner:'Consultants',  status:'Pending',     progress:0,   critical:true },
  { id:'S18-2', parentId:'T18',name:'Draft EIA Report',                 duration:10, owner:'Consultants',  status:'Pending',     progress:0,   critical:true },

  // T19: Cultural Heritage Audit
  { id:'S19-1', parentId:'T19',name:'Inventory Heritage Sites',         duration:7,  owner:'Cultural Dept',status:'Pending',     progress:0,   critical:false },
  { id:'S19-2', parentId:'T19',name:'Mitigation Plan Drafting',         duration:7,  owner:'Cultural Dept',status:'Pending',     progress:0,   critical:false },

  // T20: Accessibility Compliance Audit
  { id:'S20-1', parentId:'T20',name:'Accessibility Standards Review',  duration:6,  owner:'UX Team',      status:'Pending',     progress:0,   critical:false },
  { id:'S20-2', parentId:'T20',name:'Implement WCAG Fixes',            duration:6,  owner:'UX Team',      status:'Pending',     progress:0,   critical:false },

  // T21: Financial Model Calibration
  { id:'S21-1', parentId:'T21',name:'Refine Cash Flow Projections',     duration:9,  owner:'Finance',      status:'In-Progress', progress:40,  critical:false },
  { id:'S21-2', parentId:'T21',name:'Stress-Test Scenarios',            duration:9,  owner:'Finance',      status:'In-Progress', progress:40,  critical:true },

  // T22: Viability Gap Funding Approval
  { id:'S22-1', parentId:'T22',name:'Prepare VGF Proposal',            duration:8,  owner:'Finance',      status:'Blocked',     progress:10,  critical:true },
  { id:'S22-2', parentId:'T22',name:'DP for MoF Review',               duration:8,  owner:'Gov Liaison',  status:'Blocked',     progress:10,  critical:true },

  // T23: Treasury Integration (States)
  { id:'S23-1', parentId:'T23',name:'Design Treasury API',             duration:11, owner:'Dev Squad',    status:'Pending',     progress:0,   critical:true },
  { id:'S23-2', parentId:'T23',name:'Implement State Connectors',      duration:11, owner:'Dev Squad',    status:'Pending',     progress:0,   critical:true },

  // T24: Revenue Collection Testing
  { id:'S24-1', parentId:'T24',name:'Simulate Payment Flows',          duration:8,  owner:'QA Team',      status:'At-Risk',     progress:30,  critical:true },
  { id:'S24-2', parentId:'T24',name:'Failover & Load Testing',         duration:7,  owner:'QA Team',      status:'At-Risk',     progress:30,  critical:true },

  // T25: Community Workshops
  { id:'S25-1', parentId:'T25',name:'Curriculum & Materials Prep',     duration:6,  owner:'Outreach',     status:'In-Progress', progress:35,  critical:false },
  { id:'S25-2', parentId:'T25',name:'Execute District Workshops',      duration:6,  owner:'Outreach',     status:'In-Progress', progress:35,  critical:false },

  // T26: Citizen Communication Campaign
  { id:'S26-1', parentId:'T26',name:'Draft Messaging & Content',      duration:5,  owner:'Comm Team',    status:'Pending',     progress:0,   critical:false },
  { id:'S26-2', parentId:'T26',name:'Broadcast via Radio/TV',         duration:5,  owner:'Comm Team',    status:'Pending',     progress:0,   critical:false },

  // T27: Mobile Van Circuit Planning
  { id:'S27-1', parentId:'T27',name:'Route Optimization Analysis',     duration:8,  owner:'Ops Team',     status:'In-Progress', progress:45,  critical:false },
  { id:'S27-2', parentId:'T27',name:'Equip & Dispatch Vans',           duration:8,  owner:'Ops Team',     status:'In-Progress', progress:45,  critical:false },

  // T28: Localization & Translation
  { id:'S28-1', parentId:'T28',name:'Translate UI Text',              duration:7,  owner:'UX Team',      status:'Pending',     progress:0,   critical:false },
  { id:'S28-2', parentId:'T28',name:'Voice‑over & Subtitles',         duration:7,  owner:'UX Team',      status:'Pending',     progress:0,   critical:false },

  // T29: Disaster Recovery Planning
  { id:'S29-1', parentId:'T29',name:'Define RTO & RPO Metrics',       duration:10, owner:'InfoSec',      status:'Pending',     progress:0,   critical:true },
  { id:'S29-2', parentId:'T29',name:'DR Drill & Documentation',       duration:10, owner:'InfoSec',      status:'Pending',     progress:0,   critical:true },

  // T30: Training‑of‑Trainers (TOT)
  { id:'S30-1', parentId:'T30',name:'Master Trainer Selection',       duration:9,  owner:'HR Team',      status:'Pending',     progress:0,   critical:false },
  { id:'S30-2', parentId:'T30',name:'Conduct TOT Workshops',          duration:9,  owner:'HR Team',      status:'Pending',     progress:0,   critical:false },
];


export const parcels = [
  {
    type: 'Feature',
    properties: {
      progress: 0.94,
      id: 'P-1023',
      owner: 'Ops Team',
      isBPL: false
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [77.60, 12.92], [77.61, 12.92],
        [77.61, 12.93], [77.60, 12.93], [77.60, 12.92]
      ]]
    }
  },
  {
    type: 'Feature',
    properties: {
      progress: 0.52,
      id: 'P-1047',
      owner: 'Data Cell',
      isBPL: true
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [77.58, 12.90], [77.59, 12.90],
        [77.59, 12.91], [77.58, 12.91], [77.58, 12.90]
      ]]
    }
  },
  {
    type: 'Feature',
    properties: {
      progress: 0.35,
      id: 'P-1055',
      owner: 'Legal Ops',
      isBPL: false
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [77.62, 12.91], [77.63, 12.91],
        [77.63, 12.92], [77.62, 12.92], [77.62, 12.91]
      ]]
    }
  }
];

// 4) Status → Icon & Color mapping
export const statusConfig = {
  'In-Progress':    { icon: Loader,         color: 'text-blue-500',     label: 'In Progress' },
  'Pending':        { icon: Hourglass,       color: 'text-gray-500',     label: 'Pending'    },
  'Done':           { icon: CheckCircle2,    color: 'text-emerald-500',  label: 'Done'       },
  'At-Risk':        { icon: ShieldQuestion,  color: 'text-amber-500',    label: 'At Risk'    },
  'Blocked':        { icon: AlertTriangle,   color: 'text-destructive',  label: 'Blocked'    },
};

// 5) Owner → Avatar/Icon & Color
export const teamConfig = {
  'Ops Team':    { icon: Rocket,        color: 'bg-sky-500'    },
  'Dev Squad':   { icon: Bot,           color: 'bg-blue-500'   },
  'Legal Ops':   { icon: Shield,        color: 'bg-rose-500'   },
  'Data Cell':   { icon: Layers,        color: 'bg-amber-500'  },
  'QA Team':     { icon: TestTube2,     color: 'bg-fuchsia-500'},
  'HR Team':     { icon: Users,         color: 'bg-indigo-500' },
  'InfoSec':     { icon: Shield,        color: 'bg-red-700'    },
  'Support':     { icon: Users,         color: 'bg-lime-500'   },
  'Outreach':    { icon: Users,         color: 'bg-teal-500'   },
  'Default':     { icon: Users,         color: 'bg-slate-500'  },
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
    const [isPlaying, setIsPlaying] = useState(false);
    const [day, setDay] = useState(12);
    const [hoveredTask, setHoveredTask] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [lastNotificationId, setLastNotificationId] = useState(0);

    const timelineDuration = 90;

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && day < timelineDuration) {
            timer = setTimeout(() => setDay(day + 1), 200);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, day]);

    // Live notification system for critical issues
    useEffect(() => {
        const criticalTasks = tasks.filter(task => task.status === 'Blocked' || task.status === 'At-Risk' || (task.critical && isOptimized));
        
        const notificationTypes = [
            '🚨 New blocker detected',
            '⚠️ Task moved to at-risk',
            '🔧 Dependency issue found',
            '📊 Progress stalled',
            '⏰ Deadline approaching'
        ];

        const generateNotification = () => {
            if (criticalTasks.length > 0) {
                const randomTask = criticalTasks[Math.floor(Math.random() * criticalTasks.length)];
                const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
                
                const notification = {
                    id: lastNotificationId + 1,
                    type: randomType,
                    task: randomTask.name,
                    owner: randomTask.owner,
                    timestamp: new Date().toLocaleTimeString(),
                    severity: randomTask.status === 'Blocked' ? 'high' : 'medium'
                };

                // Show toast notification first
                toast({
                    title: notification.type,
                    description: `${notification.task} • ${notification.owner}`,
                    variant: notification.severity === 'high' ? 'destructive' : 'default',
                });

                // Then add to the persistent notifications list
                setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only 5 notifications
                setLastNotificationId(prev => prev + 1);
            }
        };

        // Generate notifications every 3-5 seconds when there are critical tasks
        const interval = setInterval(generateNotification, Math.random() * 2000 + 3000);

        return () => clearInterval(interval);
    }, [tasks, isOptimized, lastNotificationId]);

    // Auto-remove old notifications
    useEffect(() => {
        const cleanup = setTimeout(() => {
            setNotifications(prev => prev.slice(0, 3));
        }, 10000);
        return () => clearTimeout(cleanup);
    }, [notifications]);

    const handleOptimize = () => {
        setIsOptimizing(true);
        setTimeout(() => {
            setIsOptimized(true);
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
                        <h1 className="text-4xl font-bold font-headline tracking-tight">🚀 Execution: Task Management & Progress Tracking</h1>
                        <p className="text-muted-foreground mt-1">Monitor project rollout with AI-powered task optimization and real-time progress visualization.</p>
                    </div>
                     <Button variant="ghost" size="icon" onClick={() => openCopilotWithContext('explain', null)}>
                        <Bot className="h-6 w-6" />
                    </Button>
                </div>

                {/* Section 1: Task List & AI-Parallelizer - FULL SCREEN */}
                <Card className="relative flex flex-col">
                    {isOptimizing && <LoadingOverlay />}
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl">🤖 Task List & AI-Parallelizer</CardTitle>
                                <CardDescription className="text-lg mt-2">
                                    {isOptimized ? 'Sub-tasks re-optimized for 4-way parallelism - timeline reduced by 40%' : 'High-level project tasks ready for AI optimization'}
                                </CardDescription>
                            </div>
                            {!isOptimized && (
                                <Button onClick={handleOptimize} disabled={isOptimizing} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    <Wand2 className="mr-2 h-5 w-5" />
                                    Optimize for Parallelism
                                </Button>
                            )}
                            {isOptimized && (
                                <div className="flex items-center space-x-2">
                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                                        ✅ Optimized
                                    </Badge>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => setIsPlaying(!isPlaying)}>
                                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                        </Button>
                                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">Day {day} / {timelineDuration}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                       <ScrollArea className="h-[600px] pr-4">
                            <AnimatePresence>
                                <motion.div layout className="overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b-2">
                                                <TableHead className="font-semibold">Task Name</TableHead>
                                                <TableHead className="w-[100px] font-semibold">Duration</TableHead>
                                                <TableHead className="w-[120px] font-semibold">Owner</TableHead>
                                                <TableHead className="w-[100px] font-semibold">Progress</TableHead>
                                                <TableHead className="w-[120px] font-semibold">Status</TableHead>
                                                <TableHead className="text-right w-[80px] font-semibold">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <AnimatePresence>
                                                {tasks.map((task, index) => {
                                                    const statusInfo = statusConfig[task.status as keyof typeof statusConfig] || statusConfig['Pending'];
                                                    const teamInfo = teamConfig[task.owner] || teamConfig.Default;
                                                    return (
                                                    <motion.tr
                                                        key={task.id}
                                                        layoutId={task.id}
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                                        className={cn(
                                                            "group hover:bg-muted/50 transition-colors",
                                                            task.critical && isOptimized ? 'bg-amber-50/50 border-l-4 border-amber-400' : '',
                                                            task.parentId && "bg-slate-50/50"
                                                        )}
                                                        onMouseEnter={() => task.parcelId && setHoveredTask(task.parcelId)}
                                                        onMouseLeave={() => setHoveredTask(null)}
                                                    >
                                                        <TableCell className={cn("font-medium", task.parentId && "pl-8")}>
                                                            <div className="flex items-center gap-2">
                                                                <teamInfo.icon className={cn("h-4 w-4 rounded p-0.5 text-white", teamInfo.color)} />
                                                                <span>{task.name}</span>
                                                                {task.critical && isOptimized && (
                                                                    <Badge variant="destructive" className="text-xs">Critical Path</Badge>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="font-mono">{task.duration}d</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="text-xs">
                                                                {task.owner}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="space-y-1">
                                                                <div className="flex justify-between text-xs">
                                                                    <span>{task.progress}%</span>
                                                                </div>
                                                                <Progress value={task.progress} className="h-2" />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <Badge variant={task.status === 'Blocked' ? 'destructive' : task.status === 'At-Risk' ? 'secondary' : 'outline'} className="flex items-center gap-2">
                                                                        <statusInfo.icon className={cn("h-3 w-3", statusInfo.color)} />
                                                                        <span>{statusInfo.label}</span>
                                                                    </Badge>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Click for AI assistance</TooltipContent>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="sm" onClick={() => openCopilotWithContext(isOptimized ? 'explain' : 'split', task)}>
                                                                {isOptimized ? '🔍' : '✂️'}
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

                {/* Section 2: Digital Twin Map & Timeline */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <Card className="xl:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layers className="h-5 w-5 text-blue-600" />
                                Digital Twin Progress Map
                            </CardTitle>
                            <CardDescription>Live spatial visualization of task progress across project parcels</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full h-[400px] rounded-lg shadow-inner bg-slate-100 overflow-hidden border mb-4">
                                <TwinPreviewMap parcels={parcels} highlightedParcel={hoveredTask} />
                            </div>
                            {hoveredTask && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm font-medium text-blue-800">
                                        📍 Viewing parcel: {hoveredTask}
                                    </p>
                                    <p className="text-xs text-blue-600">
                                        Hover over tasks to see their spatial context
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Task Timeline</CardTitle>
                            <CardDescription>Track progress over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isOptimized && (
                                <div className="space-y-4">
                                    <ScrollArea className="h-80">
                                        <div className="space-y-3 pr-4">
                                            {tasks.filter(t => t.parcelId).map(task => {
                                                const team = teamConfig[task.owner as keyof typeof teamConfig] || teamConfig.Default;
                                                return (
                                                    <Tooltip key={task.id}>
                                                        <TooltipTrigger asChild>
                                                            <div
                                                                className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                                                onMouseEnter={() => setHoveredTask(task.parcelId)}
                                                                onMouseLeave={() => setHoveredTask(null)}
                                                            >
                                                                <team.icon className={cn("h-5 w-5 rounded-full p-0.5 text-white", team.color)} />
                                                                <div className="flex-grow space-y-1">
                                                                    <p className="text-sm font-medium leading-none">{task.name}</p>
                                                                    <Progress value={task.progress} className={cn("h-2", task.critical ? 'bg-amber-200 [&>div]:bg-amber-500' : '')} />
                                                                    <p className="text-xs text-muted-foreground">{task.progress}% complete</p>
                                                                </div>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{task.owner} - {task.status}</p>
                                                            {task.critical && <p className="text-amber-600 font-bold">⚠️ Critical Path</p>}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )
                                            })}
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}
                            {!isOptimized && (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p className="text-sm">Run AI optimization to see timeline view</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Execution Metrics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tasks.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {isOptimized ? 'Optimized subtasks' : 'High-level tasks'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100)}%
                            </div>
                            <Progress
                                value={(tasks.filter(t => t.status === 'Done').length / tasks.length) * 100}
                                className="mt-2"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">At Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600">
                                {tasks.filter(t => t.status === 'At-Risk' || t.status === 'Blocked').length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Tasks needing attention
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Timeline Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">
                                Day {day}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                of {timelineDuration} day project
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Team Performance & Insights */}
                <Card>
                    <CardHeader>
                        <CardTitle>3. Team Performance & Critical Path Analysis</CardTitle>
                        <CardDescription>Track team productivity and identify bottlenecks in the project execution.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Team Performance */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm">Team Workload Distribution</h4>
                                <div className="space-y-3">
                                    {Object.entries(
                                        tasks.reduce((acc: any, task) => {
                                            acc[task.owner] = acc[task.owner] || { total: 0, done: 0, blocked: 0 };
                                            acc[task.owner].total++;
                                            if (task.status === 'Done') acc[task.owner].done++;
                                            if (task.status === 'Blocked' || task.status === 'At-Risk') acc[task.owner].blocked++;
                                            return acc;
                                        }, {})
                                    ).map(([team, stats]: [string, any]) => {
                                        const teamInfo = teamConfig[team] || teamConfig.Default;
                                        const completionRate = Math.round((stats.done / stats.total) * 100);
                                        return (
                                            <div key={team} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <teamInfo.icon className={cn("h-5 w-5 rounded p-0.5 text-white", teamInfo.color)} />
                                                    <div>
                                                        <p className="font-medium text-sm">{team}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {stats.total} tasks • {stats.done} done • {stats.blocked} at risk
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-sm">{completionRate}%</p>
                                                    <Progress value={completionRate} className="w-16 h-1 mt-1" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Critical Path & Blockers */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-sm">Critical Issues & Blockers</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-muted-foreground">Live feed</span>
                                    </div>
                                </div>

                                {/* Recent Notifications Feed */}
                                {notifications.length > 0 && (
                                    <div className="space-y-2">
                                        <h5 className="text-xs font-medium text-muted-foreground">Recent Alerts</h5>
                                        <div className="space-y-1">
                                            <AnimatePresence mode="popLayout">
                                                {notifications.slice(0, 3).map((notification) => (
                                                    <motion.div
                                                        key={notification.id}
                                                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                        className={cn(
                                                            "p-2 rounded-lg border-l-2 text-xs",
                                                            notification.severity === 'high' 
                                                                ? "border-red-500 bg-red-50/50" 
                                                                : "border-amber-500 bg-amber-50/50"
                                                        )}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-slate-800">
                                                                {notification.type}
                                                            </span>
                                                            <span className="text-slate-500">
                                                                {notification.timestamp}
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-600 mt-0.5">
                                                            {notification.task} • {notification.owner}
                                                        </p>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                        <Separator className="my-3" />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <h5 className="text-xs font-medium text-muted-foreground">Active Issues</h5>
                                    <AnimatePresence>
                                        {tasks
                                            .filter(task => task.status === 'Blocked' || task.status === 'At-Risk' || (task.critical && isOptimized))
                                            .slice(0, 5)
                                            .map((task) => {
                                                const statusInfo = statusConfig[task.status as keyof typeof statusConfig];
                                                return (
                                                    <motion.div
                                                        key={task.id}
                                                        layout
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        className="flex items-center gap-3 p-2 border rounded-lg hover:bg-muted/50 transition-colors"
                                                    >
                                                        <div className="relative">
                                                            <statusInfo.icon className={cn("h-4 w-4", statusInfo.color)} />
                                                            {task.status === 'Blocked' && (
                                                                <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm truncate">{task.name}</p>
                                                            <p className="text-xs text-muted-foreground">{task.owner}</p>
                                                        </div>
                                                        {task.critical && isOptimized && (
                                                            <Badge variant="destructive" className="text-xs animate-pulse">Critical</Badge>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openCopilotWithContext('explain', task)}
                                                            className="shrink-0"
                                                        >
                                                            Help
                                                        </Button>
                                                    </motion.div>
                                                );
                                            })}
                                    </AnimatePresence>
                                    {tasks.filter(task => task.status === 'Blocked' || task.status === 'At-Risk').length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-6 text-muted-foreground"
                                        >
                                            <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
                                            <p className="text-sm">No critical issues detected!</p>
                                            <p className="text-xs mt-1">All systems running smoothly</p>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
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

