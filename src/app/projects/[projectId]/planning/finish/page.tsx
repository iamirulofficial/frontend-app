'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FinishPage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleLockPlan = () => {
        toast({
            title: "Plan Locked & Execution Started",
            description: "Your project baseline is locked. The Execution Twin is now ready.",
            variant: "default"
        });
        // In a real app, this would trigger a backend process.
        // Here, we just navigate.
        setTimeout(() => {
            router.push('/projects/bhu-setu-2/execution');
        }, 1500)
    };
    
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">
          ✅ Finalize & Push to Execution
        </h1>
        <p className="mt-2 text-xl text-muted-foreground">
          Review your final plan configuration before launching the project.
        </p>
      </div>
      
      <Card className="shadow-xl border-2 border-primary/20">
        <CardHeader>
            <CardTitle>Planning Summary</CardTitle>
            <CardDescription>This configuration will serve as the baseline for the execution phase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-secondary/50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 flex items-center"><Zap className="mr-2 h-5 w-5 text-amber-500"/>Chosen Scenario</h3>
                    <p className="font-bold text-2xl text-primary">SC-B • IRR 14% • Delay -12d</p>
                </div>
                 <div className="p-4 bg-secondary/50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">PPP Terms</h3>
                    <p className="text-muted-foreground">15 yrs ∙ VGF 20% ∙ RevShare 15%</p>
                </div>
            </div>
            
            <Separator />
            
            <div>
                 <h3 className="font-semibold text-lg mb-3">Inclusive-Biz Canvas</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 border rounded-md">
                        <p className="font-semibold">Beneficiaries</p>
                        <p className="text-sm text-muted-foreground">Smallholder farmers, SHGs</p>
                    </div>
                    <div className="p-4 border rounded-md">
                        <p className="font-semibold">Value Bundles</p>
                        <p className="text-sm text-muted-foreground">Doorstep survey, API Market</p>
                    </div>
                     <div className="p-4 border rounded-md">
                        <p className="font-semibold">Revenue Mix</p>
                        <p className="text-sm text-muted-foreground">User 40% ∙ API 35% ∙ Govt 25%</p>
                    </div>
                 </div>
            </div>
        </CardContent>
      </Card>
      
       <div className="flex justify-between items-center mt-12">
        <Button variant="outline" asChild>
          <Link href="/projects/bhu-setu-2/planning/sandbox">
            Back: Sandbox
          </Link>
        </Button>
        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleLockPlan}>
            <CheckCircle className="mr-2"/>
            Lock Plan & Launch Execution
        </Button>
      </div>
    </div>
  );
}
