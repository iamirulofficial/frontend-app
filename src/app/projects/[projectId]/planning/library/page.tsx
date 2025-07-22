'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { planningData } from '@/data';


export default function LibraryPage() {
  const [pinnedPractices, setPinnedPractices] = useState<string[]>([]);
  const { sparkLibrary } = planningData;

  const handlePin = (practice: string) => {
    if (pinnedPractices.includes(practice)) {
      setPinnedPractices(pinnedPractices.filter(p => p !== practice));
    } else {
       if (pinnedPractices.length < 5) {
         setPinnedPractices([...pinnedPractices, practice]);
       }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
       <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">
                🔍 SPARK Library
            </h1>
            <p className="mt-2 text-xl text-muted-foreground">
                Learn from India’s Game-Changers. Select a project to extract ‘keystone practices’.
            </p>
        </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {sparkLibrary.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Image src={project.logoUrl} alt={`${project.name} logo`} width={48} height={48} />
                    <div>
                      <CardTitle className="font-headline text-2xl">{project.name}</CardTitle>
                      <CardDescription>{project.sector}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <p className="font-semibold text-sm">Outcome Highlights:</p>
                   <ul className="list-disc list-inside text-muted-foreground text-sm">
                      {project.outcomes.map(o => <li key={o}>{o}</li>)}
                   </ul>
                   <div className="pt-4">
                     <p className="font-semibold text-sm mb-2">Keystone Practices:</p>
                      <div className="flex flex-wrap gap-2">
                          {project.keystones.map(k => (
                              <Badge 
                                  key={k}
                                  variant={pinnedPractices.includes(k) ? "default" : "secondary"}
                                  onClick={() => handlePin(k)}
                                  className="cursor-pointer transition-colors"
                              >
                                {pinnedPractices.includes(k) && <Check className="mr-1 h-3 w-3" />}
                                {k}
                              </Badge>
                          ))}
                      </div>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <aside className="lg:w-1/3 sticky top-24 self-start">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <span className="text-primary">🔖</span> Pinned Learnings
              </CardTitle>
            </CardHeader>
            <CardContent>
                <AnimatePresence>
                {pinnedPractices.length > 0 ? (
                    <ul className="space-y-2">
                    {pinnedPractices.map((practice, index) => (
                        <motion.li
                            key={practice}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="flex items-center justify-between p-3 bg-secondary rounded-md text-secondary-foreground"
                        >
                            <span className="text-sm font-medium">{practice}</span>
                            <button onClick={() => handlePin(practice)} className="text-muted-foreground hover:text-destructive">
                                <X className="h-4 w-4" />
                            </button>
                        </motion.li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground text-center py-8">Select practices from the projects on the left.</p>
                )}
                </AnimatePresence>
            </CardContent>
          </Card>
        </aside>
      </div>
      
       <div className="flex justify-between mt-12">
           <Button variant="outline" asChild>
                <Link href="/projects/bhu-setu-2/planning/charter">
                   Back: Charter
                </Link>
            </Button>
            <Button size="lg" asChild>
                <Link href="/projects/bhu-setu-2/planning/scan">
                    Next: SPARK Scan
                </Link>
            </Button>
        </div>
    </div>
  );
}
