'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Animated counter component (as before)
const AnimatedCounter = ({ to, duration = 1.5, from = 0 }: { to: number; duration?: number; from?: number; }) => {
  const [count, setCount] = useState(from);
  useEffect(() => {
    let frame = 0;
    const total = duration * 60;
    const step = () => {
      frame++;
      const progress = Math.min(frame / total, 1);
      setCount(from + (to - from) * progress);
      if (frame < total) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to, duration, from]);
  return <span>{count.toLocaleString('en-IN', { maximumFractionDigits: 1 })}</span>;
};

export default function CharterPage() {
  const [isCharterExpanded, setIsCharterExpanded] = useState(false);

  // KPI definitions
  const kpis = [
    { title: 'Parcels to Digitize', value: 28.7, suffix: ' crore' },
    { title: 'Target IRR', value: 12, suffix: '%' },
    { title: 'Avg. Title Transfer', valueFrom: 45, valueTo: 7, isRange: true, suffix: ' days' },
    { title: 'Project Budget', value: 5000, suffix: ' Cr' },
    { title: 'Public‑Private Partners', value: 16 },
    { title: 'Overall Risk Index', value: 0.32, suffix: '' },
  ];

  // Milestones
  const milestones = [
    { date: 'Aug 2025', label: 'ULPIN Pilot' },
    { date: 'Dec 2025', label: '50% Parcels Digitized' },
    { date: 'Jun 2026', label: 'API Gateway Live' },
    { date: 'Dec 2026', label: '100% Digitization' },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            📋 Bhu‑Setu 2.0 • National Land Governance
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Modernize 28.7 crore land parcels with ULPIN, unlock ₹1 Lakh Cr in agri‑credit, and slash title‑transfer time from 45 → 7 days.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-12">
          {kpis.map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1, type: 'spring' }}
            >
              <div className="p-6 bg-card rounded-xl shadow-lg border">
                <p className="text-sm font-semibold text-muted-foreground uppercase">
                  {kpi.title}
                </p>
                <p className="text-4xl lg:text-5xl font-bold text-primary mt-2">
                  {kpi.isRange ? (
                    <>
                      <AnimatedCounter to={kpi.valueFrom!} from={kpi.valueFrom!} duration={0.1} />
                      <span className="mx-1">▶</span>
                      <AnimatedCounter to={kpi.valueTo!} duration={1} />
                    </>
                  ) : (
                    <AnimatedCounter to={kpi.value} />
                  )}
                  {kpi.suffix}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project Charter */}
        <div className="bg-card p-8 rounded-xl shadow-lg border mb-12">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsCharterExpanded(!isCharterExpanded)}
          >
            <h2 className="text-2xl font-bold">Project Charter</h2>
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
                className="overflow-hidden mt-6 prose prose-lg text-muted-foreground max-w-none"
              >
                <h3>Background</h3>
                <p>
                  India’s DILRMP has scanned 32 Crore registry pages—yet only 30 % of parcels have valid ULPINs. 
                  Bhu‑Setu 2.0 will complete ULPIN linkage, build an API‑first parcel‑twin, and onboard 100 % of citizens to a unified land registry.
                </p>
                <h3>Objectives</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Digitize & validate 28.7 Crore parcels by Dec 2026</li>
                  <li>Reduce title‑transfer time from 45 days to 7 days</li>
                  <li>Unlock ₹1 Lakh Crore in agri‑credit by FY 27</li>
                </ol>
                <h3>Stakeholders & Partners</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>MoHUA</strong> – Policy & funding ● Viability Gap Funding 20 %</li>
                  <li><strong>State Govts</strong> – Data provisioning, land records</li>
                  <li><strong>SPV Consortium</strong> – Digital twin dev & O&M</li>
                  <li><strong>Local NGOs</strong> – BPL outreach & grievance redressal</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Key Milestones */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">🗓️ Key Milestones</h2>
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
            {milestones.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="flex-1 bg-card p-4 rounded-lg shadow-sm border"
              >
                <p className="text-sm text-muted-foreground">{m.date}</p>
                <p className="mt-1 font-semibold">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Finance Model */}
        <div className="mb-12 bg-card p-6 rounded-xl shadow-lg border">
          <h2 className="text-2xl font-bold mb-3">💰 Finance & Revenue Model</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li><strong>User Micro‑Fees:</strong> 40 % of service cost collected via UPI.</li>
            <li><strong>API Gateway Fees:</strong> ₹25 per search/call (B2B).</li>
            <li><strong>Government Annuity:</strong> 20 % of capex disbursed as milestone‑linked payments.</li>
            <li><strong>BPL Subsidies:</strong> Up to 50 % fee waiver for eligible households.</li>
            <li><strong>Rev Share to Operator:</strong> 15 % of net revenues.</li>
          </ul>
        </div>

        {/* Next Button */}
        <div className="flex justify-end">
          <Button size="lg" asChild>
            <Link href="/projects/bhu-setu-2/planning/scan">
              Next: SPARK Scan
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
