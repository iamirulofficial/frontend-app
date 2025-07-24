
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { KpiCard } from '@/components/kpi-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
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
  Activity,
  Globe,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  Shield,
  Database,
  Wifi,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Eye,
  UserCheck,
  Building,
  Gauge,
  Bell,
  Calendar,
  Timer,
  DollarSign,
  Home,
  Smartphone,
  MapPin,
  Hash,
  Signal,
  Cpu,
  HardDrive,
  Network,
  CloudUpload
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
import { TwinPreviewMap, type Parcel } from '@/components/twin-preview-map';
import { cn } from '@/lib/utils';

const monitorData = bhuSetuData.monitor;

// Enhanced Live Data Streams
const liveStreamingData = {
  mqttMessages: 1247,
  kafkaPartitions: 24,
  influxDBWrites: 3421,
  lastUpdate: new Date().toLocaleTimeString()
};

const aiAnomalyAlerts = [
  { id: 'AN001', type: 'Mutation Spike', description: '47 mutations in same parcel within 24h - P-MUM-4521', severity: 'high', timestamp: '14:32:15', region: 'Mumbai' },
  { id: 'AN002', type: 'Duplicate Submissions', description: 'Same Aadhaar submitting multiple properties', severity: 'medium', timestamp: '14:28:42', region: 'Delhi' },
  { id: 'AN003', type: 'GPS Drift', description: 'Geolocation variance exceeds threshold', severity: 'low', timestamp: '14:25:18', region: 'Bangalore' },
  { id: 'AN004', type: 'Payment Anomaly', description: 'Unusual fee pattern detected', severity: 'high', timestamp: '14:22:01', region: 'Hyderabad' },
];

const citizenMetrics = {
  dailyActiveUsers: 24847,
  avgTimePerParcel: 12.3, // minutes
  completionRate: 94.2,
  npsScore: 72,
  mobileAppSessions: 18420,
  webPortalSessions: 6427,
  supportTickets: { open: 234, resolved: 1847, pending: 89 },
  satisfactionScore: 4.3
};

const govMetrics = {
  revenueToday: 1.24, // Cr
  revenueTarget: 2.0, // Cr
  budgetUtilization: 64.2,
  disputeResolutionTime: 7.2, // days
  complianceScore: 96.8,
  auditReadiness: 91.5,
  policyUpdates: 3,
  regulatoryApprovals: { pending: 12, approved: 847, rejected: 23 }
};

const techMetrics = {
  apiUptime: 99.7,
  avgResponseTime: 145, // ms
  throughput: 3247, // req/sec
  errorRate: 0.003,
  databaseConnections: 847,
  cacheHitRate: 94.8,
  storageUsed: 72.3, // %
  networkLatency: 23 // ms
};

const pppPartnerMetrics = [
  { name: 'TechMahindra', uptime: 99.2, revenue: '₹2.4Cr', sla: 98.5, disputes: 3 },
  { name: 'Infosys Digital', uptime: 99.8, revenue: '₹1.8Cr', sla: 99.1, disputes: 1 },
  { name: 'L&T Infotech', uptime: 98.9, revenue: '₹3.1Cr', sla: 97.8, disputes: 5 },
  { name: 'HCL Technologies', uptime: 99.5, revenue: '₹2.7Cr', sla: 98.9, disputes: 2 },
];

const realTimeAlerts = [
  { id: 'RT001', message: 'High traffic detected in Mumbai region', type: 'info', timestamp: new Date().toLocaleTimeString() },
  { id: 'RT002', message: 'Server latency spike in Bangalore datacenter', type: 'warning', timestamp: new Date().toLocaleTimeString() },
  { id: 'RT003', message: 'Payment gateway integration successful', type: 'success', timestamp: new Date().toLocaleTimeString() },
];

const operationalMetrics = {
  totalTransactions: 847329,
  successfulTransactions: 843241,
  failedTransactions: 4088,
  avgProcessingTime: 2.3, // seconds
  peakHours: '10:00-12:00, 14:00-16:00',
  systemLoad: 67.4,
  activeSessions: 12847
};

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

const parcels: Parcel[] = [
    // North
    { type: 'Feature', properties: { progress: 0.84, id: 'P-JAM' }, geometry: { type: 'Polygon', coordinates: [ [[77.60, 34.15], [77.61, 34.15], [77.61, 34.16], [77.60, 34.16], [77.60, 34.15]] ] } },
    { type: 'Feature', properties: { progress: 0.62, id: 'P-DEL' }, geometry: { type: 'Polygon', coordinates: [ [[77.23, 28.61], [77.24, 28.61], [77.24, 28.62], [77.23, 28.62], [77.23, 28.61]] ] } },
    // West
    { type: 'Feature', properties: { progress: 0.95, id: 'P-MUM' }, geometry: { type: 'Polygon', coordinates: [ [[72.87, 19.07], [72.88, 19.07], [72.88, 19.08], [72.87, 19.08], [72.87, 19.07]] ] } },
    { type: 'Feature', properties: { progress: 0.45, id: 'P-AHD', isBPL: true }, geometry: { type: 'Polygon', coordinates: [ [[72.57, 23.02], [72.58, 23.02], [72.58, 23.03], [72.57, 23.03], [72.57, 23.02]] ] } },
    // South
    { type: 'Feature', properties: { progress: 0.94, id: 'P-BNG' }, geometry: { type: 'Polygon', coordinates: [ [[77.60,12.92], [77.61,12.92], [77.61,12.93], [77.60,12.93], [77.60,12.92]] ] } },
    { type: 'Feature', properties: { progress: 0.52, id: 'P-HYD', isBPL: true }, geometry: { type: 'Polygon', coordinates: [ [[78.48,17.38], [78.49,17.38], [78.49,17.39], [78.48,17.39], [78.48,17.38]] ] } },
    // East
    { type: 'Feature', properties: { progress: 0.35, id: 'P-KOL' }, geometry: { type: 'Polygon', coordinates: [ [[88.36, 22.57], [88.37, 22.57], [88.37, 22.58], [88.36, 22.58], [88.36, 22.57]] ] } },
    { type: 'Feature', properties: { progress: 0.78, id: 'P-BHU' }, geometry: { type: 'Polygon', coordinates: [ [[85.31, 25.61], [85.32, 25.61], [85.32, 25.62], [85.31, 25.62], [85.31, 25.61]] ] } },
     // Central
    { type: 'Feature', properties: { progress: 0.68, id: 'P-BHO', isBPL: true }, geometry: { type: 'Polygon', coordinates: [ [[77.41, 23.25], [77.42, 23.25], [77.42, 23.26], [77.41, 23.26], [77.41, 23.25]] ] } },
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
  const [liveAlerts, setLiveAlerts] = useState(realTimeAlerts);
  const [streamingMetrics, setStreamingMetrics] = useState(liveStreamingData);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate live data streaming
  useEffect(() => {
    const interval = setInterval(() => {
      // Update streaming metrics
      setStreamingMetrics(prev => ({
        ...prev,
        mqttMessages: prev.mqttMessages + Math.floor(Math.random() * 50) + 10,
        kafkaPartitions: 24,
        influxDBWrites: prev.influxDBWrites + Math.floor(Math.random() * 100) + 20,
        lastUpdate: new Date().toLocaleTimeString()
      }));

      // Generate random alerts
      if (Math.random() > 0.7) {
        const alertTypes = ['New user registration', 'Transaction completed', 'Anomaly detected', 'System optimization'];
        const newAlert = {
          id: `RT${Date.now()}`,
          message: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          type: Math.random() > 0.7 ? 'warning' : 'info',
          timestamp: new Date().toLocaleTimeString()
        };

        setLiveAlerts(prev => [newAlert, ...prev.slice(0, 4)]);

        // Show toast notification
        toast({
          title: 'Live Alert',
          description: newAlert.message,
          variant: newAlert.type === 'warning' ? 'destructive' : 'default',
        });
      }

      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">
            📈 Live Project Monitor: Bhu-Setu 2.0
          </h1>
          <p className="mt-1 text-muted-foreground text-lg">
            Real-time executive dashboard with streaming analytics and AI-powered insights
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            MQTT Edge → Kafka → InfluxDB • AI Anomaly Engine • Unified KPI Dashboard
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live streaming active</span>
          </div>
          <span className="text-xs text-muted-foreground">Last update: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Live Streaming Fabric Status */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Streaming Data Fabric</CardTitle>
                <CardDescription>Real-time audit trail pipeline status</CardDescription>
              </div>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-800">
              ✅ Operational
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{streamingMetrics.mqttMessages.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">MQTT Messages</p>
              <p className="text-xs text-green-600">+{Math.floor(Math.random() * 50) + 10}/sec</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{streamingMetrics.kafkaPartitions}</p>
              <p className="text-sm text-muted-foreground">Kafka Partitions</p>
              <p className="text-xs text-green-600">All healthy</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{streamingMetrics.influxDBWrites.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">InfluxDB Writes</p>
              <p className="text-xs text-green-600">+{Math.floor(Math.random() * 100) + 20}/sec</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-emerald-600">99.7%</p>
              <p className="text-sm text-muted-foreground">Pipeline Uptime</p>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Alerts Feed */}
      {liveAlerts.length > 0 && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-lg">Live System Events</CardTitle>
              <Badge variant="secondary">{liveAlerts.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {liveAlerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-lg text-sm",
                        alert.type === 'warning' ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'
                      )}
                    >
                      <span>{alert.message}</span>
                      <span className="text-muted-foreground text-xs">{alert.timestamp}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Enhanced KPI Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          title="Parcels Digitized"
          value={14.3}
          suffix=" Cr"
          icon={<Map />}
          description="Live digitization count"
          colorClass="text-emerald-500"
        />
        <KpiCard
          title="Active Users"
          value={citizenMetrics.dailyActiveUsers}
          suffix=""
          icon={<Users />}
          description="Current online users"
          colorClass="text-blue-500"
        />
        <KpiCard
          title="API Throughput"
          value={techMetrics.throughput}
          suffix=" req/s"
          icon={<Activity />}
          description="Real-time API performance"
          colorClass="text-purple-500"
        />
        <KpiCard
          title="System Uptime"
          value={techMetrics.apiUptime}
          suffix="%"
          icon={<Server />}
          description="Service availability"
          colorClass="text-green-500"
        />
        <KpiCard
          title="Revenue Today"
          value={govMetrics.revenueToday}
          suffix=" Cr"
          icon={<DollarSign />}
          description="Fee income vs target"
          colorClass="text-amber-500"
        />
        <KpiCard
          title="Anomalies"
          value={aiAnomalyAlerts.length}
          suffix=""
          icon={<Shield />}
          description="AI-detected issues"
          colorClass="text-red-500"
        />
      </div>

      {/* Comprehensive Monitoring Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="citizen-centric" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Citizen-Centric
          </TabsTrigger>
          <TabsTrigger value="govt-centric" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Govt-Centric
          </TabsTrigger>
          <TabsTrigger value="tech-ops" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            Tech & Ops
          </TabsTrigger>
          <TabsTrigger value="ai-anomaly" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            AI Anomaly
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Progress Map</CardTitle>
                  <CardDescription>Live digitization status across India</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[400px] relative rounded-lg overflow-hidden bg-muted/30">
                    <TwinPreviewMap parcels={parcels} />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">8</p>
                      <p className="text-sm text-muted-foreground">States Active</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">247</p>
                      <p className="text-sm text-muted-foreground">Districts</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">4,521</p>
                      <p className="text-sm text-muted-foreground">Blocks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operational Metrics</CardTitle>
                  <CardDescription>Real-time system performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <p className="text-xl font-bold text-emerald-600">
                        {operationalMetrics.totalTransactions.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Transactions</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xl font-bold text-blue-600">{operationalMetrics.avgProcessingTime}s</p>
                      <p className="text-sm text-muted-foreground">Avg Processing Time</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-xl font-bold text-purple-600">{operationalMetrics.activeSessions.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Active Sessions</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <p className="text-xl font-bold text-amber-600">{operationalMetrics.systemLoad}%</p>
                      <p className="text-sm text-muted-foreground">System Load</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>PPP Partner Performance</CardTitle>
                  <CardDescription>Live partner metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pppPartnerMetrics.map((partner) => (
                      <div key={partner.name} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">{partner.name}</span>
                          <Badge variant={partner.uptime > 99 ? 'default' : 'secondary'}>
                            {partner.uptime}% uptime
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <span>Revenue: {partner.revenue}</span>
                          <span>SLA: {partner.sla}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>API Response Time</span>
                      <span className="font-mono">{techMetrics.avgResponseTime}ms</span>
                    </div>
                    <Progress value={100 - (techMetrics.avgResponseTime / 500 * 100)} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cache Hit Rate</span>
                      <span className="font-mono">{techMetrics.cacheHitRate}%</span>
                    </div>
                    <Progress value={techMetrics.cacheHitRate} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Storage Usage</span>
                      <span className="font-mono">{techMetrics.storageUsed}%</span>
                    </div>
                    <Progress value={techMetrics.storageUsed} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Citizen-Centric Tab */}
        <TabsContent value="citizen-centric" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>User Engagement Metrics</CardTitle>
                    <CardDescription>How citizens interact with Bhu-Setu</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{citizenMetrics.dailyActiveUsers.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Daily Active Users</p>
                    <p className="text-xs text-green-600">+12% vs yesterday</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{citizenMetrics.avgTimePerParcel} min</p>
                    <p className="text-sm text-muted-foreground">Avg Time per Parcel</p>
                    <p className="text-xs text-green-600">-8% improvement</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completion Rate</span>
                    <span className="font-mono text-sm">{citizenMetrics.completionRate}%</span>
                  </div>
                  <Progress value={citizenMetrics.completionRate} className="h-3" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Net Promoter Score</span>
                    <span className="font-mono text-sm">{citizenMetrics.npsScore}/100</span>
                  </div>
                  <Progress value={citizenMetrics.npsScore} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Channel Usage & Support</CardTitle>
                <CardDescription>Platform adoption and citizen assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Mobile App</span>
                    </div>
                    <p className="text-xl font-bold">{citizenMetrics.mobileAppSessions.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Sessions today</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Web Portal</span>
                    </div>
                    <p className="text-xl font-bold">{citizenMetrics.webPortalSessions.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Sessions today</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Support Tickets</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-amber-50 rounded">
                      <p className="font-bold text-amber-600">{citizenMetrics.supportTickets.pending}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded">
                      <p className="font-bold text-blue-600">{citizenMetrics.supportTickets.open}</p>
                      <p className="text-xs text-muted-foreground">Open</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <p className="font-bold text-green-600">{citizenMetrics.supportTickets.resolved}</p>
                      <p className="text-xs text-muted-foreground">Resolved</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">Overall Satisfaction</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{citizenMetrics.satisfactionScore}</span>
                    <span className="text-yellow-500">★★★★☆</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Government-Centric Tab */}
        <TabsContent value="govt-centric" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle>Revenue & Financial Metrics</CardTitle>
                    <CardDescription>Fee income and budget utilization</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-600">₹{govMetrics.revenueToday} Cr</p>
                    <p className="text-sm text-muted-foreground">Revenue Today</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">₹{govMetrics.revenueTarget} Cr</p>
                    <p className="text-sm text-muted-foreground">Target</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Budget Utilization</span>
                    <span className="font-mono text-sm">{govMetrics.budgetUtilization}%</span>
                  </div>
                  <Progress value={govMetrics.budgetUtilization} className="h-3" />
                </div>

                <BulletChart
                  value={govMetrics.revenueToday}
                  target={govMetrics.revenueTarget}
                  label="Revenue vs Target (Cr)"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Governance & Compliance</CardTitle>
                <CardDescription>Regulatory and operational oversight</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xl font-bold text-green-600">{govMetrics.complianceScore}%</p>
                    <p className="text-sm text-muted-foreground">Compliance Score</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xl font-bold text-blue-600">{govMetrics.auditReadiness}%</p>
                    <p className="text-sm text-muted-foreground">Audit Readiness</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Regulatory Approvals</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-amber-50 rounded">
                      <p className="font-bold text-amber-600">{govMetrics.regulatoryApprovals.pending}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <p className="font-bold text-green-600">{govMetrics.regulatoryApprovals.approved}</p>
                      <p className="text-xs text-muted-foreground">Approved</p>
                    </div>
                    <div className="p-2 bg-red-50 rounded">
                      <p className="font-bold text-red-600">{govMetrics.regulatoryApprovals.rejected}</p>
                      <p className="text-xs text-muted-foreground">Rejected</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">Avg Dispute Resolution Time</span>
                  <span className="font-mono text-lg font-bold">{govMetrics.disputeResolutionTime} days</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tech & Ops Tab */}
        <TabsContent value="tech-ops" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Server className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Infrastructure Health</CardTitle>
                    <CardDescription>Real-time system performance metrics</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{techMetrics.apiUptime}%</p>
                    <p className="text-sm text-muted-foreground">API Uptime</p>
                    <div className="flex items-center justify-center mt-1">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                      <span className="text-xs text-green-600">Live</span>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{techMetrics.avgResponseTime}ms</p>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                    <p className="text-xs text-green-600">Within SLA</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cache Hit Rate</span>
                      <span className="font-mono">{techMetrics.cacheHitRate}%</span>
                    </div>
                    <Progress value={techMetrics.cacheHitRate} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Storage Usage</span>
                      <span className="font-mono">{techMetrics.storageUsed}%</span>
                    </div>
                    <Progress value={techMetrics.storageUsed} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Database Connections</span>
                      <span className="font-mono">{techMetrics.databaseConnections}</span>
                    </div>
                    <Progress value={(techMetrics.databaseConnections / 1000) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network & Performance</CardTitle>
                <CardDescription>Network latency and throughput metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-xl font-bold text-purple-600">{techMetrics.throughput.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Requests/sec</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-xl font-bold text-orange-600">{techMetrics.networkLatency}ms</p>
                    <p className="text-sm text-muted-foreground">Network Latency</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Error Rate</span>
                    <span className="font-mono text-sm">{(techMetrics.errorRate * 100).toFixed(3)}%</span>
                  </div>
                  <Progress value={techMetrics.errorRate * 100} className="h-2" />
                </div>

                <div className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Peak Usage Hours</h4>
                  <p className="text-sm text-muted-foreground">{operationalMetrics.peakHours}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Anomaly Tab */}
        <TabsContent value="ai-anomaly" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle>AI-Powered Anomaly Detection</CardTitle>
                  <CardDescription>
                    Auto-encoder flags abnormal patterns • Early fraud warning • Revenue protection
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiAnomalyAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "p-4 rounded-lg border-l-4",
                      alert.severity === 'high' ? 'bg-red-50 border-l-red-500' :
                      alert.severity === 'medium' ? 'bg-amber-50 border-l-amber-500' :
                      'bg-blue-50 border-l-blue-500'
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={alert.severity === 'high' ? 'destructive' :
                                   alert.severity === 'medium' ? 'secondary' : 'default'}
                          >
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{alert.type}</span>
                        </div>
                        <p className="text-sm text-gray-700">{alert.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alert.timestamp}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {alert.region}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Investigate
                        </Button>
                        {alert.severity === 'high' && (
                          <Button variant="destructive" size="sm">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Alert Team
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Prevention Stats</CardTitle>
                <CardDescription>AI model performance in detecting anomalies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xl font-bold text-green-600">247</p>
                    <p className="text-sm text-muted-foreground">Fraud Cases Prevented</p>
                    <p className="text-xs text-green-600">This month</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-xl font-bold text-red-600">₹12.4 Cr</p>
                    <p className="text-sm text-muted-foreground">Revenue Protected</p>
                    <p className="text-xs text-red-600">Estimated loss</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Model Accuracy</span>
                    <span className="font-mono">97.3%</span>
                  </div>
                  <Progress value={97.3} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pattern Analysis</CardTitle>
                <CardDescription>Common anomaly patterns detected</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-sm">Multiple mutations/day</span>
                    <Badge variant="destructive">43%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-sm">GPS location drift</span>
                    <Badge variant="secondary">28%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-sm">Duplicate documents</span>
                    <Badge variant="outline">19%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-sm">Payment irregularities</span>
                    <Badge variant="outline">10%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

