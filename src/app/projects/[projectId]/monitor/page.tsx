
'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { KpiCard } from '@/components/kpi-card';
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
  Users,
  Map,
  BarChart3,
  Settings,
  Banknote,
  AlertTriangle,
  FileText,
  Smile,
  Server,
  Target,
} from 'lucide-react';
import { bhuSetuData } from '@/data';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  BarChart as RechartsBarChart,
} from 'recharts';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

const monitorData = bhuSetuData.monitor;

const summaryKpis = [
  {
    title: 'Parcels Digitized',
    value: 14.3,
    total: 28.7,
    unit: ' Cr',
    icon: <Map />,
  },
  { title: 'Avg. QC Score', value: 88, unit: '%', icon: <BarChart3 /> },
  { title: 'Live Active Users', value: 12.4, unit: ' K', icon: <Users /> },
  { title: 'API Calls/s', value: 320, unit: '', icon: <Settings /> },
  {
    title: 'Fee Income Today',
    value: 1.2,
    total: 2.0,
    unit: ' Cr',
    icon: <Banknote />,
  },
  { title: 'Disputes Pending', value: 3500, unit: '', icon: <AlertTriangle /> },
];

const anomalyColors = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-blue-500',
};

const statusColors: { [key: string]: string } = {
  'on-track': 'text-emerald-500',
  'at-risk': 'text-amber-500',
  breached: 'text-destructive',
};

const BulletChart = ({
  value,
  target,
  label,
}: {
  value: number;
  target: number;
  label: string;
}) => {
  const percentage = Math.min((value / target) * 100, 100);
  let colorClass = 'bg-emerald-500';
  if (percentage < 75) colorClass = 'bg-destructive';
  else if (percentage < 90) colorClass = 'bg-amber-500';

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {value} / {target}
        </span>
      </div>
      <div className="relative h-4 w-full rounded-full bg-secondary">
        <div
          className={`absolute h-full rounded-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute top-0 h-full w-1 bg-foreground"
          style={{ left: `calc(${Math.min((target / target) * 100, 100)}% - 2px)` }}
        />
      </div>
    </div>
  );
};

const MiniSparkline = () => {
  const data = [
    { name: 'Page A', uv: 4000 },
    { name: 'Page B', uv: 3000 },
    { name: 'Page C', uv: 2000 },
    { name: 'Page D', uv: 2780 },
    { name: 'Page E', uv: 1890 },
    { name: 'Page F', uv: 2390 },
    { name: 'Page G', uv: 3490 },
  ];
  return (
    <ResponsiveContainer width="100%" height={60}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <RechartsTooltip contentStyle={{ fontSize: '12px', padding: '4px 8px' }} />
        <Area
          type="monotone"
          dataKey="uv"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const DonutChart = ({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) => {
  const data = [
    { name: 'value', value: value },
    { name: 'remaining', value: 100 - value },
  ];
  return (
    <div className="relative flex h-24 w-24 flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            dataKey="value"
            innerRadius="70%"
            outerRadius="100%"
            startAngle={90}
            endAngle={450}
          >
            <Cell fill={color} className="stroke-none" />
            <Cell fill="hsl(var(--muted))" className="stroke-none" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-bold">{value}%</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
};

const grievanceData = [
  { name: 'Filed', value: 3500, fill: 'hsl(var(--destructive))' },
  { name: 'Resolved', value: 3150, fill: 'hsl(var(--accent))' },
];

export default function MonitorPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline tracking-tight">
          📈 Monitor: Live Project Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Real-time executive view of Bhu-Setu 2.0 performance and health.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {summaryKpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <div className="text-muted-foreground">{kpi.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpi.value}
                {kpi.unit}
                {kpi.total && (
                  <span className="text-sm text-muted-foreground">
                    {' '}
                    / {kpi.total}
                    {kpi.unit}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Regional Status & Anomalies */}
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Regional Rollout Status</CardTitle>
                    <CardDescription>Live digitization progress across India.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-[400px] relative rounded-lg overflow-hidden bg-muted/30 p-4">
                        <Image src="https://images.unsplash.com/photo-1621293393853-af8a78633b63?q=80&w=1200&auto=format&fit=crop" alt="Map of India with highlighted regions" layout="fill" objectFit="contain" data-ai-hint="India map" />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                <CardTitle>AI Anomaly Alerts</CardTitle>
                <CardDescription>Live feed of critical system events.</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    {monitorData.anomalies.map((anomaly, index) => (
                    <motion.div
                        key={anomaly.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3"
                    >
                        <div
                        className={`h-3 w-3 flex-shrink-0 rounded-full ${
                            anomalyColors[anomaly.severity]
                        }`}
                        />
                        <p className="flex-grow text-sm">{anomaly.description}</p>
                        <Badge variant="outline" className="capitalize">
                        {anomaly.severity}
                        </Badge>
                    </motion.div>
                    ))}
                </div>
                </CardContent>
            </Card>
        </div>
        
        {/* Metrics Column */}
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Tech & Ops Health</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-around">
                     <div className="text-center">
                        <ResponsiveContainer width={120} height={120}>
                            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: 'Uptime', value: 99.2, fill: 'hsl(var(--chart-2))' }]} startAngle={90} endAngle={-270}>
                                <RadialBar dataKey="value" cornerRadius={10} />
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-foreground">{99.2}%</text>
                                <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-muted-foreground">API Uptime</text>
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Citizen-Centric Service Metrics</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Avg. Title Transfer</p>
                    <p className="text-2xl font-bold">7 days</p>
                    <MiniSparkline />
                </div>
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Citizen NPS</p>
                    <DonutChart value={72} label="NPS" color="hsl(var(--chart-1))" />
                </div>
                 <div className="col-span-2 space-y-2">
                    <p className="text-sm text-muted-foreground">Grievances Filed vs Resolved</p>
                    <ResponsiveContainer width="100%" height={100}>
                      <RechartsBarChart data={grievanceData} layout="vertical" barSize={20}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} dx={-10} />
                        <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.5)' }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                <CardTitle>Government-Centric Ops Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="space-y-1">
                    <p className="text-sm font-medium">Budget Utilization (64%)</p>
                    <Progress value={64} />
                </div>
                <BulletChart
                    value={1.2}
                    target={2}
                    label="Fee Income vs. Target"
                />
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                <CardTitle>PPP Partner Performance</CardTitle>
                <CardDescription>
                    Live operational metrics for Service Providers.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Partner</TableHead>
                        <TableHead>Uptime</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {monitorData.pppOversight.map((item, index) => (
                        <TableRow key={index}>
                        <TableCell className="font-medium">{item.metric}</TableCell>
                        <TableCell
                            className={`${statusColors[item.status]}`}
                        >
                            {item.actual}
                        </TableCell>
                        <TableCell className="text-right">{item.target}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

