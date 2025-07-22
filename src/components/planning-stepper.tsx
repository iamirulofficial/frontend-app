'use client';
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const planningSteps = [
    { name: 'Charter', href: '/charter' },
    { name: 'SPARK Scan', href: '/scan' },
    { name: 'WBS & Risk', href: '/wbs' },
    { name: 'Sandbox', href: '/sandbox' },
    { name: 'Finalize', href: '/finish' },
]

export function PlanningStepper() {
    const pathname = usePathname();
    const params = useParams();
    const projectId = params.projectId;

    const currentPath = pathname.split('/planning')[1] || '';
    const currentIndex = planningSteps.findIndex(step => step.href === currentPath);
    
    return (
        <div className="border-b bg-card">
            <nav className="container mx-auto -mb-px flex space-x-8 px-4" aria-label="Tabs">
                {planningSteps.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    
                    return (
                    <Link
                        key={step.name}
                        href={`/projects/${projectId}/planning${step.href}`}
                        className={cn(
                        'group inline-flex items-center gap-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
                         isCurrent 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-gray-700',
                        )}
                        aria-current={isCurrent ? 'page' : undefined}
                    >
                         <span className={cn(
                             'flex h-6 w-6 items-center justify-center rounded-full text-xs',
                             isCompleted ? 'bg-primary text-primary-foreground' :
                             isCurrent ? 'border-2 border-primary text-primary' :
                             'border-2 border-gray-300 text-muted-foreground'
                         )}>
                             {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                         </span>
                        {step.name}
                    </Link>
                )})}
            </nav>
        </div>
    )
}
