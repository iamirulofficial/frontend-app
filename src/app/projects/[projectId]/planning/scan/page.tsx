'use client';

import { Fragment, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, Sparkles, CheckCircle2, Pin
} from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend,
  BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts';
import { radarPolygons, insights, radarAxes } from '@/data/planning';

/* --- CONSTANTS ---------------------------------------------------------- */

const STEPS = [
  { id: 0, label: 'Fetching corpus metadata' },
  { id: 1, label: 'Vector-indexing events' },
  { id: 2, label: 'Positive-Deviance clustering' },
  { id: 3, label: 'Extracting keystone practices' },
  { id: 4, label: 'Rendering insights' }
];

const AUTO_CORPUS = ['Aadhaar','UPI','DigiLocker', 'NDHM', 'GSTN', 'PMGSY'];

const radarData = radarPolygons.filter(p =>
  AUTO_CORPUS.includes(p.name)
);
const colors = ['#10B981','#3B82F6','#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

/* --- PAGE -------------------------------------------------------------- */

export default function SparkScan() {
  /*  Phase machine:
      'idle' -> show suggestion cards
      'run'  -> looping through STEPS
      'done' -> show results
  */
  const [phase, setPhase] = useState<'idle'|'run'|'done'>('idle');
  const [current, setCurrent] = useState(0);       // index inside STEPS
  const [progress, setProgress] = useState(0);     // 0-100 smooth bar
  const [pinned]   = useState([
    insights.aadhaar.success[0],
    insights.upi.success[0],
    insights.digilocker.success[0],
    insights.pmgsy.success[0]
  ]);

  /*  STEP-LOOP  */
  useEffect(() => {
    if (phase !== 'run') return;
    // total runtime ≈ 6 s
    const stepDur = 1200;
    const interval = setInterval(() => {
      setCurrent(i => {
        if (i === STEPS.length - 1) {
          clearInterval(interval);
          setPhase('done');
          return i;
        }
        return i + 1;
      });
    }, stepDur);

    // smooth progress bar
    const smooth = setInterval(() => {
      setProgress(p => Math.min(p + 100 / (STEPS.length * 10), 100));
    }, stepDur / 10);

    return () => { clearInterval(interval); clearInterval(smooth); };
  }, [phase]);

  /*  --------------------------  */

  // Prepare data for the bar chart
  const barChartData = AUTO_CORPUS.map(projectName => {
    const projectData = radarPolygons.find(p => p.name === projectName)?.data;
    const data: { name: string; [key: string]: number | string } = { name: projectName };
    if (projectData) {
      projectData.forEach(item => {
        data[item.axis] = item.value;
      });
    }
    return data;
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl space-y-8">

      {/* HEADER */}
      <h1 className="text-3xl font-bold flex items-center">
        <Sparkles className="text-primary mr-2" />
        SPARK Scan • Agentic AI
      </h1>
      <p className="text-muted-foreground">
        Let the Copilot mine landmark e-governance projects, cluster bright-spots,
        and auto-pin keystone practices for Bhu-Setu 2.0.
      </p>

      {/* 1) AI SUGGESTION CARDS (idle) */}
      <AnimatePresence>
      {phase === 'idle' && (
        <motion.div
          initial={{ opacity:0, y:10 }}
          animate={{ opacity:1, y:0 }}
          exit={{ opacity:0, y:-10 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            ['Land-Tenure Patterns','Borrow Aadhaar & PMGSY for bulk geotagging.'],
            ['Payment Rails','UPI micro-fees & AutoPay mandate.'],
            ['Doc-Vault','DigiLocker hash-verify & consent UI.'],
            ['Risk Models','GSTN stress-load anomaly system.']
          ].map(([title,desc]) => (
            <Card key={title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
          <div className="md:col-span-2 flex justify-center mt-4">
            <Button size="lg" onClick={() => setPhase('run')}>
              <Loader2 className="animate-spin mr-2 h-5 w-5"/> Start SPARK Scan
            </Button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* 2) MULTI-STEP LOADER (run) */}
      {phase === 'run' && (
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>AI Processing Pipeline</CardTitle>
            <CardDescription>{STEPS[current].label}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stepper list */}
            <ul className="space-y-2">
              {STEPS.map((s,i) => (
                <li key={s.id} className="flex items-center space-x-3">
                  {i < current
                    ? <CheckCircle2 className="text-emerald-600"/>
                    : i === current
                      ? <Loader2 className="animate-spin text-blue-600"/>
                      : <span className="h-4 w-4 rounded-full bg-gray-300 inline-block"/>
                  }
                  <span className={i === current ? 'font-semibold' : ''}>
                    {s.label}
                  </span>
                </li>
              ))}
            </ul>
            {/* Spark-trail progress */}
            <Progress value={progress} className="h-2 rounded-full bg-gradient-to-r from-indigo-200 via-blue-400 to-emerald-400"/>
          </CardContent>
        </Card>
      )}

      {/* 3) RESULTS (done) */}
      <AnimatePresence>
      {phase === 'done' && (
        <motion.div
          initial={{ opacity:0, y:10 }}
          animate={{ opacity:1, y:0 }}
          exit={{ opacity:0 }}
          className="space-y-8"
        >
          {/* Enhanced Bright-Spot Analysis */}
          <Card className="border-2 border-gradient-to-r from-blue-200 to-emerald-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-xl">
                    <Sparkles className="text-blue-600 mr-3 h-6 w-6" />
                    Bright-Spot Performance Matrix
                  </CardTitle>
                  <CardDescription className="mt-2 text-base">
                    AI-extracted success patterns from landmark e-governance projects, ranked by Positive Deviance clustering across 5 critical success dimensions
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50">
                  PDCS Algorithm
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Success Dimensions Legend */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {[
                  { name: 'Cost Efficiency', color: colors[0], icon: '💰' },
                  { name: 'Timeline Delivery', color: colors[1], icon: '⚡' },
                  { name: 'Service Quality', color: colors[2], icon: '⭐' },
                  { name: 'Population Scale', color: colors[3], icon: '🌐' },
                  { name: 'Inclusive Access', color: colors[4], icon: '🤝' }
                ].map((dimension, i) => (
                  <div key={dimension.name} className="flex items-center space-x-2 p-2 rounded-lg bg-muted/30">
                    <span className="text-lg">{dimension.icon}</span>
                    <div>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dimension.color }}></div>
                      <span className="text-xs font-medium text-muted-foreground">{dimension.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Radar Chart with Enhanced Context */}
              <div className="relative h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarAxes.map(axis => {
                    const dataPoint: any = { axis };
                    radarData.forEach(project => {
                      const projectAxisData = project.data.find(d => d.axis === axis);
                      dataPoint[project.name] = projectAxisData?.value || 0;
                    });
                    return dataPoint;
                  })}>
                    <PolarGrid stroke="#e2e8f0" strokeWidth={1}/>
                    <PolarAngleAxis
                      dataKey="axis"
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                    />
                     {radarData.map((poly,i) => (
                      <Radar
                        key={poly.name}
                        dataKey={poly.name}
                        stroke={colors[i]}
                        fill={colors[i]}
                        fillOpacity={0.3}
                        strokeWidth={2.5}
                        name={poly.name}
                        dot={{ fill: colors[i], strokeWidth: 2, r: 4 }}
                      />
                    ))}
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ paddingBottom: '20px', fontSize: '14px', fontWeight: '500' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>

                {/* Performance Indicators */}
                <div className="absolute top-4 right-4 space-y-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border">
                    <div className="text-xs text-muted-foreground mb-1">Top Performer</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-semibold">UPI</span>
                      <Badge variant="secondary" className="text-xs">0.94 Composite</Badge>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border">
                    <div className="text-xs text-muted-foreground mb-1">Bright-Spot Leader</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-semibold">Aadhaar</span>
                      <Badge variant="secondary" className="text-xs">Scale Excellence</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extracted Bright-Spot Insights */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm mb-3 flex items-center">
                  <CheckCircle2 className="text-emerald-500 mr-2 h-4 w-4" />
                  Key Bright-Spot Patterns Identified
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <span><strong>Interoperable API Design:</strong> Single integration point drives 85% faster adoption</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <span><strong>Bi-modal Authentication:</strong> Reduces identity conflicts by 99.7%</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2"></div>
                    <span><strong>Consent-Driven Access:</strong> Increases citizen trust scores by 78%</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <span><strong>Real-time Settlement:</strong> Enables 24/7 availability with 99.9% uptime</span>
                  </div>
                </div>
              </div>

              {/* Methodology Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Sparkles className="text-blue-600 h-5 w-5 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-900 text-sm">Positive Deviance Case Selection (PDCS)</h5>
                    <p className="text-blue-700 text-xs mt-1">
                      Algorithm identifies non-normative practices that achieve exceptional outcomes.
                      Each project's polygon area represents composite success across all dimensions,
                      with individual axis performance indicating domain-specific excellence.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keystone Practices Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pinned Keystone Practices</CardTitle>
              <CardDescription>Auto-extracted via PDCS clustering</CardDescription>
            </CardHeader>
            <CardContent>
              {pinned.map(item => (
                <div key={item.id} className="flex items-center space-x-2 mb-2">
                  <Pin className="text-primary"/>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Analysis Report - Dashboard View */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Report Dashboard</CardTitle>
              <CardDescription>Detailed analysis and visualizations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

              {/* Bar Chart Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Performance Metrics</CardTitle>
                  <CardDescription>Comparison of key metrics across projects</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      {radarAxes.map((axis, i) => (
                         <Bar key={axis} dataKey={axis} fill={colors[i % colors.length]} name={axis}/>
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Visual Analysis Report */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Radar Chart Interpretation */}
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="text-blue-500 mr-2 h-5 w-5" />
                      Radar Chart Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground mb-4">
                      The radar chart compares e-governance projects across 7 key dimensions.
                      Larger polygon areas indicate better overall performance.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Cost', 'Delay', 'Quality', 'Scale', 'Inclusivity', 'User Adoption', 'Security'].map((dimension, i) => (
                        <Badge key={dimension} variant="outline" style={{ borderColor: colors[i], color: colors[i] }}>
                          {dimension}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Success Factors */}
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle2 className="text-green-500 mr-2 h-5 w-5" />
                      Key Success Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-3">
                      {[
                        { icon: '🔗', title: 'Interoperability', desc: 'Single API layer across platforms' },
                        { icon: '🔐', title: 'Authentication', desc: 'Bi-modal & seamless 2FA' },
                        { icon: '📈', title: 'Scalability', desc: 'Massive user & transaction capacity' },
                        { icon: '🏛️', title: 'Policy Support', desc: 'Strong government backing' },
                        { icon: '💡', title: 'Problem Solving', desc: 'Clear value proposition' }
                      ].map((factor) => (
                        <div key={factor.title} className="flex items-start space-x-3">
                          <span className="text-lg">{factor.icon}</span>
                          <div>
                            <p className="font-medium text-sm">{factor.title}</p>
                            <p className="text-xs text-muted-foreground">{factor.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Metrics Explanation Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
                {[
                  { metric: 'Cost', icon: '💰', desc: 'Financial efficiency & expenditure control', color: 'text-red-500' },
                  { metric: 'Delay', icon: '⏱️', desc: 'Timeline adherence & delivery speed', color: 'text-orange-500' },
                  { metric: 'Quality', icon: '⭐', desc: 'Reliability & service effectiveness', color: 'text-yellow-500' },
                  { metric: 'Scale', icon: '🌐', desc: 'User reach & geographical coverage', color: 'text-green-500' },
                  { metric: 'Inclusivity', icon: '🤝', desc: 'Demographic diversity & accessibility', color: 'text-blue-500' },
                  { metric: 'User Adoption', icon: '📱', desc: 'Citizen uptake & usage rates', color: 'text-indigo-500' },
                  { metric: 'Security', icon: '🛡️', desc: 'Data protection & cyber resilience', color: 'text-purple-500' }
                ].map((item) => (
                  <Card key={item.metric} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xl">{item.icon}</span>
                        <h3 className={`font-semibold text-sm ${item.color}`}>{item.metric}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Project Portfolio */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Pin className="text-purple-500 mr-2 h-5 w-5" />
                    Analyzed Projects Portfolio
                  </CardTitle>
                  <CardDescription>Government digital initiatives in the analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        name: 'Aadhaar',
                        icon: '🆔',
                        type: 'Identity System',
                        highlight: 'Scale & Security Leader',
                        desc: '12-digit unique ID for 1.4B+ residents'
                      },
                      {
                        name: 'UPI',
                        icon: '💳',
                        type: 'Payment Infrastructure',
                        highlight: 'Adoption Champion',
                        desc: 'Real-time inter-bank transfers'
                      },
                      {
                        name: 'DigiLocker',
                        icon: '📁',
                        type: 'Document Vault',
                        highlight: 'Quality Focus',
                        desc: 'Digital document storage & verification'
                      },
                      {
                        name: 'NDHM',
                        icon: '🏥',
                        type: 'Health Platform',
                        highlight: 'Inclusivity Driver',
                        desc: 'Digital health infrastructure & IDs'
                      },
                      {
                        name: 'GSTN',
                        icon: '🧾',
                        type: 'Tax Platform',
                        highlight: 'Cost Optimizer',
                        desc: 'GST portal & compliance system'
                      },
                      {
                        name: 'PMGSY',
                        icon: '🛣️',
                        type: 'Infrastructure',
                        highlight: 'Monitoring Excellence',
                        desc: 'Rural connectivity & asset tracking'
                      }
                    ].map((project) => (
                      <div key={project.name} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">{project.icon}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{project.name}</h4>
                            <Badge variant="secondary" className="text-xs">{project.type}</Badge>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                            {project.highlight}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{project.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-end">
            <Link href="/projects/bhu-setu-2/planning/wbs">
              <Button size="lg">Next: Build Work Breakdown Structure</Button>
            </Link>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}