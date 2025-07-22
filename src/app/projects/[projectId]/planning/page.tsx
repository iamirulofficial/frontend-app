'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, HelpCircle, Check, MapPin, BarChart, Shield, SlidersHorizontal, BrainCircuit, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { brightSpots, wbs } from '@/data/planning';
import { Progress } from '@/components/ui/progress';

type View = 'zero-state' | 'spark-scan' | 'wbs-risk' | 'sandbox';
type Step = 'scan' | 'wbs' | 'sandbox' | 'copilot';

const stepOrder: Step[] = ['scan', 'wbs', 'sandbox', 'copilot'];

export default function PlanningPage() {
  const [view, setView] = useState<View>('zero-state');
  const [currentStep, setCurrentStep] = useState<Step>('scan');
  const [scanCompleted, setScanCompleted] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);

  const handleStartPlanning = () => {
    setView('spark-scan');
  };

  const handleRunScan = () => {
    setLoadingScan(true);
    setTimeout(() => {
      setLoadingScan(false);
      setScanCompleted(true);
    }, 2000);
  };
  
  const handleNextStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1];
      setCurrentStep(nextStep);
      
      // A bit of a hack to map steps to views
      if (nextStep === 'wbs') setView('wbs-risk');
      if (nextStep === 'sandbox') setView('sandbox');

    } else {
      // Final step, push to execution
      console.log("Pushing to execution");
    }
  }

  const renderZeroState = () => (
    <div className="flex items-center justify-center h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-gradient-to-tr from-indigo-50 via-white to-emerald-50 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Craft Your Project Blueprint</CardTitle>
            <CardDescription>Use AI-driven insights to build a resilient plan from day one.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
             <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
             >
                <Button size="lg" onClick={handleStartPlanning}>Start Planning</Button>
             </motion.div>
             <div className="flex justify-center gap-4 mt-8">
                 <TooltipProvider>
                    {['Import Past Data', 'See Sample', 'How It Works'].map(text => (
                        <Tooltip key={text}>
                            <TooltipTrigger asChild>
                                 <motion.div
                                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"}}
                                    className="bg-white/60 backdrop-blur-sm cursor-pointer text-sm font-medium py-2 px-4 rounded-full border"
                                >
                                    {text}
                                </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{text} - Explainer coming soon!</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                 </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const renderSparkScan = () => (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold font-headline flex items-center"><Sparkles className="mr-2 text-primary"/> SPARK Scan: Identify Bright Spots</h2>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>District Performance Map</CardTitle>
                    <CardDescription>Real-time scan identifying top-performing districts to model your project plan after.</CardDescription>
                </CardHeader>
                <CardContent className="h-96 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <p className="text-muted-foreground z-10">[India Map Placeholder]</p>
                    {loadingScan && <Progress value={(Math.random() * 80)+10} className="absolute bottom-4 left-4 right-4 w-auto" />}
                    {scanCompleted && brightSpots.map((spot, i) => (
                        <motion.div
                            key={spot.district}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.2, type: 'spring' }}
                            className="absolute w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"
                            style={{ top: `${20 + Math.random()*60}%`, left: `${10 + Math.random()*80}%` }}
                        >
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        </motion.div>
                    ))}
                </CardContent>
            </Card>
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Bright-Spot Learnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                         {!scanCompleted ? (
                             <Button onClick={handleRunScan} disabled={loadingScan} className="w-full">
                                {loadingScan ? 'Scanning...' : 'Run Scan'}
                             </Button>
                         ) : (
                             <div className="space-y-2">
                                <p className="font-semibold text-sm">Pinned Learnings:</p>
                                {['Hub-Spoke Model', 'Drone QA Loop', 'Outcome-Fee Split'].map(chip => (
                                    <motion.div 
                                        key={chip} 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center text-sm bg-emerald-100 text-emerald-800 py-1 px-3 rounded-full"
                                    >
                                        <Check className="mr-2 h-4 w-4"/> {chip}
                                    </motion.div>
                                ))}
                            </div>
                         )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Top Performers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AnimatePresence>
                        {scanCompleted && (
                        <ul className="space-y-3">
                           {brightSpots.map((spot, i) => (
                               <motion.li 
                                key={spot.district}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0, transition: {delay: i * 0.1} }}
                                className="flex items-center justify-between text-sm"
                               >
                                  <span className="font-medium flex items-center"><MapPin className="h-4 w-4 mr-2 text-muted-foreground"/>{spot.district}</span>
                                  <div className="flex gap-2">
                                    <span className="font-mono text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">ROI: {spot.roi * 100}%</span>
                                    <span className="font-mono text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">QC: {spot.qc}</span>
                                  </div>
                               </motion.li>
                           ))}
                        </ul>
                        )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>
        </div>
        <div className="flex justify-end mt-4">
            <Button onClick={handleNextStep} disabled={!scanCompleted}>Next: Build WBS</Button>
        </div>
    </div>
  );
  
  const renderWbsAndRisk = () => (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold font-headline flex items-center"><BrainCircuit className="mr-2 text-primary"/> AI WBS & Risk Board</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Gantt Sketch</CardTitle>
                    <CardDescription>AI-drafted work breakdown structure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {wbs.map((item, i) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: '100%', transition: { delay: i * 0.1, duration: 0.5 } }}
                            className="flex items-center gap-2"
                        >
                            <span className="w-32 text-sm truncate">{item.task}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-6">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.duration / 60 * 100}%` }}
                                    transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
                                    className={`h-6 rounded-full ${item.p80Risk > 0.5 ? 'bg-amber-500 animate-pulse' : 'bg-blue-500'}`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Risk Heat-Map</CardTitle>
                    <CardDescription>Work package risk concentration.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-10 gap-1">
                        {[...Array(100)].map((_, i) => {
                            const risk = Math.random();
                            let color = 'bg-green-200';
                            if (risk > 0.6) color = 'bg-red-400';
                            else if (risk > 0.2) color = 'bg-amber-300';
                            return (
                                <TooltipProvider key={i}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.01 }}
                                                className={`w-full aspect-square rounded ${color} cursor-pointer hover:ring-2 hover:ring-blue-500`}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Risk: {(risk * 100).toFixed(0)}%</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
       </div>
        <div className="flex justify-end mt-4">
            <Button onClick={handleNextStep}>Next: Sandbox</Button>
        </div>
    </div>
  );
  
  const renderSandbox = () => (
     <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold font-headline flex items-center"><SlidersHorizontal className="mr-2 text-primary"/> Digital-Twin Sandbox & What-If Lab</h2>
        <Card>
            <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Sandbox view coming soon!</p>
            </CardContent>
        </Card>
         <div className="flex justify-end mt-4">
            <Button onClick={handleNextStep}>Finish & Push to Execution</Button>
        </div>
     </div>
  );
  
  const renderCopilot = () => (
    <div className="fixed bottom-8 right-8 z-50">
        <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="bg-white rounded-full p-4 shadow-xl cursor-pointer hover:bg-gray-100"
        >
            <Bot className="h-8 w-8 text-primary" />
        </motion.div>
    </div>
  )


  const renderContent = () => {
    switch(view) {
        case 'zero-state': return renderZeroState();
        case 'spark-scan': return renderSparkScan();
        case 'wbs-risk': return renderWbsAndRisk();
        case 'sandbox': return renderSandbox();
        default: return renderZeroState();
    }
  }

  return (
    <div className="h-full bg-gray-50 p-4">
      {renderContent()}
      {view !== 'zero-state' && renderCopilot()}
    </div>
  );
}
