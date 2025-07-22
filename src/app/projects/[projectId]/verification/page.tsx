import { notFound } from 'next/navigation';
import { projects, bhuSetuData } from '@/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, AlertCircle, FileText, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { PieChart, Pie, Cell } from "recharts"

export default function VerificationPage({ params }: { params: { projectId:string } }) {
  const project = projects.find((p) => p.id === params.projectId);
  if (!project || project.id !== 'bhu-setu-2') {
    notFound();
  }

  const { citizenUploads, flaggedMismatches, auditLogs, citizenWall } = bhuSetuData.verification;
  
  const chartData = [
    { name: "Verified", value: citizenUploads - flaggedMismatches, fill: "var(--color-primary)" },
    { name: "Flagged", value: flaggedMismatches, fill: "var(--color-destructive)" },
  ]
  const chartConfig = {
    value: { label: "Uploads" },
    Verified: { label: "Verified", color: "hsl(var(--primary))" },
    Flagged: { label: "Flagged", color: "hsl(var(--destructive))" },
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline tracking-tight flex items-center">
          <CheckCircle className="mr-4 h-10 w-10" /> Verification: QA & Audit
        </h1>
        <p className="text-lg text-muted-foreground">Ensuring data quality through citizen feedback and formal audits.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Citizen Wall</CardTitle>
                    <CardDescription>Photos uploaded by citizens for ground-truthing.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {citizenWall.map(item => (
                        <div key={item.id} className="group relative aspect-w-3 aspect-h-4 overflow-hidden rounded-lg">
                            <Image src={item.imageUrl} alt={`Citizen upload from ${item.location}`} fill className="object-cover transition-transform duration-300 group-hover:scale-110" data-ai-hint="citizen photo"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-2 left-2 text-white text-xs font-bold">{item.location}</div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
             <Card>
                <CardHeader>
                  <CardTitle>QC Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
                      <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                           {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                    <div className="text-center mt-4">
                        <p className="text-3xl font-bold font-headline">{citizenUploads}</p>
                        <p className="text-muted-foreground">Total Citizen Uploads</p>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Audit Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {auditLogs.map(log => (
                            <li key={log.id} className="flex items-start space-x-3">
                                <FileText className="h-5 w-5 mt-1 flex-shrink-0 text-primary"/>
                                <div>
                                    <p className="font-medium text-sm">{log.description}</p>
                                    <Badge variant={log.status === 'closed' ? 'secondary' : 'destructive'} className="mt-1">
                                        {log.status === 'closed' ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                                        {log.status}
                                    </Badge>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
