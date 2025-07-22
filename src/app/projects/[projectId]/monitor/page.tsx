import { notFound } from 'next/navigation';
import { projects, bhuSetuData } from '@/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, AlertTriangle, IndianRupee, Wifi } from 'lucide-react';
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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"

export default function MonitorPage({ params }: { params: { projectId: string } }) {
  const project = projects.find((p) => p.id === params.projectId);
  if (!project || project.id !== 'bhu-setu-2') {
    notFound();
  }

  const { anomalies } = bhuSetuData.monitor;

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

  const ragHeatmapData = [
    { metric: 'Data Accuracy', status: 'green' },
    { metric: 'Transaction Speed', status: 'green' },
    { metric: 'API Uptime', status: 'amber' },
    { metric: 'Budget Variance', status: 'green' },
    { metric: 'Schedule Adherence', status: 'red' },
  ];
  
  const severityClasses = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500 animate-pulse-amber',
    high: 'bg-red-500 animate-pulse-red',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline tracking-tight flex items-center">
          <BarChart2 className="mr-4 h-10 w-10" /> Monitor: AI Control-Tower
        </h1>
        <p className="text-lg text-muted-foreground">Real-time performance monitoring and anomaly detection.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">IoT Packets</CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{bhuSetuData.monitor.iotPacketsPerMin} <span className="text-sm text-muted-foreground">min⁻¹</span></div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₹{bhuSetuData.monitor.revenueToday} L</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{(bhuSetuData.monitor.apiCalls / 1000).toFixed(1)}k</div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Feed: IoT Data Streaming</CardTitle>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="colorPackets" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis hide/>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Area dataKey="packets" type="natural" fill="url(#colorPackets)" stroke="var(--color-primary)" stackId="a" />
              </AreaChart>
            </ChartContainer>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Anomaly Pulse List</CardTitle>
            <CardDescription>Key alerts identified by the monitoring system.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {anomalies.map((anomaly) => (
                <li key={anomaly.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent/50">
                  <div className={`h-3 w-3 rounded-full flex-shrink-0 ${severityClasses[anomaly.severity]}`}></div>
                  <div className="flex-grow">
                    <p className="font-medium text-sm">{anomaly.description}</p>
                    <Badge variant="outline" className="mt-1 capitalize">{anomaly.severity} Severity</Badge>
                  </div>
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>RAG Heatmap</CardTitle>
            <CardDescription>High-level status of key project metrics.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ragHeatmapData.map(item => (
                        <TableRow key={item.metric}>
                            <TableCell className="font-medium">{item.metric}</TableCell>
                            <TableCell className="text-right">
                                <Badge className={`capitalize text-white ${item.status === 'green' ? 'bg-green-500' : item.status === 'amber' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                    {item.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
