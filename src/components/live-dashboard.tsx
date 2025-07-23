
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KpiCard } from '@/components/kpi-card';
import { Progress } from '@/components/ui/progress';
import { Map, AlertTriangle, Cpu, Landmark, FileText, Users, Code, Rocket, Shield } from 'lucide-react';
import { bhuSetuData } from '@/data/bhu-setu-data';
import { cn } from '@/lib/utils';

const workstreams = [
    { name: 'Drone Ops', progress: 85, icon: <Rocket className="h-5 w-5 text-sky-500"/>, team: 'Drone Ops' },
    { name: 'Data Science', progress: 60, icon: <Shield className="h-5 w-5 text-amber-500"/>, team: 'Data Sci' },
    { name: 'DevOps', progress: 75, icon: <Code className="h-5 w-5 text-emerald-500"/>, team: 'DevOps' },
    { name: 'Legal', progress: 40, icon: <Users className="h-5 w-5 text-rose-500"/>, team: 'Legal' },
]

const anomalySeverityClasses = {
    high: 'border-l-4 border-red-500 bg-red-500/10',
    medium: 'border-l-4 border-amber-500 bg-amber-500/10',
    low: 'border-l-4 border-blue-500 bg-blue-500/10',
}

export function LiveDashboard() {
  const [liveData, setLiveData] = useState(bhuSetuData.monitor);

  useEffect(() => {
    const interval = setInterval(() => {
        setLiveData(prevData => ({
            ...prevData,
            iotPacketsPerMin: Math.max(100, prevData.iotPacketsPerMin + Math.floor(Math.random() * 200) - 100),
            revenueToday: prevData.revenueToday + Math.random() * 0.05,
            apiCalls: prevData.apiCalls + Math.floor(Math.random() * 50),
        }))
    }, 2000);
    return () => clearInterval(interval);
  }, []);
    
  return (
    <div className="container mx-auto py-8 px-4">
       <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline tracking-tight">Live Project Dashboard</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Real-time operational overview for Bhu-Setu 2.0.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KpiCard title="Parcels Digitized Today" value={4320} icon={<FileText/>}/>
            <KpiCard title="API Calls / Minute" value={liveData.apiCalls} icon={<Cpu />}/>
            <KpiCard title="Anomalies Detected" value={liveData.anomalies.length} icon={<AlertTriangle/>} colorClass="text-destructive"/>
            <KpiCard title="Revenue Today" value={liveData.revenueToday} prefix="₹" suffix=" Lakh" icon={<Landmark/>} colorClass="text-accent"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>District-wise Progress</CardTitle>
                    <CardDescription>Live progress of digitization across active districts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
                        <Map className="w-32 h-32 text-muted-foreground"/>
                        <p className="text-muted-foreground ml-4">Live Map Coming Soon</p>
                    </div>
                </CardContent>
            </Card>
            
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Workstream Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {workstreams.map(ws => (
                            <div key={ws.name}>
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-2">
                                        {ws.icon}
                                        <span className="text-sm font-medium">{ws.name}</span>
                                    </div>
                                    <span className="text-sm font-bold">{ws.progress}%</span>
                                </div>
                                <Progress value={ws.progress} />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Live Anomaly Feed</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 h-48 overflow-y-auto">
                        {liveData.anomalies.map((anomaly, index) => (
                            <motion.div 
                                key={anomaly.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={cn("p-2 rounded-md text-xs", anomalySeverityClasses[anomaly.severity])}
                            >
                                <p><span className="font-semibold capitalize">{anomaly.severity}</span>: {anomaly.description}</p>
                            </motion.div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>

    </div>
  );
}
