'use client';

import { notFound, useParams } from 'next/navigation';
import { projects, bhuSetuData } from '@/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, TrendingUp, ShieldAlert, IndianRupee, Rocket, SlidersHorizontal, Users, BarChart } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, LabelList, ZAxis, ResponsiveContainer, Label } from "recharts"
import { Input } from '@/components/ui/input';
import { Label as UiLabel } from '@/components/ui/label';

export default function PlanningPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const project = projects.find((p) => p.id === projectId);
  
  if (!project || project.id !== 'bhu-setu-2') {
    // Data only available for Bhu-Setu 2.0
    notFound();
  }

  const { scenarios, pppFinancials } = bhuSetuData.planning;
  const chartConfig = {
    irr: { label: "IRR (%)" },
    delayRisk: { label: "Delay Risk (%)" },
    capexCr: { label: "CAPEX (₹Cr)" },
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline tracking-tight flex items-center">
          <ClipboardList className="mr-4 h-10 w-10 text-primary" /> Planning: AI-SPARK Hub
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">Analyze scenarios to optimize project outcomes and structure Public-Private Partnerships.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center"><BarChart className="mr-2"/>Scenario Analysis: IRR vs. Delay Risk</CardTitle>
                <CardDescription>Visualizing potential project outcomes based on different planning scenarios.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <ResponsiveContainer>
                        <ScatterChart margin={{ top: 20, right: 40, bottom: 40, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="delayRisk" name="Delay Risk" unit="%" domain={[5, 30]}>
                                <Label value="Delay Risk (%)" offset={-25} position="insideBottom" />
                            </XAxis>
                            <YAxis type="number" dataKey="irr" name="IRR" unit="%" domain={[0, 20]} tickFormatter={(value) => value.toFixed(1)}>
                                <Label value="IRR (%)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <ZAxis type="number" dataKey="capexCr" range={[40, 400]} name="CAPEX (₹Cr)" />
                            <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent indicator="dot" />} />
                            <Scatter name="Scenarios" data={scenarios.map(s=>({...s, irr: s.irr * 100}))} fill="hsl(var(--primary))" className="opacity-80">
                                <LabelList dataKey="id" position="top" className="text-xs font-semibold"/>
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><SlidersHorizontal className="mr-2"/>Digital-Twin Sandbox</CardTitle>
                <CardDescription>Run "What-If" simulations on key PPP financial levers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <UiLabel htmlFor="concession">Concession Period (Years)</UiLabel>
                    <Input id="concession" type="number" defaultValue={pppFinancials.concessionLength} />
                </div>
                <div className="space-y-2">
                    <UiLabel htmlFor="vgf">Viability Gap Funding (%)</UiLabel>
                    <Input id="vgf" type="number" defaultValue={pppFinancials.viabilityGapFunding} />
                </div>
                 <div className="space-y-2">
                    <UiLabel htmlFor="fee">User Fee per Transaction (₹)</UiLabel>
                    <Input id="fee" type="number" defaultValue={pppFinancials.userFee} />
                </div>
            </CardContent>
            <CardFooter>
                 <Button className="w-full">
                    <Rocket className="mr-2 h-4 w-4" /> Simulate & Re-plan
                </Button>
            </CardFooter>
        </Card>
      </div>

       <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Base Case IRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(scenarios[0].irr * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Baseline financial return</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Highest Litigation Risk</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scenarios[2].delayRisk}%</div>
            <p className="text-xs text-muted-foreground">In 'Hi-Litigation' scenario</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">PPP Boost CAPEX</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{scenarios[1].capexCr} Cr</div>
             <p className="text-xs text-muted-foreground">Increased initial investment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">BPL Subsidies Impact</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-1.2% IRR</div>
            <p className="text-xs text-muted-foreground">Simulated for inclusivity</p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
