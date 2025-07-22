import { notFound } from 'next/navigation';
import { projects, bhuSetuData } from '@/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, AlertCircle, FileText, Check, X, Bot, FileCheck2, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { Button } from '@/components/ui/button';

export default function VerificationPage({ params }: { params: { projectId:string } }) {
  const project = projects.find((p) => p.id === params.projectId);
  if (!project || project.id !== 'bhu-setu-2') {
    notFound();
  }

  const { citizenUploads, flaggedMismatches, auditLogs, citizenWall, qualityScorecard } = bhuSetuData.verification;
  
  const chartData = [
    { name: "Verified", value: citizenUploads - flaggedMismatches, fill: "hsl(var(--chart-1))" },
    { name: "Flagged Mismatches", value: flaggedMismatches, fill: "hsl(var(--destructive))" },
  ]
  const chartConfig = {
    value: { label: "Uploads" },
    Verified: { label: "Verified", color: "hsl(var(--chart-1))" },
    "Flagged Mismatches": { label: "Flagged Mismatches", color: "hsl(var(--destructive))" },
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline tracking-tight flex items-center">
          <FileCheck2 className="mr-4 h-10 w-10 text-primary" /> Verification: Quality & Audit Hub
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">Ensuring data quality through citizen feedback, formal audits, and AI-driven quality control.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Users className="mr-2"/>Citizen Wall: Ground-Truth Verification</CardTitle>
                    <CardDescription>Photos uploaded by citizens are automatically matched to the digital twin to flag discrepancies.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {citizenWall.map(item => (
                        <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg">
                            <Image src={item.imageUrl} alt={`Citizen upload from ${item.location}`} fill className="object-cover transition-transform duration-300 group-hover:scale-110" data-ai-hint="citizen land survey photo"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-2 left-2 text-white">
                                <p className="text-xs font-bold">{item.location}</p>
                                {item.isMismatch && <Badge variant="destructive" className="mt-1 text-xs">Mismatch Flagged</Badge>}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Bot className="mr-2"/>ISO 9001 Audit Bot</CardTitle>
                    <CardDescription>An LLM agent continuously checks process logs against SOPs and auto-drafts Corrective Action Reports (CARs).</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {auditLogs.map(log => (
                            <li key={log.id} className="flex items-start space-x-4 p-3 rounded-lg bg-background hover:bg-accent/10">
                                <FileText className="h-5 w-5 mt-1 flex-shrink-0 text-primary"/>
                                <div>
                                    <p className="font-medium text-sm">{log.description}</p>
                                    <p className="text-xs text-muted-foreground">Status: {' '}
                                      <Badge variant={log.status === 'closed' ? 'secondary' : 'destructive'} className="capitalize">
                                        {log.status === 'closed' ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                                        {log.status}
                                    </Badge>
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
             <Card>
                <CardHeader>
                  <CardTitle>Citizen Upload QC Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px]">
                      <ResponsiveContainer>
                        <PieChart>
                          <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={5} paddingAngle={5}>
                             {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                           <Legend content={<ChartTooltipContent nameKey="name" hideIndicator />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="text-center mt-4">
                        <p className="text-3xl font-bold font-headline">{citizenUploads}</p>
                        <p className="text-muted-foreground">Total Citizen Uploads</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Parcel Quality Scorecard</CardTitle>
                    <CardDescription>AI flags parcels with quality scores below 80% for automated resurvey tasks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center p-4 bg-primary/10 rounded-lg">
                        <div className="text-center">
                            <p className="text-5xl font-bold text-primary font-headline">{qualityScorecard.averageScore}</p>
                            <p className="text-muted-foreground">Average Parcel QC Score</p>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="font-bold">{qualityScorecard.parcelsForResurvey}</p>
                        <p className="text-sm text-muted-foreground">Parcels Flagged for Resurvey</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full"><Search className="mr-2"/>View Flagged Parcels</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}