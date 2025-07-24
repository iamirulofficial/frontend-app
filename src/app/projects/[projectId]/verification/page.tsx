
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { KpiCard } from '@/components/kpi-card';
import { bhuSetuData } from '@/data';
import {
  Map, CheckCircle, XCircle, AlertTriangle, Clock, Download, FileText,
  Camera, Shield, Wifi, MapPin, Calendar, Users, Eye, Hash,
  Smartphone, HardHat, Zap, Database, Globe, Activity,
  CheckCircle2, AlertCircle, Info, TrendingUp
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const verificationData = bhuSetuData.verification;

// Mock data for enhanced verification features
const sensorData = [
  { id: 'AQ001', type: 'Air Quality', location: 'Sector 47, Gurugram', value: '42 AQI', status: 'good', lastUpdate: '2 min ago' },
  { id: 'RR002', type: 'Road Roughness', location: 'NH-8 Junction', value: '2.1 IRI', status: 'fair', lastUpdate: '5 min ago' },
  { id: 'AQ003', type: 'Air Quality', location: 'DLF Phase 3', value: '68 AQI', status: 'moderate', lastUpdate: '1 min ago' },
  { id: 'RR004', type: 'Road Roughness', location: 'Cyber Hub', value: '1.8 IRI', status: 'good', lastUpdate: '3 min ago' },
];

const blockchainAudits = [
  { hash: '0x7f9c...8a2d', timestamp: '2024-01-15 14:32:15', type: 'IE Report Upload', verifier: 'Engineer_47', status: 'verified' },
  { hash: '0x2b4e...9f1c', timestamp: '2024-01-15 14:28:42', type: 'Citizen Photo Submission', verifier: 'Citizen_892', status: 'pending' },
  { hash: '0x5d8a...3e7b', timestamp: '2024-01-15 14:25:18', type: 'Sensor Data Batch', verifier: 'IoT_Gateway_12', status: 'verified' },
  { hash: '0x9c1f...6d4e', timestamp: '2024-01-15 14:22:01', type: 'Lab Test Results', verifier: 'Lab_Central', status: 'verified' },
];

const iePortalData = [
  { id: 'IE001', engineer: 'Dr. Rajesh Kumar', project: 'Sector 47 Infrastructure', snapshots: 12, labTests: 3, status: 'completed', timestamp: '14:30 Today' },
  { id: 'IE002', engineer: 'Eng. Priya Sharma', project: 'DLF Road Network', snapshots: 8, labTests: 2, status: 'in-progress', timestamp: '13:45 Today' },
  { id: 'IE003', engineer: 'Eng. Amit Singh', project: 'Cyber Hub Utilities', snapshots: 15, labTests: 5, status: 'review', timestamp: '12:20 Today' },
];

const statusColors = {
  open: 'text-amber-500',
  closed: 'text-emerald-500',
  good: 'text-emerald-500',
  fair: 'text-amber-500',
  moderate: 'text-orange-500',
  poor: 'text-red-500',
  verified: 'text-emerald-500',
  pending: 'text-amber-500',
  completed: 'text-emerald-500',
  'in-progress': 'text-blue-500',
  review: 'text-purple-500',
};

export default function VerificationPage() {
  const [activeCitizenWall, setActiveCitizenWall] = useState(verificationData.citizenWall);
  const [activeTab, setActiveTab] = useState('citizen-app');
  const [liveNotifications, setLiveNotifications] = useState<any[]>([]);

  // Live notifications for verification events
  useEffect(() => {
    const generateNotification = () => {
      const notifications = [
        '🔍 New citizen photo uploaded',
        '⚡ Sensor data verified',
        '🛠️ IE report submitted',
        '📊 Lab test results received',
        '✅ Blockchain hash confirmed'
      ];

      const notification = {
        id: Date.now(),
        message: notifications[Math.floor(Math.random() * notifications.length)],
        timestamp: new Date().toLocaleTimeString(),
        type: Math.random() > 0.7 ? 'success' : 'info'
      };

      toast({
        title: notification.message,
        description: `Verification event at ${notification.timestamp}`,
        variant: notification.type === 'success' ? 'default' : 'default',
      });

      setLiveNotifications(prev => [notification, ...prev.slice(0, 4)]);
    };

    const interval = setInterval(generateNotification, Math.random() * 3000 + 4000);
    return () => clearInterval(interval);
  }, []);

  const handleReview = (id: string, action: 'accept' | 'reject') => {
    setActiveCitizenWall(prev => prev.filter(item => item.id !== id));
    toast({
      title: action === 'accept' ? '✅ Verification Approved' : '❌ Verification Rejected',
      description: `Photo submission ${id} has been ${action}ed`,
    });
  };

  const getQcBadge = (isMismatch: boolean) => {
    return isMismatch
      ? { variant: 'destructive' as const, text: '⚠️ 60% Match', description: 'AI detected a potential mismatch with existing records.' }
      : { variant: 'default' as const, text: '✅ 95% Match', description: 'AI confirms high-confidence match.' };
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">🛡️ Verification & Audit Hub</h1>
          <p className="text-muted-foreground mt-1 text-lg">Citizen & Third-Party Proof-of-Work Dashboard</p>
          <p className="text-sm text-muted-foreground mt-2">
            Crowdsourced QC • Transparent Audit Trail • Objective Service-Level Verification
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live monitoring active</span>
        </div>
      </div>

      {/* Enhanced KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Parcels Verified"
          value={8.3}
          suffix=" Cr"
          icon={<Map />}
          description="Live count via citizen & IE verification"
          colorClass="text-emerald-500"
        />
        <KpiCard
          title="AI-QC Confidence"
          value={94.2}
          suffix="%"
          icon={<CheckCircle />}
          description="Average CV model match score"
          colorClass="text-blue-500"
        />
        <KpiCard
          title="Active Sensors"
          value={847}
          suffix=""
          icon={<Activity />}
          description="LoRaWAN nodes reporting live data"
          colorClass="text-purple-500"
        />
        <KpiCard
          title="Blockchain Entries"
          value={125}
          suffix="K"
          icon={<Hash />}
          description="Immutable audit records stored"
          colorClass="text-amber-500"
        />
      </div>

      {/* Live Notifications Feed */}
      {liveNotifications.length > 0 && (
        <Card className="border-l-4 border-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-lg">Live Verification Feed</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {liveNotifications.slice(0, 3).map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-sm"
                  >
                    <span>{notification.message}</span>
                    <span className="text-muted-foreground text-xs">{notification.timestamp}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Verification Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="citizen-app" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Citizen Service App
          </TabsTrigger>
          <TabsTrigger value="ie-portal" className="flex items-center gap-2">
            <HardHat className="h-4 w-4" />
            IE Portal
          </TabsTrigger>
          <TabsTrigger value="sensor-kits" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Sensor Kits
          </TabsTrigger>
          <TabsTrigger value="blockchain-audit" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Blockchain Audit
          </TabsTrigger>
        </TabsList>

        {/* Citizen Service App Tab */}
        <TabsContent value="citizen-app" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Camera className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Flutter Mobile App - Photo/Video Review</CardTitle>
                    <CardDescription>
                      Aadhaar-based login • Geotag + timestamp • AI-powered CV comparison
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {activeCitizenWall.map((item, index) => {
                        const qc = getQcBadge(item.isMismatch);
                        return (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card className="p-4 hover:shadow-lg transition-all border-l-4 border-l-blue-500">
                              <div className="flex gap-4">
                                <div className="relative w-32 h-24 flex-shrink-0">
                                  <Image
                                    src={item.imageUrl}
                                    alt={`Verification from ${item.location}`}
                                    fill
                                    className="object-cover rounded-md"
                                  />
                                  <div className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded">
                                    📍 GPS
                                  </div>
                                </div>
                                <div className="flex-grow space-y-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-mono text-xs text-muted-foreground">
                                        ID: {item.id} • 📍 {item.location}
                                      </p>
                                      <p className="text-sm font-medium">
                                        Submitted via Citizen App
                                      </p>
                                    </div>
                                    <Badge variant={qc.variant}>{qc.text}</Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{qc.description}</p>
                                  <div className="flex justify-between items-center pt-2">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        Geotagged
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Timestamped
                                      </span>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="destructive" onClick={() => handleReview(item.id, 'reject')}>
                                        <XCircle className="mr-1 h-3 w-3"/>Reject
                                      </Button>
                                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleReview(item.id, 'accept')}>
                                        <CheckCircle className="mr-1 h-3 w-3"/>Approve
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    {activeCitizenWall.length === 0 && (
                      <div className="text-center py-16 text-muted-foreground">
                        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                        <p className="mt-4 font-semibold">All clear! No pending citizen verifications.</p>
                        <p className="text-sm">Citizens are actively contributing to quality control.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">App Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily Active Users</span>
                      <span className="font-mono">12,847</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Photo Submissions</span>
                      <span className="font-mono">3,421</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>AI Match Rate</span>
                      <span className="font-mono">94.2%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Problem Detection</CardTitle>
                  <CardDescription>AI-powered quality control insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span>Ghost assets detected: 23</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Quality deviations: 7</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Info className="h-4 w-4 text-blue-500" />
                      <span>Crowdsourced validations: 1,847</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Independent Engineer Portal Tab */}
        <TabsContent value="ie-portal" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <HardHat className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle>Independent Engineer Portal</CardTitle>
                  <CardDescription>
                    Digital-twin snapshots • Lab test results • Blockchain immutability
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {iePortalData.map((ie) => (
                  <Card key={ie.id} className="p-4 border-l-4 border-l-orange-500">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">{ie.id}</Badge>
                          <span className="font-medium">{ie.engineer}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{ie.project}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Camera className="h-3 w-3" />
                            {ie.snapshots} snapshots
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {ie.labTests} lab tests
                          </span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge variant={ie.status === 'completed' ? 'default' : ie.status === 'in-progress' ? 'secondary' : 'outline'}>
                          {ie.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{ie.timestamp}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sensor Kits Tab */}
        <TabsContent value="sensor-kits" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Wifi className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>LoRaWAN Sensor Network</CardTitle>
                    <CardDescription>
                      Air quality nodes • Road roughness accelerometers • IPFS storage
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sensorData.map((sensor) => (
                    <Card key={sensor.id} className="p-3 border-l-4 border-l-purple-500">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs">{sensor.id}</Badge>
                            <span className="text-sm font-medium">{sensor.type}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{sensor.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{sensor.value}</p>
                          <div className="flex items-center gap-1">
                            <div className={cn("h-2 w-2 rounded-full", {
                              'bg-emerald-500': sensor.status === 'good',
                              'bg-amber-500': sensor.status === 'fair',
                              'bg-orange-500': sensor.status === 'moderate',
                              'bg-red-500': sensor.status === 'poor',
                            })} />
                            <span className="text-xs text-muted-foreground">{sensor.lastUpdate}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Outcome-Based Payments</CardTitle>
                <CardDescription>Revenue tied to real service impact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Air Quality Improvement</p>
                      <p className="text-sm text-muted-foreground">Target: &lt;50 AQI</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">₹2.4L</p>
                      <p className="text-xs text-muted-foreground">Earned this month</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Road Quality Index</p>
                      <p className="text-sm text-muted-foreground">Target: &lt;2.0 IRI</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">₹1.8L</p>
                      <p className="text-xs text-muted-foreground">Earned this month</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium">Total Outcome Revenue</span>
                  <span className="text-xl font-bold text-emerald-600">₹4.2L</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Blockchain Audit Tab */}
        <TabsContent value="blockchain-audit" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Database className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle>Immutable Audit Trail</CardTitle>
                  <CardDescription>
                    Blockchain-secured verification records • Transparent dispute resolution
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blockchainAudits.map((audit) => (
                  <Card key={audit.hash} className="p-4 border-l-4 border-l-emerald-500">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">{audit.hash}</Badge>
                          <Badge variant={audit.status === 'verified' ? 'default' : 'secondary'}>
                            {audit.status}
                          </Badge>
                        </div>
                        <p className="font-medium">{audit.type}</p>
                        <p className="text-sm text-muted-foreground">Submitted by: {audit.verifier}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{audit.timestamp}</p>
                        <Button variant="ghost" size="sm" className="mt-2">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export Complete Blockchain Audit Trail
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Legacy Audit Trail */}
          <Card>
            <CardHeader>
              <CardTitle>Traditional Audit Logs</CardTitle>
              <CardDescription>Legacy verification events and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80 pr-4">
                <div className="space-y-6">
                  {verificationData.auditLogs.map(log => (
                    <div key={log.id} className="flex items-start gap-3 relative">
                      <div className="absolute left-[10px] top-[10px] h-full w-px bg-border" />
                      <div className="flex-shrink-0 mt-1 z-10 p-1.5 bg-background rounded-full border">
                        <FileText className={cn("h-4 w-4", statusColors[log.status as keyof typeof statusColors])} />
                      </div>
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">{log.id}</p>
                        <p className="text-sm">{log.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
