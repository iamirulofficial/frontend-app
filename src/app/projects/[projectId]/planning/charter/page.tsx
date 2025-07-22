'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const AnimatedCounter = ({ to, duration = 1.5, from = 0 }: { to: number; duration?: number; from?: number; }) => {
  const [count, setCount] = useState(from);
  
  // This is a simplified animation for the counter for this prototype
  useState(() => {
    let frame = 0;
    const totalFrames = duration * 60;
    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const current = from + (to - from) * progress;
      setCount(current);
      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        setCount(to);
      }
    };
    requestAnimationFrame(animate);
  });

  return <span>{count.toLocaleString('en-IN', { maximumFractionDigits: 1 })}</span>;
};


export default function CharterPage() {
  const [isCharterExpanded, setIsCharterExpanded] = useState(false);

  const kpis = [
    { title: 'Parcels to Digitize', value: 28.7, suffix: ' crore' },
    { title: 'Target IRR', value: 12, suffix: '%' },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">
                📋 Bhu-Setu 2.0 • National Land Governance
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
                Modernize 28.7 crore land parcels with ULPIN, unlock credit, and reduce disputes.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-center">
          {kpis.map((kpi, i) => (
             <motion.div
                key={kpi.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, type: 'spring' }}
            >
                <div className="p-6 bg-card rounded-xl shadow-lg border">
                    <p className="text-lg font-semibold text-muted-foreground">{kpi.title}</p>
                    <p className="text-5xl font-bold text-primary mt-2">
                        <AnimatedCounter to={kpi.value} />
                        {kpi.suffix}
                    </p>
                </div>
            </motion.div>
          ))}
           <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5, type: 'spring' }}
            >
               <div className="p-6 bg-card rounded-xl shadow-lg border">
                    <p className="text-lg font-semibold text-muted-foreground">Avg. Title Transfer</p>
                    <p className="text-5xl font-bold text-primary mt-2">
                        <AnimatedCounter to={45} from={45} duration={0.1} />
                        <span className="mx-2">▶</span>
                        <AnimatedCounter to={7} duration={2} /> days
                    </p>
                </div>
            </motion.div>
        </div>
        
        <div className="bg-card p-8 rounded-xl shadow-lg border">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsCharterExpanded(!isCharterExpanded)}
            >
                <h2 className="text-2xl font-bold font-headline">Project Charter</h2>
                <Button variant="ghost" size="icon">
                    {isCharterExpanded ? <ChevronUp /> : <ChevronDown />}
                </Button>
            </div>
            <AnimatePresence>
            {isCharterExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div className="prose prose-lg max-w-none mt-6 text-muted-foreground space-y-4">
                        <div>
                            <h3 className="font-semibold text-foreground">Background:</h3>
                            <p>India’s DILRMP has scanned 32 Cr registry pages, but only 30% parcels have valid ULPINs. Bhu-Setu 2.0 will complete ULPIN linkage, build API-first parcel-twin, and onboard 100% of citizens onto the national land registry.</p>
                        </div>
                         <div>
                            <h3 className="font-semibold text-foreground">Objectives:</h3>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>Digitize & validate 28.7 Cr parcels by Dec 2026</li>
                                <li>Reduce title-transfer time from 45 days to 7 days</li>
                                <li>Unlock ₹1 Lakh Cr in agri-credit by FY 27</li>
                            </ol>
                        </div>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>

        <div className="flex justify-end mt-12">
            <Button size="lg" asChild>
                <Link href="/projects/bhu-setu-2/planning/scan">
                    Next: SPARK Scan
                </Link>
            </Button>
        </div>
      </motion.div>
    </div>
  );
}
