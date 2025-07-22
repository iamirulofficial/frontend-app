'use client';

import { notFound } from 'next/navigation';
import { projects, bhuSetuData } from '@/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, TrendingUp, ShieldAlert, IndianRupee, Rocket } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, LabelList, ZAxis, Tooltip } from "recharts"

export default function PlanningPage({ params }: { params: { projectId: string } }) {
  const project = projects.find((p) => p.id === params.projectId);
  if (!project || project.id !== 'bhu-setu-2') {
    // Data only available for Bhu-Setu 2.0
    notFound();
  }

  const { scenarios } = bhuSetuData.planning;
  const chartConfig = {
    irr: { label: "IRR (%)" },
    delayRisk: { label: "Delay Risk (%)" },
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline tracking-tight flex items-center">
          <ClipboardList className="mr-4 h-10 w-10" /> Planning: AI-SPARK Hub
        </h1>
        <p className="text-lg text-muted-foreground">Analyze scenarios to optimize project outcomes.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <Card key={scenario.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">{scenario.id}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-green-500" /> IRR: <span className="font-bold ml-2">{(scenario.irr * 100).toFixed(1)}%</span></div>
              <div className="flex items-center"><ShieldAlert className="mr-2 h-5 w-5 text-destructive" /> Delay Risk: <span className="font-bold ml-2">{scenario.delayRisk}%</span></div>
              <div className="flex items-center"><IndianRupee className="mr-2 h-5 w-5 text-primary" /> CAPEX: <span className="font-bold ml-2">₹{scenario.capexCr} Cr</span></div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">
                    <Rocket className="mr-2 h-4 w-4" /> Run What-If
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Scenario Analysis: IRR vs. Delay Risk</CardTitle>
          <CardDescription>Visualizing potential project outcomes based on different planning scenarios.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="delayRisk" name="Delay Risk" unit="%" />
                <YAxis type="number" dataKey="irr" name="IRR" unit="%" domain={[0, 20]} tickFormatter={(value) => value.toFixed(1)} />
                <ZAxis type="category" dataKey="id" name="Scenario" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent hideLabel />} />
                <Scatter name="Scenarios" data={scenarios.map(s=>({...s, irr: s.irr * 100}))} fill="var(--color-primary)">
                  <LabelList dataKey="id" position="top" />
                </Scatter>
              </ScatterChart>
            </ChartContainer>
        </CardContent>
      </Card>

    </div>
  );
}
