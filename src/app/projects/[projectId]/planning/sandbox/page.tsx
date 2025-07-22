'use client';

import { useState, useReducer, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { planningData, wbs, wbsRegenerated } from '@/data/planning';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCw, Save, SlidersHorizontal, Info, X, Repeat, CheckCircle, Map, Layers, Pause, Milestone, Check, ShieldCheck } from 'lucide-react';
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
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';


const IRRDonut = ({ value }: { value: number }) => {
    const data = [
        { name: 'IRR', value: value, fill: 'hsl(var(--primary))' },
        { name: 'Remaining', value: 20 - value, fill: 'hsl(var(--muted))' }
    ];
    return (
        <div className="w-48 h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
                 <RadialBarChart 
                    innerRadius="80%" 
                    outerRadius="100%" 
                    data={data} 
                    startAngle={90} 
                    endAngle={-270}
                >
                    <PolarAngleAxis type="number" domain={[0, 20]} angleAxisId={0} tick={false} />
                    <RadialBar background dataKey='value' cornerRadius={10} />
                </RadialBarChart>
            </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-primary">{value.toFixed(1)}%</span>
                <span className="text-sm text-muted-foreground">Target IRR</span>
            </div>
        </div>
    )
}

const failureDonutData = [
  { name: 'Pass', value: 35, color: '#10B981' },
  { name: 'Fail', value: 65, color: '#EF4444' },
]

const failureDrivers = [
  { reason: 'High drone-permit delays', impactPct: 42 },
  { reason: 'Insufficient user-fee revenue', impactPct: 33 },
  { reason: 'Land-litigation spikes', impactPct: 25 }
];

const parcels = [
  { id:'P-1023', progress: 0.64, nextMilestone:'2025-08-15', qc:92 },
  { id:'P-1047', progress: 0.22, nextMilestone:'2025-09-01', qc:85 },
  { id:'P-1048', progress: 1.0, nextMilestone:'2025-07-20', qc:98 },
  { id:'P-1051', progress: 0.88, nextMilestone:'2025-08-01', qc:94 },
  { id:'P-1052', progress: 0.45, nextMilestone:'2025-09-10', qc:89 },
  { id:'P-1055', progress: 0.95, nextMilestone:'2025-07-30', qc:96 },
  { id:'P-1060', progress: 0.10, nextMilestone:'2025-09-25', qc:81 },
  { id:'P-1061', progress: 0.75, nextMilestone:'2025-08-12', qc:91 },
  { id:'P-1063', progress: 1.0, nextMilestone:'2025-07-22', qc:99 },
];

const TwinPreview = () => {
    const [isOrbiting, setIsOrbiting] = useState(true);
    const [view, setView] = useState<'extrusion' | 'heat'>('extrusion');

    const getParcelColor = (progress: number, type: 'extrusion' | 'heat') => {
        if (type === 'heat') {
            if (progress < 0.5) return 'bg-rose-500/80';
            if (progress < 0.8) return 'bg-amber-500/80';
            return 'bg-emerald-500/80';
        }
        return progress === 1 ? 'bg-emerald-300' : 'bg-slate-300';
    };

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-row justify-between items-center">
                <CardTitle>Twin Preview</CardTitle>
                <div className="flex items-center gap-2">
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setView(v => v === 'extrusion' ? 'heat' : 'extrusion')}>
                                    <Layers className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Toggle Heatmap View</p>
                            </TooltipContent>
                        </Tooltip>
                         <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setIsOrbiting(o => !o)}>
                                    {isOrbiting ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{isOrbiting ? 'Pause Orbit' : 'Play Orbit'}</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                    <RotateCw className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Reset View</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent className="flex-grow bg-slate-100/50 rounded-b-lg flex items-center justify-center p-4 relative border-t overflow-hidden">
                <div 
                    className={cn(
                        "grid grid-cols-3 gap-2 w-full h-full transform transition-transform duration-[20000ms] ease-linear",
                        isOrbiting ? 'animate-orbit' : ''
                    )}
                    style={{'--orbit-duration': '40s'} as React.CSSProperties}
                >
                    <TooltipProvider>
                    {parcels.map((parcel) => (
                        <Tooltip key={parcel.id}>
                            <TooltipTrigger asChild>
                                <motion.div
                                    className="w-full h-full rounded flex items-end"
                                    initial={{opacity: 0, scale: 0.5}}
                                    animate={{opacity: 1, scale: 1}}
                                    transition={{delay: Math.random() * 0.5}}
                                >
                                     <motion.div
                                        className={cn("w-full rounded-t-md hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 transition-all", getParcelColor(parcel.progress, view))}
                                        initial={{ height: '0%' }}
                                        animate={{ height: view === 'extrusion' ? `${parcel.progress * 100}%` : '100%' }}
                                        transition={{type: 'spring', stiffness: 100, damping: 15, delay: 0.5 + Math.random() * 0.5}}
                                     />
                                </motion.div>
                            </TooltipTrigger>
                             <TooltipContent side="top" className="bg-background text-foreground shadow-xl rounded-lg p-3 border-border">
                                <div className="text-sm space-y-2">
                                    <p className="font-bold text-primary">{parcel.id}</p>
                                    <div className="flex items-center gap-2">
                                        <Milestone className="h-4 w-4 text-muted-foreground"/>
                                        <span>Progress: <strong>{Math.round(parcel.progress * 100)}%</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                         <ShieldCheck className="h-4 w-4 text-muted-foreground"/>
                                         <span>QC Score: <strong>{parcel.qc}</strong></span>
                                    </div>
                                     <div className="flex items-center gap-2">
                                         <Check className="h-4 w-4 text-muted-foreground"/>
                                         <span>Next Milestone: <strong>{parcel.nextMilestone}</strong></span>
                                    </div>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                    </TooltipProvider>
                </div>
            </CardContent>
        </Card>
    )
}

export default function SandboxPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [concession, setConcession] = useState([15]);
    const [fee, setFee] = useState([40]);
    const [annuity, setAnnuity] = useState([20]);
    const [subsidy, setSubsidy] = useState([0]);
    
    const [isMcModalOpen, setIsMcModalOpen] = useState(false);
    const [isMcLoading, setIsMcLoading] = useState(false);
    
    const isRegenerated = searchParams.get('regenerate') === 'true';

    useEffect(() => {
        if(isRegenerated) {
            toast({
                title: 'WBS Re-drafted',
                description: 'Your WBS has been re-drafted to address top failure drivers.',
            });
        }
    }, [isRegenerated, toast]);


    const calculateIRR = () => {
        // Dummy calculation
        const baseIRR = isRegenerated ? 11.2 : 12;
        const concessionEffect = (concession[0] - 15) * 0.1;
        const feeEffect = (fee[0] - 40) * 0.05;
        const annuityEffect = (annuity[0] - 20) * 0.08;
        const subsidyEffect = (subsidy[0]) * -0.04;
        return baseIRR + concessionEffect + feeEffect + annuityEffect + subsidyEffect;
    };
    
    const calculateTimeline = () => {
        // Dummy calculation
        const baseShift = isRegenerated ? 2 : 0;
        return Math.round(baseShift + ((15 - concession[0]) * 2) + ((40-fee[0])/5));
    }

    const currentIRR = calculateIRR();
    
    const handleRunMC = () => {
        setIsMcLoading(true);
        setTimeout(() => {
            setIsMcLoading(false);
            setIsMcModalOpen(true);
        }, 3000);
    }
    
    const handleRegenerate = () => {
        router.push('/projects/bhu-setu-2/planning/wbs?regenerate=true');
    }

  return (
    <div className="container mx-auto py-8 px-4">
      {isRegenerated && (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md"
            role="alert"
        >
          <div className="flex">
            <div className="py-1"><Info className="h-5 w-5 text-blue-500 mr-3"/></div>
            <div>
              <p className="font-bold">Your WBS has been tuned.</p>
              <p className="text-sm">Try Monte-Carlo again or continue tweaking financial parameters.</p>
            </div>
          </div>
        </motion.div>
      )}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-slate-800">
          ✏️ Digital-Twin Sandbox + What-If Lab
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TwinPreview />
        
        {/* Controls & Metrics */}
        <div>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>What-If Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 pt-2">
                   <div>
                        <label className="flex justify-between text-sm font-medium"><span>Concession Period</span><span className="font-bold">{concession[0]} yrs</span></label>
                        <Slider defaultValue={concession} min={10} max={25} step={1} onValueChange={setConcession} />
                   </div>
                   <div>
                        <label className="flex justify-between text-sm font-medium"><span>User Fee (% of cost)</span><span className="font-bold">{fee[0]}%</span></label>
                        <Slider defaultValue={fee} min={0} max={100} step={5} onValueChange={setFee} />
                   </div>
                   <div>
                        <label className="flex justify-between text-sm font-medium"><span>Govt Annuity (% capex)</span><span className="font-bold">{annuity[0]}%</span></label>
                        <Slider defaultValue={annuity} min={0} max={40} step={2} onValueChange={setAnnuity} />
                   </div>
                   <div>
                        <label className="flex justify-between text-sm font-medium"><span>BPL Subsidy (% fee)</span><span className="font-bold">{subsidy[0]}%</span></label>
                        <Slider defaultValue={subsidy} min={0} max={50} step={5} onValueChange={setSubsidy} />
                   </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Live Metrics</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-around items-center">
                   <IRRDonut value={currentIRR} />
                   <div className="text-center">
                        <p className={`text-5xl font-bold ${calculateTimeline() > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                           {calculateTimeline() >= 0 ? '+' : ''}{calculateTimeline()} weeks
                        </p>
                        <p className="text-sm text-muted-foreground">Timeline Shift</p>
                   </div>
                </CardContent>
             </Card>
             <div className="mt-8 flex justify-end gap-4">
                <Button variant="secondary">Save Scenario</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleRunMC} disabled={isMcLoading}>
                    {isMcLoading ? 'Running...' : 'Run Monte-Carlo'}
                </Button>
             </div>
        </div>
      </div>
      
       <div className="flex justify-between mt-12">
        <Button variant="outline" asChild>
          <Link href="/projects/bhu-setu-2/planning/wbs">
            Back: WBS
          </Link>
        </Button>
        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
          <Link href="/projects/bhu-setu-2/planning/finish">
            Next: Finalize Plan
          </Link>
        </Button>
      </div>

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
                                    1500 simulations completed. Looks like this scenario doesn’t clear our KPIs.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-2 gap-4 my-6">
                                <div className="flex flex-col items-center justify-center">
                                     <ResponsiveContainer width="100%" height={150}>
                                        <PieChart>
                                            <Pie data={failureDonutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} startAngle={90} endAngle={450}>
                                                {failureDonutData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
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
                                    <Button className="bg-rose-500 hover:bg-rose-600" onClick={handleRegenerate}>
                                        <Repeat className="mr-2 h-4 w-4"/> Regenerate WBS
                                    </Button>
                                </motion.div>
                            </DialogFooter>
                         </motion.div>
                    </DialogContent>
                 </Dialog>
            )}
        </AnimatePresence>
    </div>
  );
}

// Dummy Icon for Dialog Title
const XCircle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
    </svg>
)

