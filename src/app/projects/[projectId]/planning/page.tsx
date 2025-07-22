'use client';

import { useState, useEffect, useMemo, ReactNode } from 'react';
import { notFound, useParams } from 'next/navigation';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { projects, planningData } from '@/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast"
import { GovernaiLogo } from '@/components/icons';
import { Sparkles, BrainCog, Network, Activity, Repeat, HelpCircle, X, SlidersHorizontal, Rocket } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

type Stage = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I';

const stageDurations: Record<Stage, number> = { A: 2500, B: 3000, C: 4000, D: 3000, E: 3000, F: 5000, G: 0, H: 0, I: 2000 };

const AnimatedCounter = ({ to, duration = 1.5 }: { to: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = to;
    const totalFrames = duration * 60;
    let frame = 0;

    const counter = () => {
      frame++;
      const progress = frame / totalFrames;
      const current = start + (end - start) * progress;
      setCount(current);

      if (frame < totalFrames) {
        requestAnimationFrame(counter);
      } else {
        setCount(end);
      }
    };
    requestAnimationFrame(counter);
  }, [to, duration]);

  return <span>{Math.round(count).toLocaleString()}</span>;
};

const Typewriter = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i === text.length) {
            clearInterval(interval);
            if(onComplete) onComplete();
        }
        }, 50);
        return () => clearInterval(interval);
    }, [text, onComplete]);

    return <p className="font-mono text-lime-400">{displayedText}</p>;
}

export default function PlanningPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const project = projects.find((p) => p.id === projectId);
  
  const [stage, setStage] = useState<Stage>('A');
  const [showScenarioTuner, setShowScenarioTuner] = useState(false);
  const [scenario, setScenario] = useState(planningData.scenarioBase);
  const [wbs, setWbs] = useState(planningData.wbsDraft);
  const [scenarioFailed, setScenarioFailed] = useState(false);
  const modalControls = useAnimation();
  const { toast } = useToast();

  useEffect(() => {
    if (stage !== 'G' && stage !== 'H' && stage !== 'I') {
        const timer = setTimeout(() => {
            setStage(prev => String.fromCharCode(prev.charCodeAt(0) + 1) as Stage);
        }, stageDurations[stage]);
        return () => clearTimeout(timer);
    }
     if (stage === 'G') {
        setTimeout(() => setShowScenarioTuner(true), 500);
    }
  }, [stage]);

  useEffect(() => {
    const { irr, delayRisk } = scenario;
    const failedKPIs = (irr < 0.1 ? 1: 0) + (delayRisk > 25 ? 1 : 0)
    if (failedKPIs > 0 && stage === 'G') { // Simplified logic
        setScenarioFailed(true);
        modalControls.start({
            borderColor: ['#f43f5e', '#475569', '#f43f5e', '#475569', '#f43f5e'],
            transition: { duration: 1, repeat: 2 }
        })
    } else {
        setScenarioFailed(false);
        modalControls.start({ borderColor: '#475569' });
    }
  }, [scenario, stage, modalControls])


  if (!project || project.id !== 'bhu-setu-2') {
    return (
      <div className="p-8 text-center text-muted-foreground">
        This planning simulation is only available for the 'Bhu-Setu 2.0' project.
      </div>
    );
  }

  const handleRegenerateWBS = () => {
    setWbs(prevWbs => prevWbs.map(task => ({ ...task, days: Math.round(task.days * (0.9 + Math.random() * 0.2)) })));
    setScenarioFailed(false);
    setShowScenarioTuner(false);
    setStage('D'); // Go back to WBS stage
  }
  
  const handleLockScenario = () => {
    setShowScenarioTuner(false);
    setStage('I');
    toast({
        title: "Scenario Locked",
        description: "Scenario S-PPP-Boost locked and pushed to Execution.",
        action: <Rocket className="h-5 w-5 text-lime-400" />
    })
  }

  const renderContent = () => {
    switch(stage) {
      case 'A':
        return (
          <motion.div key="A" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full">
            <motion.div animate={{ scale: [0.9, 1.0, 0.9], transition: { duration: 1.5, repeat: Infinity } }}>
              <GovernaiLogo className="h-24 w-24 text-indigo-400" />
            </motion.div>
          </motion.div>
        )
      case 'B':
        return (
          <motion.div key="B" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full relative">
            <AnimatePresence>
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-lime-400 rounded-full"
                    initial={{ opacity: 0, y: '100vh', x: `${Math.random() * 100}vw` }}
                    animate={{ opacity: [0, 0.7, 0], y: ['80vh', '10vh'], transition: { duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2 } }}
                    style={{ width: `${Math.random() * 3 + 1}px`, height: `${Math.random() * 3 + 1}px` }}
                />
            ))}
            </AnimatePresence>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-xl font-semibold">Scanning 8 years of district data...</p>
              <p className="text-3xl font-bold font-headline mt-2 text-lime-400"><AnimatedCounter to={12345} duration={2.5}/> records</p>
              <p className="text-xl font-semibold mt-4">Clustering bright spots...</p>
            </div>
          </motion.div>
        );
      case 'C':
      case 'D':
      case 'E':
      case 'F':
      case 'G':
      case 'H':
      case 'I':
        return (
        <motion.div key="C" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-2 sm:p-4 lg:p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight flex items-center">
                        <Sparkles className="mr-3 h-8 w-8 text-indigo-400" /> Planning: AI-SPARK Hub
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">From a clean slate, analytics guide you through Scan → Risk → Twin → Scenario.</p>
                </div>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon"><HelpCircle className="h-6 w-6" /></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-slate-800 border-indigo-500">
                        <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none text-lime-400">SPARK vs. PDCS</h4>
                            <p className="text-sm text-muted-foreground">
                            A quick glossary on our analytics methods.
                            </p>
                        </div>
                        <div className="grid gap-2 text-xs">
                            <div className="font-bold">SPARK</div>
                            <p className="text-muted-foreground">Focuses on superior project/team outcome & process metrics to drive tangible KPI uplift.</p>
                             <div className="font-bold mt-2">PDCS</div>
                            <p className="text-muted-foreground">Focuses on intentional, non-normative communication to shape softer change-management.</p>
                        </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    {/* Scan Result Board */}
                    <AnimatePresence>
                    {stage >= 'C' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
                         <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader>
                                <CardTitle className="flex items-center"><BrainCog className="mr-2"/>SPARK Scan Results</CardTitle>
                                <CardDescription>Top-decile districts identified as potential PPP concession prototypes.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {planningData.scanResults.map((res, i) => (
                                        <motion.div 
                                            key={res.district}
                                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                            className={`p-4 rounded-lg border-2 ${res.score > 90 ? 'border-lime-400 glow-lime' : 'border-slate-700'} bg-slate-800/50 cursor-pointer`}
                                        >
                                            <p className="font-bold text-lg">{res.district}</p>
                                            <p className="text-sm text-muted-foreground">Score: {res.score}</p>
                                            <div className="mt-2 text-xs">
                                                <p>IRR: <span className="font-semibold text-lime-300">{Math.round(res.kpi.irr * 100)}%</span></p>
                                                <p>Delay: <span className="font-semibold text-rose-400">{res.kpi.delay}d</span></p>
                                            </div>
                                             {res.score > 90 && <div className="text-xs font-bold text-lime-400 mt-1">SPARK ⭐</div>}
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    )}
                    </AnimatePresence>

                     {/* Digital-Twin Sandbox */}
                    <AnimatePresence>
                    {stage >= 'F' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader>
                                <CardTitle className="flex items-center"><Network className="mr-2"/>Digital-Twin Sandbox</CardTitle>
                                <CardDescription>Split-screen view: 3D parcel map & financial panel for What-If scenarios.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                 <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="h-64 flex items-center justify-center bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                                    <p className="text-muted-foreground text-center">[3D GeoJSON Parcel Map]</p>
                                 </motion.div>
                                 <div className="flex flex-col items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-muted-foreground">Project IRR</p>
                                        <p className="text-5xl font-extrabold text-lime-400">{(scenario.irr * 100).toFixed(1)}%</p>
                                    </div>
                                    <Button className="mt-6" onClick={() => setStage('G')} disabled={stage !== 'F'}>
                                        <SlidersHorizontal className="mr-2" /> Tune Scenarios
                                    </Button>
                                 </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    )}
                    </AnimatePresence>
                </div>
                
                {/* Right Panel: WBS & Risk */}
                <AnimatePresence>
                {stage >= 'D' && (
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.5 } }} 
                    className="space-y-6"
                >
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center"><Activity className="mr-2"/>AI WBS & Risk Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stage === 'D' && <Typewriter text="Drafting Work-Plan..." />}
                            {(stage >= 'E') && (
                            <>
                            <p className="font-mono text-lime-400 mb-4">Work-Plan Drafted. Analyzing P80 Risk...</p>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart layout="vertical" data={wbs} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="task" hide />
                                        <RechartsTooltip 
                                            cursor={{fill: 'rgba(132, 204, 22, 0.1)'}}
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }}
                                            labelStyle={{ color: '#e2e8f0' }}
                                        />
                                        <Bar dataKey="days" stackId="a" fill="#4f46e5" radius={[5, 5, 5, 5]}>
                                            <LabelList dataKey="task" position="insideLeft" offset={10} fill="#f8fafc" className="text-sm font-semibold"/>
                                            <LabelList dataKey="days" position="right" formatter={(v: number) => `${v}d`} fill="#94a3b8" className="text-xs"/>
                                             {stage >= 'E' && wbs.map((entry, index) => {
                                                const risk = entry.p80Risk;
                                                const color = risk > 0.3 ? "#f43f5e" : risk > 0.2 ? "#f59e0b" : "#86efac";
                                                return <Cell key={`cell-${index}`} fill={color} className={risk > 0.2 ? 'animate-pulse' : ''} />;
                                             })}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            </>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
                )}
                </AnimatePresence>
            </div>
        </motion.div>
        );
      default: return null;
    }
  }

  return (
    <div className="h-[calc(100vh-10rem)] bg-slate-950 text-slate-100 overflow-hidden">
        {renderContent()}

        <AnimatePresence>
        {showScenarioTuner && (
            <motion.div 
                key="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={() => setShowScenarioTuner(false)}
            >
                <motion.div
                    key="modal-content"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={modalControls}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-slate-900 border-2 border-slate-700 rounded-xl p-6 w-full max-w-lg shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={() => setShowScenarioTuner(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-200">
                        <X />
                    </button>
                    <h3 className="text-xl font-bold font-headline mb-2">Scenario Tuner</h3>
                    <p className="text-sm text-muted-foreground mb-6">Adjust levers to see their impact on project viability.</p>

                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="concession">Concession Period (Years): {scenario.concessionYears}</Label>
                            <Slider id="concession" min={10} max={30} step={1} value={[scenario.concessionYears]} onValueChange={([v]) => setScenario(s => ({...s, concessionYears: v, irr: s.irr + (v - s.concessionYears) * 0.001, delayRisk: s.delayRisk - (v - s.concessionYears) * 0.1}))} />
                        </div>
                        <div className="grid gap-2">
                             <Label htmlFor="fee">User Fee %: {scenario.userFeePct}</Label>
                            <Slider id="fee" min={10} max={80} step={5} value={[scenario.userFeePct]} onValueChange={([v]) => setScenario(s => ({...s, userFeePct: v, irr: s.irr + (v - s.userFeePct) * 0.0005}))} />
                        </div>
                         <div className="grid gap-2">
                             <Label htmlFor="subsidy">BPL Subsidy %: {scenario.subsidyPct}</Label>
                            <Slider id="subsidy" min={0} max={50} step={5} value={[scenario.subsidyPct]} onValueChange={([v]) => setScenario(s => ({...s, subsidyPct: v, irr: s.irr - (v - s.subsidyPct) * 0.0008}))} />
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between items-center">
                        {scenarioFailed ? (
                             <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    transition: { duration: 0.5, repeat: Infinity }
                                }}
                            >
                                <Button variant="destructive" onClick={handleRegenerateWBS}>
                                    <Repeat className="mr-2" /> Re-Generate WBS
                                </Button>
                            </motion.div>
                        ) : <div/>}

                        <Button onClick={handleLockScenario} className="bg-lime-600 hover:bg-lime-700 text-white">
                           <Rocket className="mr-2" /> Lock Scenario
                        </Button>
                    </div>

                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    </div>
  );
}
