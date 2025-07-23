import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ReportingPage() {
  return (
    <div className="container mx-auto py-8 px-4">
       <div className="text-center">
            <h1 className="text-4xl font-bold font-headline tracking-tight">Performance Reporting</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                This page will contain performance reviews and reports.
            </p>
        </div>
         <Card className="mt-8">
            <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                    This section is under construction.
                </CardDescription>
            </CardHeader>
        </Card>
    </div>
  );
}
