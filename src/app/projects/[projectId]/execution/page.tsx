import { notFound } from 'next/navigation';
import { projects, bhuSetuData } from '@/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Construction, Handshake, Users, IndianRupee } from 'lucide-react';

export default function ExecutionPage({ params }: { params: { projectId: string } }) {
  const project = projects.find((p) => p.id === params.projectId);
  if (!project || project.id !== 'bhu-setu-2') {
    notFound();
  }

  const { districts, pppTerms, inclusiveModel } = bhuSetuData.execution;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline tracking-tight flex items-center">
          <Construction className="mr-4 h-10 w-10" /> Execution: Digital-Twin Delivery
        </h1>
        <p className="text-lg text-muted-foreground">Tracking on-ground progress and value creation.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>District-wise Progress</CardTitle>
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
                      <span>{district.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{district.capex}</TableCell>
                  <TableCell>{district.revenue}</TableCell>
                  <TableCell className="text-right font-semibold">{district.qcScore}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Handshake className="mr-2 h-5 w-5 text-primary"/>PPP Term Sheet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pppTerms.map(term => (
              <div key={term.title} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{term.title}</span>
                <span className="font-semibold">{term.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/>Inclusive Business Model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             {inclusiveModel.map(item => (
              <div key={item.title} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{item.title}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
