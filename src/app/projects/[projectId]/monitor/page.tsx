'use client';

import { notFound, useParams } from 'next/navigation';
import { projects, bhuSetuData } from '@/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, AlertTriangle, IndianRupee, Wifi, Handshake, ShieldCheck, TrendingUp, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Button } from '@/components/ui/button';

export default function MonitorPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const project = projects.find((p) => p.id === projectId);

  if (!project || project.id !== 'bhu-setu-2') {
    notFound();
  }

  const { anomalies, pppOversight } = bhuSetuData.monitor;

  const chartData = [
    { time: "11:50", packets: 1150 },
    { time: "11:51", packets: 1180 },
    { time: "11:52", packets: 1120 },
    { time: "11:53", packets: 1210 },
    { time: "11:54", packets: 1190 },
    { time: "11:55", packets: 1250 },
    { time: "11:56", packets: 1200 },
  ];
  const chartConfig = {
    packets: { label: "Packets/min", color: "hsl(var(--primary))" },
  };
  
  const severityClasses: { [key: string]: string } = {
    low: 'bg-green-500/20 text-green-700 border-green-400',
    medium: 'bg-yellow-500/20 text-yellow-700 border-yellow-400 animate-pulse-amber',
    high: 'bg-red-500/20 text-red-700 border-red-400 animate-pulse-red',
  };

   const getStatusColor = (status: 'on-track' | 'at-risk' | 'breached') => {
    switch (status) {
      case 'on-track': return 'text-green-500';
      case 'at-risk': return 'text-yellow-500';
      case 'breached': return 'text-red-500';
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline tracking-tight flex items-center">
          <BarChart2 className="mr-4 h-10 w-10 text-primary" /> Monitor: AI Control-Tower
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">Real-time performance monitoring, anomaly detection, and PPP oversight.</p>
      </div>
      
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Handshake className="mr-2"/>PPP Oversight KPI Board</CardTitle>
            <CardDescription>Monitoring concession KPIs for government and private partner alignment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Actual</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pppOversight.map(item => (
                        <TableRow key={item.metric}>
                            <TableCell className="font-medium">{item.metric}</TableCell>
                            <TableCell>{item.target}</TableCell>
                            <TableCell>{item.actual}</TableCell>
                            <TableCell className={`text-right font-semibold capitalize ${getStatusColor(item.status)}`}>
                                {item.status.replace('-', ' ')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><AlertTriangle className="mr-2"/>Anomaly Pulse List</CardTitle>
            <CardDescription>Any "red" KPI automatically triggers a "What-If" sandbox in Planning.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {anomalies.map((anomaly) => (
                <li key={anomaly.id} className={`flex items-center justify-between space-x-4 p-3 rounded-lg border ${severityClasses[anomaly.severity]}`}>
                  <div className="flex items-center space-x-3">
                     <div className={`h-3 w-3 rounded-full flex-shrink-0 bg-current`}></div>
                     <p className="font-medium text-sm">{anomaly.description}</p>
                  </div>
                  {anomaly.severity === 'high' && 
                    <Button size="sm" variant="destructive">
                        <Rocket className="mr-2 h-4 w-4" /> Re-plan
                    </Button>
                  }
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Live Feed: IoT Data Streaming</CardTitle>
               <CardDescription>Real-time data from on-ground sensors and survey equipment.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <defs>
                          <linearGradient id="colorPackets" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                      <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis hide/>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="line" />} />
                      <Area dataKey="packets" type="monotone" fill="url(#colorPackets)" stroke="hsl(var(--primary))" stackId="a" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">API Revenue</CardTitle>
                    <IndianRupee className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">₹{bhuSetuData.monitor.revenueToday} L</div>
                    <p className="text-xs text-muted-foreground">Today's collection</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">99.8%</div>
                    <p className="text-xs text-muted-foreground">Service uptime</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">IoT Packets</CardTitle>
                    <Wifi className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{bhuSetuData.monitor.iotPacketsPerMin}</div>
                     <p className="text-xs text-muted-foreground">per minute</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{(bhuSetuData.monitor.apiCalls / 1000).toFixed(1)}k</div>
                     <p className="text-xs text-muted-foreground">past 24h</p>
                </CardContent>
            </Card>
          </div>
       </div>

    </div>
  );
}
