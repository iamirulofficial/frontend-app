
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, XAxis, YAxis, Bar, LabelList } from 'recharts';
import { Info, Repeat, XCircle, Users, Target, Banknote } from 'lucide-react';
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
import { failureDrivers } from '@/data/planning';
import { TwinPreviewMap, type Parcel } from '@/components/twin-preview-map';
import { cn } from '@/lib/utils';


const IRRDonut = ({ value }: { value: number }) => {
    const data = [
        { name: 'IRR', value: value, fill: 'hsl(var(--primary))' },
        { name: 'Remaining', value: 20 - value, fill: 'hsl(var(--muted))' }
    ];
    return (
        <div className="w-40 h-40 relative">
            <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={450} paddingAngle={2}>
                        <Cell key="irr-value" fill="hsl(var(--primary))" className="stroke-none" />
                        <Cell key="irr-rem" fill="hsl(var(--secondary))" className="stroke-none"/>
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-primary">{value.toFixed(1)}%</span>
                <span className="text-sm text-muted-foreground">Target IRR</span>
            </div>
        </div>
    )
}

const failureDonutData = [
  { name: 'Pass', value: 35, color: 'hsl(var(--accent))' },
  { name: 'Fail', value: 65, color: 'hsl(var(--destructive))' },
]

const initialParcels: Parcel[] = [
    { type: 'Feature', properties: { progress: 0.64, id: 'P-1023' }, geometry: { type: 'Polygon', coordinates: [ [[77.60,12.92], [77.61,12.92], [77.61,12.93], [77.60,12.93], [77.60,12.92]] ] } },
    { type: 'Feature', properties: { progress: 0.22, id: 'P-1047', isBPL: true }, geometry: { type: 'Polygon', coordinates: [ [[77.58,12.90], [77.59,12.90], [77.59,12.91], [77.58,12.91], [77.58,12.90]] ] } },
    { type: 'Feature', properties: { progress: 0.85, id: 'P-1055' }, geometry: { type: 'Polygon', coordinates: [ [[77.62,12.91], [77.63,12.91], [77.63,12.92], [77.62,12.92], [77.62,12.91]] ] } },
];

export default function SandboxPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // Sliders state
    const [concession, setConcession] = useState(15);
    const [fee, setFee] = useState(40);
    const [annuity, setAnnuity] = useState(20);
    const [subsidy, setSubsidy] = useState(0);
    
    // UI state
    const [isMcModalOpen, setIsMcModalOpen] = useState(false);
    const [isMcLoading, setIsMcLoading] = useState(false);
    
    // Data state
    const [parcelData, setParcelData] = useState<Parcel[]>(initialParcels);
    const isRegenerated = searchParams.get('regenerate') === 'true';

    useEffect(() => {
        if(isRegenerated) {
            toast({
                title: 'WBS Re-drafted',
                description: 'Your WBS has been re-drafted to address top failure drivers.',
            });
        }
    }, [isRegenerated, toast]);


    // --- Core Simulation Logic ---
    const { irr, timelineShift, beneficiaryImpact, revenueMix, bplCoverage } = useMemo(() => {
        // Base values
        const baseIRR = isRegenerated ? 11.2 : 12;
        const baseShift = isRegenerated ? 2 : 0;
        
        // Effects from sliders
        const concessionEffect = (concession - 15) * 0.1;
        const feeEffect = (fee - 40) * 0.05;
        const annuityEffect = (annuity - 20) * 0.08;
        const subsidyEffect = (subsidy) * -0.04;
        
        // Calculated Metrics
        const newIRR = baseIRR + concessionEffect + feeEffect + annuityEffect + subsidyEffect;
        const newTimelineShift = Math.round(baseShift + ((15 - concession) * 2) + ((40-fee)/5));
        
        // Beneficiary Impact Model
        const baseBeneficiaries = 20; // in crore
        const feeImpactOnBeneficiaries = (40 - fee) * 0.1; // Higher fee slightly reduces reach
        const bplSubsidyImpact = subsidy * 0.05; // Subsidy increases reach
        const newBeneficiaryImpact = baseBeneficiaries + feeImpactOnBeneficiaries + bplSubsidyImpact;
        const newBplCoverage = Math.min(100, 20 + subsidy * 1.6); // % of BPL families covered
        
        // Revenue Mix Model
        const userFeeShare = fee;
        const apiShare = 35 + (concession - 15); // Longer concession encourages more API partners
        const govtShare = 100 - userFeeShare - apiShare;
        const newRevenueMix = [
            { name: 'User Fees', value: userFeeShare, color: 'hsl(var(--chart-1))' },
            { name: 'API Market', value: apiShare, color: 'hsl(var(--chart-2))' },
            { name: 'Govt. Grant', value: Math.max(0, govtShare), color: 'hsl(var(--chart-4))' },
        ];

        return {
            irr: newIRR,
            timelineShift: newTimelineShift,
            beneficiaryImpact: newBeneficiaryImpact,
            revenueMix: newRevenueMix,
            bplCoverage: newBplCoverage
        };
    }, [concession, fee, annuity, subsidy, isRegenerated]);
    
    // --- Map Update Logic ---
    useEffect(() => {
        const newParcelData = initialParcels.map(p => {
            let progress = p.properties.progress;
            progress -= (fee - 40) / 800;
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


    const handleRunMC = () => {
        setIsMcLoading(true);
        setTimeout(() => {
            setIsMcLoading(false);
            setIsMcModalOpen(true);
        }, 2000);
    }
    
    const handleRegenerate = () => {
        router.push('/projects/bhu-setu-2/planning/wbs?regenerate=true');
    }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
        >
            <h1 className="text-4xl font-bold font-headline tracking-tight text-slate-800">
                ✏️ Digital-Twin Sandbox + What-If Lab
            </h1>
        </motion.div>
        
        {isRegenerated && (
            <motion.div
                initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="mb-6 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md" role="alert"
            >
                <div className="flex items-center">
                    <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0"/>
                    <p className="text-sm">Your WBS has been re-tuned based on failure drivers. Try Monte-Carlo again.</p>
                </div>
            </motion.div>
        )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
         <div className="space-y-8">
            <Card>
                 <CardHeader>
                    <CardTitle>Digital Twin Preview</CardTitle>
                    <CardDescription>Live spatial simulation of parcel digitization progress.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-[400px] rounded-lg shadow-inner bg-slate-100 overflow-hidden">
                        <TwinPreviewMap parcels={parcelData} />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Target className="text-primary"/>Key Project Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-around items-center">
                       <IRRDonut value={irr} />
                       <div className="text-center">
                            <p className={cn(
                                "text-4xl font-bold",
                                timelineShift > 0 ? 'text-rose-500' : 'text-emerald-500'
                            )}>
                               {timelineShift >= 0 ? '+' : ''}{timelineShift} wks
                            </p>
                            <p className="text-sm text-muted-foreground">Timeline Shift</p>
                       </div>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users className="text-accent"/>Beneficiary Impact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-center">
                         <p className="text-4xl font-bold text-accent">{beneficiaryImpact.toFixed(1)} Cr</p>
                         <p className="text-sm text-muted-foreground">Total citizens covered</p>
                         <div className="pt-2">
                             <p className="text-2xl font-semibold text-accent/80">{bplCoverage.toFixed(0)}%</p>
                             <p className="text-xs text-muted-foreground">BPL household coverage</p>
                         </div>
                    </CardContent>
                 </Card>
            </div>
         </div>
        
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>What-If Controls</CardTitle>
                    <CardDescription>Adjust financial and policy levers to simulate outcomes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-4">
                   <div>
                        <label className="flex justify-between text-sm font-medium mb-1"><span>Concession Period</span><span className="font-bold">{concession} yrs</span></label>
                        <Slider value={[concession]} min={10} max={25} step={1} onValueChange={(v) => setConcession(v[0])} />
                   </div>
                   <div>
                        <label className="flex justify-between text-sm font-medium mb-1"><span>User Fee (% of cost)</span><span className="font-bold">{fee}%</span></label>
                        <Slider value={[fee]} min={0} max={100} step={5} onValueChange={(v) => setFee(v[0])} />
                   </div>
                   <div>
                        <label className="flex justify-between text-sm font-medium mb-1"><span>Govt Annuity (% capex)</span><span className="font-bold">{annuity}%</span></label>
                        <Slider value={[annuity]} min={0} max={40} step={2} onValueChange={(v) => setAnnuity(v[0])} />
                   </div>
                   <div>
                        <label className="flex justify-between text-sm font-medium mb-1"><span>BPL Subsidy (% fee)</span><span className="font-bold">{subsidy}%</span></label>
                        <Slider value={[subsidy]} min={0} max={100} step={5} onValueChange={(v) => setSubsidy(v[0])} />
                   </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Banknote className="text-primary"/>Inclusive Biz Canvas</CardTitle>
                    <CardDescription>Live revenue mix based on your parameters.</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px] -ml-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueMix} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" hide />
                             <Bar dataKey="value" stackId="a" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]}>
                                <LabelList dataKey="value" position="insideRight" formatter={(v: number) => `${v}%`} className="fill-primary-foreground font-semibold"/>
                                 {revenueMix.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                             </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            
             <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline">Save Scenario</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleRunMC} disabled={isMcLoading}>
                    {isMcLoading ? 'Running simulations...' : 'Run Monte-Carlo Analysis'}
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
