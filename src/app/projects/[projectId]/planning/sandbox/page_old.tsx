'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis,
  RadialBarChart, RadialBar, Tooltip as RechartsTooltip
} from 'recharts';
import {
  Info, Repeat, XCircle, Users, Target, Banknote, Landmark, Shield,
  Play, Pause, RotateCcw, Layers, Settings, HelpCircle, MessageCircle,
  Zap, Activity, AlertTriangle, CheckCircle, Eye, EyeOff, Sparkles,
  ChevronDown, ChevronUp, Save, Trash2, Bot, Coffee, Wifi, Home
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { failureDrivers } from '@/data/planning';
import { TwinPreviewMap, type Parcel } from '@/components/twin-preview-map';
import { cn } from '@/lib/utils';

// Data for sandbox simulation
const initialParcels: Parcel[] = [
    { type: 'Feature', properties: { progress: 0.64, id: 'P-1023' }, geometry: { type: 'Polygon', coordinates: [ [[77.60,12.92], [77.61,12.92], [77.61,12.93], [77.60,12.93], [77.60,12.92]] ] } },
    { type: 'Feature', properties: { progress: 0.22, id: 'P-1047', isBPL: true }, geometry: { type: 'Polygon', coordinates: [ [[77.58,12.90], [77.59,12.90], [77.59,12.91], [77.58,12.91], [77.58,12.90]] ] } },
    { type: 'Feature', properties: { progress: 0.85, id: 'P-1055' }, geometry: { type: 'Polygon', coordinates: [ [[77.62,12.91], [77.63,12.91], [77.63,12.92], [77.62,12.92], [77.62,12.91]] ] } },
    { type: 'Feature', properties: { progress: 0.45, id: 'P-1061', isBPL: true }, geometry: { type: 'Polygon', coordinates: [ [[77.59,12.93], [77.60,12.93], [77.60,12.94], [77.59,12.94], [77.59,12.93]] ] } },
];

// Enhanced Components for Digital Twin Sandbox
const IRRGauge = ({ value }: { value: number }) => {
    const getColor = (val: number) => {
        if (val >= 13) return 'hsl(142, 76%, 36%)'; // emerald-600
        if (val >= 10) return 'hsl(45, 93%, 47%)'; // amber-500
        return 'hsl(0, 84%, 60%)'; // red-500
    };

    const data = [{ value: Math.min(value, 20), fill: getColor(value) }];

    return (
        <div className="relative w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    data={data}
                    startAngle={180}
                    endAngle={0}
                >
                    <RadialBar dataKey="value" cornerRadius={10} fill={getColor(value)} />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    className="text-3xl font-bold"
                    style={{ color: getColor(value) }}
                    key={value}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    {value.toFixed(1)}%
                </motion.span>
                <span className="text-xs text-muted-foreground">Target IRR</span>
            </div>
        </div>
    );
};

const StreamingIoTChart = () => {
    const [data, setData] = useState<Array<{time: number, packets: number}>>([]);
    const [isLive, setIsLive] = useState(true);

    useEffect(() => {
        if (!isLive) return;

        const interval = setInterval(() => {
            setData(prev => {
                const newPoint = {
                    time: Date.now(),
                    packets: Math.floor(Math.random() * 50) + 20
                };
                const newData = [...prev, newPoint].slice(-15); // Keep last 15 points
                return newData;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isLive]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">IoT Packets/min</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLive(!isLive)}
                    className="h-6 px-2 text-xs"
                >
                    {isLive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
            </div>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <XAxis
                            dataKey="time"
                            type="number"
                            scale="time"
                            domain={['dataMin', 'dataMax']}
                            tickFormatter={() => ''}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 80]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10 }}
                            width={30}
                        />
                        <RechartsTooltip
                            labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                            formatter={(value: any) => [`${value} packets`, 'IoT Stream']}
                            contentStyle={{
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px',
                                fontSize: '12px'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="packets"
                            stroke="hsl(142, 76%, 36%)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 3, fill: 'hsl(142, 76%, 36%)' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const AnomalyFeed = () => {
    const anomalies = [
        { id: 'A-27', label: 'Drone permit delays', impact: -14, severity: 'high', icon: AlertTriangle, color: 'text-red-500' },
        { id: 'A-42', label: 'API auth errors', impact: 4, severity: 'medium', icon: Wifi, color: 'text-amber-500' },
        { id: 'A-58', label: 'On-time payouts', impact: 0, severity: 'low', icon: CheckCircle, color: 'text-emerald-500' },
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm text-muted-foreground">Live Anomalies</h4>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-muted-foreground">3 active</span>
                </div>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto">
                {anomalies.map((anomaly, index) => (
                    <motion.div
                        key={anomaly.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer group"
                        whileHover={{ scale: 1.02, x: 4 }}
                    >
                        <anomaly.icon className={`h-4 w-4 ${anomaly.color} flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{anomaly.id}: {anomaly.label}</p>
                            <p className="text-xs text-muted-foreground">
                                {anomaly.impact > 0 ? '+' : ''}{anomaly.impact}% pace impact
                            </p>
                        </div>
                        <Badge
                            variant={anomaly.severity === 'high' ? 'destructive' : anomaly.severity === 'medium' ? 'default' : 'secondary'}
                            className="text-xs px-2 py-0"
                        >
                            {anomaly.severity}
                        </Badge>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const ScenarioChip = ({ scenario, onRemove, onRunMC }: {
    scenario: any,
    onRemove: () => void,
    onRunMC: () => void
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2"
    >
        <span className="text-sm font-medium text-blue-800">
            {scenario.name}: IRR {scenario.irr}% | {scenario.timeline} | Pass {scenario.passRate}%
        </span>
        <Button variant="ghost" size="sm" onClick={onRunMC}>
            <Settings className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onRemove}>
            <XCircle className="h-3 w-3" />
        </Button>
    </motion.div>
);

const CopilotChat = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [messages] = useState([
        {
            id: 1,
            type: 'ai',
            content: 'I can suggest a subsidy mix to improve BPL coverage—run analysis?',
            suggestions: [
                { label: 'Increase BPL Subsidy to 15%', action: 'subsidy-15' },
                { label: 'Extend concession to 18 years', action: 'concession-18' }
            ]
        }
    ]);

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="w-96">
                <SheetHeader>
                    <SheetTitle className="flex items-center">
                        <Bot className="mr-2 h-5 w-5 text-blue-500" />
                        AI Copilot
                    </SheetTitle>
                    <SheetDescription>
                        Real-time scenario optimization and insights
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 mt-6">
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                        >
                            <p className="text-sm text-blue-800 mb-3">{message.content}</p>
                            {message.suggestions && (
                                <div className="space-y-2">
                                    {message.suggestions.map((suggestion, index) => (
                                        <motion.button
                                            key={index}
                                            className="w-full text-left p-2 text-xs bg-white border border-blue-300 rounded hover:bg-blue-50 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {suggestion.label}
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
};

const InclusiveBizCanvas = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const revenueMix = [
        { name: 'User Fees', value: 40, color: 'hsl(var(--chart-1))' },
        { name: 'API Market', value: 35, color: 'hsl(var(--chart-2))' },
        { name: 'Govt Grant', value: 25, color: 'hsl(var(--chart-4))' },
    ];

    return (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <Card className="border-2 border-purple-100 shadow-lg">
                <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors duration-200 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CardTitle className="flex items-center text-lg">
                                    <Home className="mr-2 h-5 w-5 text-purple-500" />
                                    Inclusive Biz Canvas
                                </CardTitle>
                                <Badge variant="secondary" className="ml-3 text-xs">
                                    Revenue Sustainability
                                </Badge>
                            </div>
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="h-4 w-4" />
                            </motion.div>
                        </div>
                        <CardDescription className="mt-2">
                            Revenue diversification model ensuring long-term sustainability
                        </CardDescription>
                    </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <CardContent className="pt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column - Revenue Mix */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm">Revenue Mix</h4>
                                <div className="flex items-center justify-center">
                                    <ResponsiveContainer width={200} height={200}>
                                        <PieChart>
                                            <Pie
                                                data={revenueMix}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                innerRadius={40}
                                            >
                                                {revenueMix.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {revenueMix.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="text-xs">{item.name}: {item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column - Value Propositions */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-sm">Key Value Propositions</h4>
                                <div className="space-y-3">
                                    <motion.div
                                        className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <h5 className="font-medium text-sm text-blue-800">Citizens</h5>
                                        <p className="text-xs text-blue-600 mt-1">Instant land records, reduced processing time from 45 days to 2 hours</p>
                                    </motion.div>

                                    <motion.div
                                        className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <h5 className="font-medium text-sm text-emerald-800">Government</h5>
                                        <p className="text-xs text-emerald-600 mt-1">Revenue generation via API marketplace, improved transparency</p>
                                    </motion.div>

                                    <motion.div
                                        className="p-3 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <h5 className="font-medium text-sm text-purple-800">Private Sector</h5>
                                        <p className="text-xs text-purple-600 mt-1">Real-time land data APIs for fintech, insurance, & real estate</p>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
};

export default function SandboxPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // Enhanced state for digital twin
    const [concession, setConcession] = useState(15);
    const [fee, setFee] = useState(40);
    const [annuity, setAnnuity] = useState(20);
    const [subsidy, setSubsidy] = useState(0);

    // UI state
    const [isMcModalOpen, setIsMcModalOpen] = useState(false);
    const [isMcLoading, setIsMcLoading] = useState(false);
    const [isMapAnimating, setIsMapAnimating] = useState(true);
    const [showChoropleth, setShowChoropleth] = useState(false);
    const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
    const [isCopilotOpen, setIsCopilotOpen] = useState(false);

    // Scenario management
    const [savedScenarios, setSavedScenarios] = useState<Array<any>>([
        {
            id: 1,
            name: 'SC-A',
            irr: '12.3%',
            timeline: '-6 wks',
            passRate: '82%',
            values: { concession: 15, fee: 40, annuity: 20, subsidy: 0 }
        }
    ]);

    // Data state
    const [parcelData, setParcelData] = useState<Parcel[]>(initialParcels);
    const isRegenerated = searchParams.get('regenerated') === 'true';

    useEffect(() => {
        if(isRegenerated) {
            toast({
                title: '🔄 WBS Re-drafted',
                description: 'Your WBS has been re-drafted to address top failure drivers.',
                variant: 'default',
            });
        }
    }, [isRegenerated, toast]);

    // Enhanced simulation logic
    const { irr, timelineShift, beneficiaryImpact, bplCoverage } = useMemo(() => {
        const baseIRR = isRegenerated ? 11.2 : 12;
        const baseShift = isRegenerated ? 2 : 0;

        const concessionEffect = (concession - 15) * 0.1;
        const feeEffect = (fee - 40) * 0.05;
        const annuityEffect = (annuity - 20) * 0.08;
        const subsidyEffect = (subsidy) * -0.04;

        const newIRR = baseIRR + concessionEffect + feeEffect + annuityEffect + subsidyEffect;
        const newTimelineShift = Math.round(baseShift + ((15 - concession) * 2) + ((40-fee)/5));

        const baseBeneficiaries = 20;
        const feeImpactOnBeneficiaries = (40 - fee) * 0.1;
        const bplSubsidyImpact = subsidy * 0.05;
        const newBeneficiaryImpact = baseBeneficiaries + feeImpactOnBeneficiaries + bplSubsidyImpact;
        const newBplCoverage = Math.min(100, 20 + subsidy * 1.6);

        return {
            irr: newIRR,
            timelineShift: newTimelineShift,
            beneficiaryImpact: newBeneficiaryImpact,
            bplCoverage: newBplCoverage
        };
    }, [concession, fee, annuity, subsidy, isRegenerated]);

    // Enhanced map update logic
    useEffect(() => {
        const newParcelData = initialParcels.map((p: Parcel) => {
            let progress = p.properties.progress;
            if (!p.properties.isBPL) {
              progress -= (fee - 40) / 800;
            }
            if (p.properties.isBPL) {
                progress += subsidy / 500;
            }
            progress += (annuity - 20) / 600;
            return {
                ...p,
                properties: { ...p.properties, progress: Math.max(0, Math.min(1, progress)) }
            };
        });
        setParcelData(newParcelData);
    }, [fee, subsidy, annuity]);

    const handleSaveScenario = useCallback(() => {
        const newScenario = {
            id: Date.now(),
            name: `SC-${String.fromCharCode(65 + savedScenarios.length)}`,
            irr: `${irr.toFixed(1)}%`,
            timeline: `${timelineShift >= 0 ? '+' : ''}${timelineShift} wks`,
            passRate: `${Math.round(Math.random() * 30 + 70)}%`,
            values: { concession, fee, annuity, subsidy }
        };
        setSavedScenarios(prev => [...prev, newScenario]);
        toast({
            title: '💾 Scenario Saved',
            description: `${newScenario.name} saved with current parameters`,
        });
    }, [concession, fee, annuity, subsidy, irr, timelineShift, savedScenarios.length, toast]);

    const handleRemoveScenario = useCallback((id: number) => {
        setSavedScenarios(prev => prev.filter(s => s.id !== id));
    }, []);

    const handleRunMC = () => {
        setIsMcLoading(true);
        setTimeout(() => {
            setIsMcLoading(false);
            setIsMcModalOpen(true);
        }, 2000);
    };

    const handleParcelClick = useCallback((parcel: Parcel) => {
        setSelectedParcel(parcel);
    }, []);

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 sm:p-6 lg:p-8"
      >
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/projects/bhu-setu-2/planning/wbs" className="flex items-center">
                ← WBS & Risk
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">•</div>
            <span className="text-sm font-medium">Next: Finalize Plan</span>
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Interactive digital twin with real-time scenario modeling</p>
              </TooltipContent>
            </Tooltip>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCopilotOpen(true)}
              className="relative"
            >
              <MessageCircle className="h-4 w-4" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Button>
          </div>
        </div>

        {/* Page Title */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
        >
            <h1 className="text-4xl font-bold font-headline tracking-tight text-slate-800 flex items-center justify-center">
                <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                    ✏️
                </motion.span>
                <span className="ml-3">Digital‑Twin Sandbox + What‑If Lab</span>
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
                Interactive spatial simulation with real-time policy impact modeling
            </p>
        </motion.div>

        {/* Regeneration Alert */}
        {isRegenerated && (
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md shadow-sm"
                role="alert"
            >
                <div className="flex items-center">
                    <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0"/>
                    <p className="text-sm">Your WBS has been re-tuned based on failure drivers. Try Monte-Carlo again.</p>
                </div>
            </motion.div>
        )}

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 xl:gap-8">

          {/* 1. Digital Twin Preview - Takes up 2 columns */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="border-2 border-blue-200 shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <CardTitle className="flex items-center text-xl">
                                <Eye className="text-blue-600 mr-3 h-6 w-6" />
                                Digital Twin Preview
                            </CardTitle>
                            <CardDescription className="mt-2">
                                Live spatial simulation of parcel digitization progress
                            </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsMapAnimating(!isMapAnimating)}
                                    >
                                        {isMapAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isMapAnimating ? 'Pause' : 'Play'} orbit animation</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Reset view</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowChoropleth(!showChoropleth)}
                                    >
                                        {showChoropleth ? <EyeOff className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Toggle choropleth overlay</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="relative w-full h-[400px] xl:h-[440px] rounded-lg shadow-inner bg-gradient-to-br from-slate-100 to-blue-100 overflow-hidden border-2 border-slate-200">
                        <TwinPreviewMap
                            parcels={parcelData}
                        />
                        {selectedParcel && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-3 shadow-lg"
                            >
                                <h4 className="font-semibold text-sm">Parcel: {selectedParcel.properties.id}</h4>
                                <p className="text-xs text-muted-foreground">Progress: {Math.round(selectedParcel.properties.progress * 100)}%</p>
                                <p className="text-xs text-muted-foreground">Next Milestone: 2025-08-15</p>
                                {selectedParcel.properties.isBPL && (
                                    <Badge variant="secondary" className="mt-1 text-xs">BPL Household</Badge>
                                )}
                            </motion.div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Anomaly Feed & Live IoT Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border-2 border-emerald-200 h-[240px] xl:h-[260px] flex flex-col">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center text-lg">
                            <Activity className="text-emerald-600 mr-2 h-5 w-5" />
                            Live IoT Stream
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 pt-0">
                        <div className="h-full">
                            <StreamingIoTChart />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-amber-200 h-[240px] xl:h-[260px] flex flex-col">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center text-lg">
                            <AlertTriangle className="text-amber-600 mr-2 h-5 w-5" />
                            Anomaly Feed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 pt-0 overflow-y-auto">
                        <AnomalyFeed />
                    </CardContent>
                </Card>
            </div>
          </div>

          {/* 2. What-If Controls - Takes up 1 column with calculated height */}
          <div className="xl:h-[784px] flex flex-col">
            <Card className="border-2 border-purple-200 flex-1 flex flex-col">
                <CardHeader className="pb-4 flex-shrink-0">
                    <CardTitle className="flex items-center text-lg">
                        <Settings className="text-purple-600 mr-2 h-5 w-5" />
                        What‑If Controls
                    </CardTitle>
                    <CardDescription>Adjust levers to simulate outcomes in real-time</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center pt-0 space-y-8">
                   <div className="space-y-6">
                        <h4 className="font-semibold text-muted-foreground flex items-center text-sm">
                            <Landmark className="mr-2 h-4 w-4"/>
                            Financial Levers
                        </h4>
                        <div className="space-y-6 pl-4 border-l-2 border-purple-200 ml-2">
                           <div>
                                <label className="flex justify-between text-sm font-medium mb-3">
                                    <span>Concession Period</span>
                                    <span className="font-bold text-purple-600">{concession} yrs</span>
                                </label>
                                <Slider
                                    value={[concession]}
                                    min={10}
                                    max={25}
                                    step={1}
                                    onValueChange={(v) => setConcession(v[0])}
                                    className="data-[orientation=horizontal]:h-2"
                                />
                           </div>
                           <div>
                                <label className="flex justify-between text-sm font-medium mb-3">
                                    <span>Govt Annuity (% capex)</span>
                                    <span className="font-bold text-purple-600">{annuity}%</span>
                                </label>
                                <Slider
                                    value={[annuity]}
                                    min={0}
                                    max={40}
                                    step={2}
                                    onValueChange={(v) => setAnnuity(v[0])}
                                    className="data-[orientation=horizontal]:h-2"
                                />
                           </div>
                        </div>
                   </div>
                   <div className="space-y-6">
                        <h4 className="font-semibold text-muted-foreground flex items-center text-sm">
                            <Shield className="mr-2 h-4 w-4"/>
                            Policy Levers
                        </h4>
                        <div className="space-y-6 pl-4 border-l-2 border-green-200 ml-2">
                           <div>
                                <label className="flex justify-between text-sm font-medium mb-3">
                                    <span>User Fee (% of cost)</span>
                                    <span className="font-bold text-green-600">{fee}%</span>
                                </label>
                                <Slider
                                    value={[fee]}
                                    min={0}
                                    max={100}
                                    step={5}
                                    onValueChange={(v) => setFee(v[0])}
                                    className="data-[orientation=horizontal]:h-2"
                                />
                           </div>
                           <div>
                                <label className="flex justify-between text-sm font-medium mb-3">
                                    <span>BPL Subsidy (% fee)</span>
                                    <span className="font-bold text-green-600">{subsidy}%</span>
                                </label>
                                <Slider
                                    value={[subsidy]}
                                    min={0}
                                    max={100}
                                    step={5}
                                    onValueChange={(v) => setSubsidy(v[0])}
                                    className="data-[orientation=horizontal]:h-2"
                                />
                           </div>
                        </div>
                   </div>
                </CardContent>
            </Card>
          </div>

          {/* 3. Live Metrics - Takes up 1 column with calculated height */}
          <div className="xl:h-[784px] flex flex-col space-y-6">
            {/* IRR Gauge */}
            <Card className="border-2 border-emerald-200 h-[200px] xl:h-[220px] flex flex-col">
                <CardHeader className="pb-3 flex-shrink-0">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="text-emerald-600 h-5 w-5"/>
                        IRR Gauge
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center pt-0">
                    <div className="xl:scale-90">
                        <IRRGauge value={irr} />
                    </div>
                </CardContent>
            </Card>

            {/* Timeline Impact */}
            <Card className="border-2 border-amber-200 h-[140px] xl:h-[160px] flex flex-col">
                <CardHeader className="pb-3 flex-shrink-0">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="text-amber-600 h-5 w-5"/>
                        Timeline Impact
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center pt-0">
                    <motion.p
                        className={cn(
                            "text-3xl xl:text-4xl font-bold",
                            timelineShift > 0 ? 'text-rose-500' : timelineShift < 0 ? 'text-emerald-500' : 'text-slate-500'
                        )}
                        key={timelineShift}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {timelineShift >= 0 ? '+' : ''}{timelineShift} wks
                    </motion.p>
                    <p className="text-sm text-muted-foreground">vs baseline</p>
                </CardContent>
            </Card>

            {/* Beneficiary Impact */}
            <Card className="border-2 border-blue-200 flex-1 flex flex-col min-h-[200px]">
                <CardHeader className="pb-3 flex-shrink-0">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="text-blue-600 h-5 w-5"/>
                        Beneficiary Impact
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center pt-0 space-y-4">
                     <div className="text-center">
                         <motion.p
                            className="text-2xl xl:text-3xl font-bold text-blue-600"
                            key={beneficiaryImpact}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                         >
                            {beneficiaryImpact.toFixed(1)} Cr
                         </motion.p>
                         <p className="text-xs text-muted-foreground">Total citizens covered</p>
                     </div>
                     <Separator />
                     <div className="text-center space-y-3">
                         <motion.p
                            className="text-lg xl:text-xl font-semibold text-blue-500"
                            key={bplCoverage}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                         >
                            {bplCoverage.toFixed(0)}%
                         </motion.p>
                         <p className="text-xs text-muted-foreground">BPL household coverage</p>
                         <Progress value={bplCoverage} className="h-2" />
                     </div>
                </CardContent>
            </Card>
          </div>
        </div>

        {/* 5. Scenario Bus */}
        <Card className="mt-8 border-2 border-indigo-200 shadow-lg">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center text-xl">
                            <Coffee className="text-indigo-600 mr-3 h-6 w-6" />
                            Scenario Bus
                        </CardTitle>
                        <CardDescription className="mt-1">Save parameter combinations and run Monte-Carlo analysis</CardDescription>
                    </div>
                    <Button onClick={handleSaveScenario} className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                        <Save className="mr-2 h-4 w-4" />
                        Save Scenario
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="mb-6">
                    <div className="flex flex-wrap gap-3 min-h-[60px] p-4 bg-slate-50/50 rounded-lg border border-slate-200">
                        <AnimatePresence>
                            {savedScenarios.length > 0 ? (
                                savedScenarios.map((scenario) => (
                                    <ScenarioChip
                                        key={scenario.id}
                                        scenario={scenario}
                                        onRemove={() => handleRemoveScenario(scenario.id)}
                                        onRunMC={() => handleRunMC()}
                                    />
                                ))
                            ) : (
                                <div className="flex items-center justify-center w-full text-muted-foreground">
                                    <span className="text-sm">No saved scenarios • Use 'Save Scenario' to store current parameter settings</span>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-1 shadow-sm"
                        size="lg"
                        onClick={() => handleRunMC()}
                        disabled={isMcLoading}
                    >
                        {isMcLoading ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="mr-2"
                                >
                                    <Settings className="h-4 w-4" />
                                </motion.div>
                                Running simulations...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Run Monte-Carlo Analysis
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>

        {/* 7. Inclusive Biz Canvas */}
        <div className="mt-8">
            <InclusiveBizCanvas />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200">
            <Button variant="outline" asChild className="shadow-sm">
              <Link href="/projects/bhu-setu-2/planning/wbs" className="flex items-center">
                ← Back: WBS
              </Link>
            </Button>
            <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Digital Twin Sandbox Complete</p>
                <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Ready for Plan Finalization</span>
                </div>
            </div>
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 shadow-sm" asChild>
              <Link href={`/projects/bhu-setu-2/planning/finish?regenerated=${isRegenerated}`}>
                Next: Finalize Plan →
              </Link>
            </Button>
        </div>

        {/* Monte Carlo Modal */}
        <AnimatePresence>
            {isMcModalOpen && (
                 <Dialog open={isMcModalOpen} onOpenChange={setIsMcModalOpen}>
                    <DialogContent className="sm:max-w-lg bg-white">
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                            <DialogHeader>
                                <DialogTitle className="text-rose-500 text-2xl flex items-center">
                                    <XCircle className="mr-2 h-7 w-7"/> Monte-Carlo Results
                                </DialogTitle>
                                <DialogDescription>
                                    1500 simulations completed. Looks like this scenario doesn't clear our KPIs.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-2 gap-4 my-6">
                                <div className="flex flex-col items-center justify-center">
                                     <ResponsiveContainer width="100%" height={150}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Pass', value: 35, fill: 'hsl(var(--accent))' },
                                                    { name: 'Fail', value: 65, fill: 'hsl(var(--destructive))' },
                                                ]}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={60}
                                                startAngle={90}
                                                endAngle={450}
                                            >
                                                <Cell fill="hsl(var(--destructive))" />
                                                <Cell fill="hsl(var(--accent))" />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                     <div className="text-center">
                                        <p className="text-3xl font-bold text-rose-500">65% Failed</p>
                                        <p className="text-sm text-muted-foreground">35% Pass Rate</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold">Top 3 Reasons for Failure:</h3>
                                    <ul className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                                    {failureDrivers.map((driver, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + index * 0.1 }}
                                        >
                                            {driver.reason}
                                        </motion.li>
                                    ))}
                                    </ul>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsMcModalOpen(false)}>Try Different Sliders</Button>
                                <motion.div
                                    animate={{ x: [0, -3, 3, -3, 3, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    <Button className="bg-rose-500 hover:bg-rose-600" onClick={() => router.push('/projects/bhu-setu-2/planning/wbs?regenerate=true')}>
                                        <Repeat className="mr-2 h-4 w-4"/> Regenerate WBS
                                    </Button>
                                </motion.div>
                            </DialogFooter>
                         </motion.div>
                    </DialogContent>
                 </Dialog>
            )}
        </AnimatePresence>

        {/* AI Copilot Chat */}
        <CopilotChat isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />

        {/* Floating Copilot Button */}
        <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size="lg"
                        className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl border-2 border-white"
                        onClick={() => setIsCopilotOpen(true)}
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 2
                            }}
                        >
                            <Bot className="h-6 w-6" />
                        </motion.div>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-white shadow-lg border">
                    <p className="text-sm font-medium">Ask AI Copilot</p>
                    <p className="text-xs text-muted-foreground">Get scenario optimization insights</p>
                </TooltipContent>
            </Tooltip>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
}
