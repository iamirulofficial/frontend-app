
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { KpiCard } from '@/components/kpi-card';
import { bhuSetuData } from '@/data';
import { Map, CheckCircle, XCircle, AlertTriangle, Clock, Download, FileText } from 'lucide-react';
import Image from 'next/image';

const verificationData = bhuSetuData.verification;

const statusColors = {
  open: 'text-amber-500',
  closed: 'text-emerald-500',
};

export default function VerificationPage() {
  const [activeCitizenWall, setActiveCitizenWall] = useState(verificationData.citizenWall);
  
  const handleReview = (id: string, action: 'accept' | 'reject') => {
    // In a real app, this would trigger a backend mutation.
    // Here we just filter the item out of the list.
    setActiveCitizenWall(prev => prev.filter(item => item.id !== id));
  };
  
  const getQcBadge = (isMismatch: boolean) => {
    return isMismatch 
      ? { variant: 'destructive', text: '⚠️ 60% Match', description: 'AI detected a potential mismatch with existing records.' }
      : { variant: 'default', text: '✅ 95% Match', description: 'AI confirms high-confidence match.' };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline tracking-tight">🛡️ Verification & Audit</h1>
        <p className="text-muted-foreground mt-1">Citizen & Third-Party Proof-of-Work Hub</p>
      </div>

      {/* Section 1: Verification Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Parcels Verified" value={8.3} suffix=" Cr" icon={<Map />} description="Live count of fully verified parcels." colorClass="text-emerald-500" />
        <KpiCard title="Avg. QC Score" value={89} suffix=" %" icon={<CheckCircle />} description="Average match score from AI-QC." colorClass="text-blue-500" />
        <KpiCard title="Pending Verifications" value={12000} suffix="" icon={<Clock />} description="Citizen uploads awaiting review." colorClass="text-amber-500" />
        <KpiCard title="Disputes Raised" value={342} suffix="" icon={<AlertTriangle />} description="Mismatches flagged by citizens or IEs." colorClass="text-destructive" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section 4 & 5: Citizen & IE Review */}
          <div className="lg:col-span-2 space-y-8">
             <Card className="h-[600px] flex flex-col">
                <CardHeader>
                    <CardTitle>4. Citizen Service App Review</CardTitle>
                    <CardDescription>Review and verify photo/video uploads from citizens on the ground.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-4">
                        {activeCitizenWall.map((item, index) => {
                            const qc = getQcBadge(item.isMismatch);
                            return (
                                <motion.div 
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
                                    transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 30 }}
                                >
                                    <Card className="flex flex-col sm:flex-row items-start gap-4 p-4 hover:shadow-lg transition-shadow">
                                        <div className="relative w-full sm:w-40 h-32 flex-shrink-0">
                                            <Image src={item.imageUrl} alt={`Citizen upload from ${item.location}`} fill className="object-cover rounded-md" data-ai-hint="citizen proof"/>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <p className="text-xs text-muted-foreground font-mono">ID: {item.id} • {item.location}</p>
                                                 <Badge variant={qc.variant}>{qc.text}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">{qc.description}</p>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button size="sm" variant="destructive" onClick={() => handleReview(item.id, 'reject')}><XCircle className="mr-2"/>Reject</Button>
                                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleReview(item.id, 'accept')}><CheckCircle className="mr-2"/>Accept</Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            )
                        })}
                        {activeCitizenWall.length === 0 && (
                             <div className="text-center py-16 text-muted-foreground">
                                <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
                                <p className="mt-4 font-semibold">All clear! No pending verifications.</p>
                            </div>
                        )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
          </div>

          {/* Section 2 & 3: Audit Trail */}
          <div className="space-y-8">
            <Card className="h-[600px] flex flex-col">
                <CardHeader>
                    <CardTitle>2. Audit Trail Viewer</CardTitle>
                    <CardDescription>Immutable log of all verification events.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                       <div className="space-y-6">
                            {verificationData.auditLogs.map(log => (
                                <div key={log.id} className="flex items-start gap-3 relative">
                                    <div className="absolute left-[10px] top-[10px] h-full w-px bg-border" />
                                    <div className="flex-shrink-0 mt-1 z-10 p-1.5 bg-background rounded-full border">
                                        <FileText className={`h-4 w-4 ${statusColors[log.status]}`} />
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
                <CardContent className="border-t pt-4">
                    <Button variant="outline" className="w-full">
                        <Download className="mr-2" />
                        Export Full Audit Log
                    </Button>
                </CardContent>
            </Card>
          </div>
      </div>
    </div>
  );
}
