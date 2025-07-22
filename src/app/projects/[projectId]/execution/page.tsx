'use client';

import { notFound, useParams } from 'next/navigation';
import { projects, bhuSetuData } from '@/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Construction, Handshake, Users, IndianRupee, Map, Code, Building, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export default function ExecutionPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const project = projects.find((p) => p.id === projectId);
  
  if (!project || project.id !== 'bhu-setu-2') {
    notFound();
  }

  const { districts, pppTerms, inclusiveModel, valueCreation } = bhuSetuData.execution;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline tracking-tight flex items-center">
          <Construction className="mr-4 h-10 w-10 text-primary" /> Execution: PPP Delivery-Twin
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">Tracking on-ground progress, value-creation, and service delivery.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center"><Map className="mr-2"/>District-wise Progress</CardTitle>
                <CardDescription>Live progress of parcel surveys and digitisation across active districts.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead className="w-[30%]">Progress</TableHead>
                        <TableHead>Capex (₹Cr)</TableHead>
                        <TableHead>API Rev (₹L)</TableHead>
                        <TableHead className="text-right">QC Score</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {districts.map((district) => (
                        <TableRow key={district.name}>
                        <TableCell className="font-medium">{district.name}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                            <Progress value={district.progress} className="w-[70%]" />
                            <span className="text-sm font-semibold">{district.progress}%</span>
                            </div>
                        </TableCell>
                        <TableCell>{district.capex}</TableCell>
                        <TableCell>{district.revenue}</TableCell>
                        <TableCell className="text-right font-semibold text-primary">{district.qcScore}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><ShoppingCart className="mr-2"/>Value Creation & Service Modules</CardTitle>
                    <CardDescription>Ancillary services and platforms built on the digital-twin backbone.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                        <Code className="h-8 w-8 text-accent flex-shrink-0 mt-1"/>
                        <div>
                            <h3 className="font-semibold">{valueCreation.apiMarketplace.name}</h3>
                            <p className="text-sm text-muted-foreground">{valueCreation.apiMarketplace.description}</p>
                            <p className="text-sm font-bold mt-1">{valueCreation.apiMarketplace.value}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Building className="h-8 w-8 text-accent flex-shrink-0 mt-1"/>
                        <div>
                            <h3 className="font-semibold">{valueCreation.ancillaryServices.name}</h3>
                            <p className="text-sm text-muted-foreground">{valueCreation.ancillaryServices.description}</p>
                            <p className="text-sm font-bold mt-1">{valueCreation.ancillaryServices.value}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2 space-y-8">
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><Handshake className="mr-2 h-5 w-5 text-primary"/>PPP Commercial Term-Sheet</CardTitle>
                <CardDescription>Key terms for the Design-Build-Finance-Operate-Transfer (DBFOT) concession.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {pppTerms.map(term => (
                <div key={term.title} className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="text-muted-foreground">{term.title}</span>
                    <span className="font-semibold text-right">{term.value}</span>
                </div>
                ))}
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/>Inclusive Business Model</CardTitle>
                <CardDescription>Ensuring value reaches all stakeholders, including low-income groups.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {inclusiveModel.map(item => (
                <div key={item.title} className="flex justify-between items-start text-sm border-b pb-2">
                    <span className="text-muted-foreground">{item.title}</span>
                    <span className="font-semibold text-right">{item.value}</span>
                </div>
                ))}
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
