'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Info, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { insights, radarAxes, radarPolygons, corpusProjects } from '@/data/planning';

type Insight = { id: string; title: string; detail: string; };

export default function SparkScanPage() {
  const { toast } = useToast();
  const [selectedProjects, setSelectedProjects] = useState<string[]>(['aadhaar', 'upi']);
  const [pinnedPractices, setPinnedPractices] = useState<Insight[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCompleted, setScanCompleted] = useState(false);

  const handleToggleProject = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleRunScan = () => {
    if (selectedProjects.length === 0) {
        toast({ title: "Select Projects", description: "Please select at least one project to scan.", variant: "destructive" });
        return;
    }
    setIsScanning(true);
    setScanCompleted(false);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanCompleted(true);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };
  
  const handlePin = (practice: Insight) => {
    if (pinnedPractices.find(p => p.id === practice.id)) {
      setPinnedPractices(pinnedPractices.filter(p => p.id !== practice.id));
    } else {
       if (pinnedPractices.length < 5) {
         setPinnedPractices([...pinnedPractices, practice]);
         toast({ title: "Practice Pinned", description: `'${practice.title}' added to your blueprint.` });
       }
    }
  };
  
  const filteredInsights = useMemo(() => {
    const allSuccess = selectedProjects.flatMap(id => insights[id as keyof typeof insights]?.success || []);
    const allPitfalls = selectedProjects.flatMap(id => insights[id as keyof typeof insights]?.pitfalls || []);
    return { success: allSuccess, pitfalls: allPitfalls };
  }, [selectedProjects]);

  const radarData = useMemo(() => {
      return radarPolygons.filter(poly => selectedProjects.includes(poly.id));
  }, [selectedProjects]);

  const radarColors = ['#10B981', '#3B82F6', '#F59E0B', '#6366F1', '#EC4899', '#F97316'];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-slate-800 flex items-center">
           ✨ SPARK Scan: Extract Lessons from Past Projects
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 w-5 ml-3 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-semibold">Positive Deviance Case Selection (PDCS)</p>
                <p>PDCS surfaces teams/projects whose practices are intentional, unusual, and honourable. We extract those “bright-spots” here so you can replicate them in Bhu-Setu.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Compare 5 landmark e-governance roll-outs, find patterns that drive ROI & speed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-slate-800">1. Corpus Selector</CardTitle>
              <CardDescription>Choose the landmark projects you want to analyze.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {corpusProjects.map(project => (
                  <div key={project.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={project.id}
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={() => handleToggleProject(project.id)}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <label htmlFor={project.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {project.name}
                    </label>
                  </div>
                ))}
              </div>
              <Button onClick={handleRunScan} disabled={isScanning || selectedProjects.length === 0} size="lg" className="mt-6 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                {isScanning ? 'Scanning...' : 'Run Scan'}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm h-[400px]">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800">3. Live Radar Chart (Success vs Risk)</CardTitle>
                 <CardDescription>5 axes: Cost, Delay, Quality, Scale, Inclusivity</CardDescription>
            </CardHeader>
            <CardContent>
              {isScanning ? (
                  <div className="h-[250px] flex flex-col items-center justify-center text-center">
                    <p className="mb-4">Scanning 1.8M logged events...</p>
                    <Progress value={scanProgress} className="w-1/2" />
                  </div>
              ) : scanCompleted && radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    {radarData.map((poly, index) => (
                         <Radar
                            key={poly.name}
                            name={poly.name}
                            dataKey="value"
                            data={poly.data}
                            stroke={radarColors[index % radarColors.length]}
                            fill={radarColors[index % radarColors.length]}
                            fillOpacity={0.6}
                            animationBegin={index * 100}
                         />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                 <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    <p>Run a scan to see project comparisons.</p>
                 </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-8">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-slate-800">4. Keystone Practice Basket</CardTitle>
              <CardDescription className="flex justify-between items-center">
                <span>Pin up to 5 practices.</span>
                <Badge variant="secondary">{pinnedPractices.length}/5 Practices</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[150px]">
                <AnimatePresence>
                {pinnedPractices.length > 0 ? (
                    <ul className="space-y-2">
                    {pinnedPractices.map((practice) => (
                        <motion.li
                            key={practice.id}
                            layoutId={practice.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center justify-between p-3 bg-secondary rounded-md text-secondary-foreground"
                        >
                            <span className="text-sm font-medium">{practice.title}</span>
                            <button onClick={() => handlePin(practice)} className="text-muted-foreground hover:text-destructive">
                                <X className="h-4 w-4" />
                            </button>
                        </motion.li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground text-center py-8">No keystone practices yet. Hover & click 📌 to add.</p>
                )}
                </AnimatePresence>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
               <CardTitle className="text-2xl font-semibold text-slate-800">5. Insights Feed</CardTitle>
            </CardHeader>
            <CardContent>
                {scanCompleted ? (
                <Accordion type="multiple" defaultValue={['success-patterns', 'pitfalls']} className="w-full">
                    <AccordionItem value="success-patterns">
                        <AccordionTrigger>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-emerald-100 text-emerald-800">Success Patterns</Badge>
                                <span>{filteredInsights.success.length} found</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <ul className="space-y-2">
                                {filteredInsights.success.map((item, index) => (
                                    <motion.li 
                                        key={item.id}
                                        className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 group"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold text-emerald-900">{item.title}</p>
                                            <button onClick={() => handlePin(item)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Pin className="h-4 w-4 text-muted-foreground hover:text-primary"/>
                                            </button>
                                        </div>
                                        <p className="text-sm text-emerald-800">{item.detail}</p>
                                    </motion.li>
                                ))}
                           </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="pitfalls">
                        <AccordionTrigger>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-rose-100 text-rose-800">Pitfalls</Badge>
                                <span>{filteredInsights.pitfalls.length} found</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <ul className="space-y-2">
                                {filteredInsights.pitfalls.map((item, index) => (
                                    <motion.li 
                                        key={item.id}
                                        className="p-3 rounded-lg bg-rose-50/50 border border-rose-100"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <p className="font-semibold text-rose-900">{item.title}</p>
                                        <p className="text-sm text-rose-800">{item.detail}</p>
                                    </motion.li>
                                ))}
                           </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                ) : (
                    <p className="text-muted-foreground text-center py-8">Run a scan to generate insights.</p>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
      
       <div className="flex justify-between mt-12">
           <Button variant="outline" asChild>
                <Link href="/projects/bhu-setu-2/planning/charter">
                   Back: Charter
                </Link>
            </Button>
            <Button size="lg" asChild disabled={pinnedPractices.length < 3}>
                <Link href="/projects/bhu-setu-2/planning/wbs">
                    Next: Build WBS
                </Link>
            </Button>
        </div>
    </div>
  );
}
