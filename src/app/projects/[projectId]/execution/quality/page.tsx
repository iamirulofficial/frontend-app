import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function QualityControlPage() {
  return (
    <div className="container mx-auto py-8 px-4">
       <div className="text-center">
            <h1 className="text-4xl font-bold font-headline tracking-tight">Quality Control</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                This page will contain quality control metrics and verification data.
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
