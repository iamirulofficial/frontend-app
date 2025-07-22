'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { planningData } from '@/data';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCw, Save } from 'lucide-react';

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

export default function SandboxPage() {
    const [concession, setConcession] = useState([15]);
    const [fee, setFee] = useState([40]);
    const [annuity, setAnnuity] = useState([20]);
    const [subsidy, setSubsidy] = useState([0]);

    const calculateIRR = () => {
        // Dummy calculation
        const baseIRR = 12;
        const concessionEffect = (concession[0] - 15) * 0.1;
        const feeEffect = (fee[0] - 40) * 0.05;
        const annuityEffect = (annuity[0] - 20) * 0.08;
        const subsidyEffect = (subsidy[0]) * -0.04;
        return baseIRR + concessionEffect + feeEffect + annuityEffect + subsidyEffect;
    };
    
    const calculateTimeline = () => {
        // Dummy calculation
        return Math.round(((15 - concession[0]) * 2) + ((40-fee[0])/5));
    }

    const currentIRR = calculateIRR();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">
          🧪 Digital-Twin Sandbox + What-If Lab
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Twin Preview */}
        <Card className="h-[600px] flex flex-col">
           <CardHeader>
             <CardTitle>Twin Preview</CardTitle>
           </CardHeader>
           <CardContent className="flex-grow bg-slate-100 rounded-b-lg flex items-center justify-center relative border-t">
              <p className="font-bold text-slate-300 text-3xl">[3D Map Placeholder]</p>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="outline" size="icon"><Play className="h-4 w-4"/></Button>
                <Button variant="outline" size="icon"><RotateCw className="h-4 w-4"/></Button>
              </div>
           </CardContent>
        </Card>
        
        {/* Controls & Metrics */}
        <div>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>What-If Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 pt-2">
                   <div>
                        <Label className="flex justify-between"><span>Concession Period</span><span className="font-bold">{concession[0]} yrs</span></Label>
                        <Slider defaultValue={concession} min={10} max={25} step={1} onValueChange={setConcession} />
                   </div>
                   <div>
                        <Label className="flex justify-between"><span>User Fee (% of cost)</span><span className="font-bold">{fee[0]}%</span></Label>
                        <Slider defaultValue={fee} min={0} max={100} step={5} onValueChange={setFee} />
                   </div>
                   <div>
                        <Label className="flex justify-between"><span>Govt Annuity (% capex)</span><span className="font-bold">{annuity[0]}%</span></Label>
                        <Slider defaultValue={annuity} min={0} max={40} step={2} onValueChange={setAnnuity} />
                   </div>
                   <div>
                        <Label className="flex justify-between"><span>BPL Subsidy (% fee)</span><span className="font-bold">{subsidy[0]}%</span></Label>
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
                        <p className={`text-5xl font-bold ${calculateTimeline() > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                           {calculateTimeline() >= 0 ? '+' : ''}{calculateTimeline()} weeks
                        </p>
                        <p className="text-sm text-muted-foreground">Timeline Shift</p>
                   </div>
                </CardContent>
             </Card>
        </div>
      </div>
      
       <div className="flex justify-between mt-12">
        <Button variant="outline" asChild>
          <Link href="/projects/bhu-setu-2/planning/wbs">
            Back: WBS
          </Link>
        </Button>
        <Button size="lg" asChild>
          <Link href="/projects/bhu-setu-2/planning/finish">
            Next: Finalize Plan
          </Link>
        </Button>
      </div>

    </div>
  );
}

// Dummy Label component for Slider
const Label = (props: React.HTMLAttributes<HTMLLabelElement>) => <label {...props} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${props.className}`} />
