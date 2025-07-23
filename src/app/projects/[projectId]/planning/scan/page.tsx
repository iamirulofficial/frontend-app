'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Info, Pin, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '@/components/ui/accordion';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, Radar, Legend
} from 'recharts';
import {
  insights, radarAxes, radarPolygons, corpusProjects
} from '@/data/planning';

type Insight = { id: string; title: string; detail: string; };

// Our “Copilot” picks these three for you
const AI_RECOMMEND = ['aadhaar','upi','digilocker'];

export default function SparkScanPage() {
  const { toast } = useToast();

  // AI state: 'suggested' → show copilot card; 'accepted' → show scan workflow
  const [aiState, setAiState] = useState<'suggested'|'accepted'>('suggested');

  // Standard SPARK scan states
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [pinnedPractices, setPinnedPractices] = useState<Insight[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCompleted, setScanCompleted] = useState(false);

  // When AI accepted, pre‑select the recommendations
  useEffect(() => {
    if (aiState === 'accepted') {
      setSelectedProjects(AI_RECOMMEND);
      // auto‑pin top 2 practices
      setPinnedPractices([
        insights['aadhaar'].success[0],
        insights['upi'].success[0]
      ]);
    }
  }, [aiState]);

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
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanCompleted(true);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  const handlePin = (practice: Insight) => {
    if (pinnedPractices.find(p => p.id === practice.id)) {
      setPinnedPractices(p => p.filter(x => x.id !== practice.id));
    } else if (pinnedPractices.length < 5) {
      setPinnedPractices(p => [...p, practice]);
      toast({ title: "Pinned", description: `'${practice.title}' added.` });
    } else {
      toast({ title: "Limit Reached", description: "You can pin up to 5 practices.", variant: "destructive" });
    }
  };

  const filteredInsights = useMemo(() => {
    const allSuccess = selectedProjects.flatMap(id => insights[id as keyof typeof insights]?.success || []);
    const allPitfalls = selectedProjects.flatMap(id => insights[id as keyof typeof insights]?.pitfalls || []);
    return { success: allSuccess, pitfalls: allPitfalls };
  }, [selectedProjects]);

  const radarData = useMemo(() =>
    radarPolygons.filter(poly => selectedProjects.includes(poly.id)),
  [selectedProjects]);

  const radarColors = ['#10B981','#3B82F6','#F59E0B','#6366F1','#EC4899','#F97316'];

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl space-y-8">
      
      {/* AI Copilot Suggestion */}
      <AnimatePresence>
      {aiState === 'suggested' && (
        <motion.div
          initial={{ opacity:0, y:10 }}
          animate={{ opacity:1, y:0 }}
          exit={{ opacity:0, y:10 }}
          className="bg-blue-50 border-blue-200 border p-6 rounded-lg shadow flex items-start space-x-4"
        >
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <div className="flex-1">
            <p className="text-blue-800">
              “Based on PDCS analysis, I suggest scanning <strong>Aadhaar</strong>, <strong>UPI</strong>, and <strong>DigiLocker</strong> for best ‘bright‑spot’ practices.”
            </p>
            <div className="mt-4 flex space-x-3">
              <Button onClick={() => setAiState('accepted')} size="sm">Apply Suggestion</Button>
              <Button variant="outline" size="sm" onClick={() => setAiState('accepted')}>
                Customize Myself
              </Button>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Main Grid */}
      {aiState === 'accepted' && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left */}
        <div className="lg:col-span-2 space-y-8">

          {/* Corpus Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">1. Corpus Selector</CardTitle>
              <CardDescription>Review or tweak Copilot's picks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {corpusProjects.map(proj => (
                  <label key={proj.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedProjects.includes(proj.id)}
                      onCheckedChange={() => handleToggleProject(proj.id)}
                    />
                    <span className="capitalize">{proj.name}</span>
                  </label>
                ))}
              </div>
              <Button
                onClick={handleRunScan}
                disabled={isScanning || scanCompleted}
                className="mt-6"
              >
                {isScanning
                  ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> 
                  : <Check className="mr-2 h-4 w-4"/>}
                {isScanning ? 'Scanning…' : scanCompleted ? 'Re‑Scan' : 'Run SPARK Scan'}
              </Button>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card className="h-[400px]">
            <CardHeader>
              <CardTitle className="text-2xl">3. Live Radar Chart</CardTitle>
              <CardDescription>Cost · Delay · Quality · Scale · Inclusivity</CardDescription>
            </CardHeader>
            <CardContent>
              {isScanning ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <p>Analyzing {selectedProjects.length * 0.6}M events…</p>
                  <Progress value={scanProgress} className="w-2/3"/>
                </div>
              ) : scanCompleted && radarData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0,1]}/>
                    {radarData.map((poly,i) => (
                      <Radar
                        key={poly.name}
                        name={poly.name}
                        dataKey="value"
                        data={poly.data}
                        stroke={radarColors[i]}
                        fill={radarColors[i]}
                        fillOpacity={0.5}
                      />
                    ))}
                    <Legend verticalAlign="top"/>
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p>Run a scan to visualize comparisons.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-8">

          {/* Keystone Basket */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">4. Keystone Practices</CardTitle>
              <Badge>{pinnedPractices.length}/5</Badge>
            </CardHeader>
            <CardContent className="min-h-[150px]">
              <AnimatePresence>
                {pinnedPractices.length
                  ? pinnedPractices.map(p => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity:0, x:20 }}
                      animate={{ opacity:1, x:0 }}
                      exit={{ opacity:0, x:-20 }}
                      className="flex items-center justify-between p-3 bg-secondary rounded"
                    >
                      <span>{p.title}</span>
                      <X
                        className="cursor-pointer"
                        onClick={() => handlePin(p)}
                      />
                    </motion.div>
                  ))
                  : <p className="text-center text-muted-foreground">No practices pinned. Pin from Insights below.</p>
                }
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Insights Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">5. Insights Feed</CardTitle>
            </CardHeader>
            <CardContent>
              {scanCompleted ? (
                <Accordion type="multiple" defaultValue={['succ','pit']}>
                  <AccordionItem value="succ">
                    <AccordionTrigger>
                      <Badge className="bg-emerald-100 text-emerald-800">Success</Badge>
                      <span className="ml-2">({filteredInsights.success.length})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {filteredInsights.success.map((it,i) => (
                        <motion.div
                          key={it.id}
                          initial={{ opacity:0, y:-5 }}
                          animate={{ opacity:1, y:0 }}
                          transition={{ delay: i*0.05 }}
                          className="p-3 border-l-4 border-emerald-400 mb-2"
                        >
                          <div className="flex justify-between items-start">
                            <p className="font-semibold">{it.title}</p>
                            <Pin
                              className="cursor-pointer"
                              onClick={() => handlePin(it)}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">{it.detail}</p>
                        </motion.div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="pit">
                    <AccordionTrigger>
                      <Badge className="bg-rose-100 text-rose-800">Pitfalls</Badge>
                      <span className="ml-2">({filteredInsights.pitfalls.length})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {filteredInsights.pitfalls.map((it,i) => (
                        <motion.div
                          key={it.id}
                          initial={{ opacity:0, y:-5 }}
                          animate={{ opacity:1, y:0 }}
                          transition={{ delay: i*0.05 }}
                          className="p-3 border-l-4 border-rose-400 mb-2"
                        >
                          <p className="font-semibold">{it.title}</p>
                          <p className="text-sm text-muted-foreground">{it.detail}</p>
                        </motion.div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <p className="text-center text-muted-foreground py-12">
                  Run a scan to reveal success patterns & pitfalls.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-12">
        <Button variant="outline" asChild>
          <Link href="/projects/bhu-setu-2/planning/charter">Back: Charter</Link>
        </Button>
        <Button size="lg" asChild disabled={pinnedPractices.length < 3 || !scanCompleted}>
          <Link href="/projects/bhu-setu-2/planning/wbs">Next: Build WBS</Link>
        </Button>
      </div>
    </div>
  );
}
