'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { planningData } from '@/data';
import { MapPin } from 'lucide-react';

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCompleted, setScanCompleted] = useState(false);

  const handleRunScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanCompleted(true);
          return 100;
        }
        return prev + 1;
      });
    }, 40);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">
          💡 SPARK Scan: Identify Your Bright Spots
        </h1>
        <p className="mt-2 text-xl text-muted-foreground max-w-3xl mx-auto">
          Run a quick scan of historical land-governance rollouts to spot top-performing districts you can model your project after.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Map Panel */}
        <div className="lg:w-2/3 h-[600px] bg-slate-100 rounded-lg flex items-center justify-center relative border shadow-inner overflow-hidden">
          <p className="font-bold text-slate-300 text-3xl">[India Map Placeholder]</p>
          {scanCompleted && planningData.brightSpots.map((spot, i) => (
            <motion.div
              key={spot.district}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              className="absolute w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"
              style={{ top: `${20 + Math.random() * 60}%`, left: `${10 + Math.random() * 80}%` }}
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            </motion.div>
          ))}
           {isScanning && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10"
                >
                    <p className="text-lg font-semibold mb-4">Analyzing 8 years of DILRMP KPIs...</p>
                    <Progress value={scanProgress} className="w-1/2" />
                </motion.div>
            )}
        </div>

        {/* Results Panel */}
        <div className="lg:w-1/3">
          {!scanCompleted ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Button size="lg" onClick={handleRunScan} disabled={isScanning} className="animate-pulse">
                {isScanning ? 'Scanning...' : 'Run SPARK Scan'}
              </Button>
            </div>
          ) : (
             <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.5}}>
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performers</CardTitle>
                        <CardDescription>These districts completed land-titling ~30% faster than average.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>District</TableHead>
                                    <TableHead>ROI</TableHead>
                                    <TableHead>Delay</TableHead>
                                    <TableHead>QC</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {planningData.brightSpots.map(spot => (
                                    <TableRow key={spot.district}>
                                        <TableCell className="font-medium">{spot.district}</TableCell>
                                        <TableCell><Badge variant="outline" className="text-emerald-600 border-emerald-300">{spot.roi * 100}%</Badge></TableCell>
                                        <TableCell><Badge variant="outline" className="text-emerald-600 border-emerald-300">{spot.delayDays}d</Badge></TableCell>
                                        <TableCell><Badge variant="outline">{spot.qc}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
             </motion.div>
          )}
        </div>
      </div>

       <div className="flex justify-between mt-12">
           <Button variant="outline" asChild>
                <Link href="/projects/bhu-setu-2/planning/library">
                   Back: Library
                </Link>
            </Button>
            <Button size="lg" asChild disabled={!scanCompleted}>
                <Link href="/projects/bhu-setu-2/planning/wbs">
                    Next: Build WBS
                </Link>
            </Button>
        </div>
    </div>
  );
}
