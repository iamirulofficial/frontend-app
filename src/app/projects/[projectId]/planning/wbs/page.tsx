'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { planningData } from '@/data';

const getRiskColor = (risk: number) => {
  if (risk > 0.6) return 'bg-red-500';
  if (risk > 0.3) return 'bg-amber-500';
  return 'bg-blue-500';
};

const EditableCell = ({ value, onSave }: { value: number, onSave: (newValue: number) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);

    const handleBlur = () => {
        setIsEditing(false);
        onSave(currentValue);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 0 && val <= 100) {
            setCurrentValue(val);
        }
    };

    return (
        <div className="font-bold" onClick={() => setIsEditing(true)}>
            {isEditing ? (
                <input
                    type="number"
                    value={currentValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                    className="w-16 text-center bg-background border-b-2 border-primary"
                />
            ) : (
                <span className="p-1">{currentValue}%</span>
            )}
        </div>
    );
};


export default function WBSPage() {
    const [riskAllocations, setRiskAllocations] = useState(planningData.pppRisk);

    const handleRiskChange = (index: number, type: 'gov' | 'private', value: number) => {
        const newAllocations = [...riskAllocations];
        if(type === 'gov') {
            newAllocations[index].gov = value;
            newAllocations[index].private = 100 - value;
        } else {
            newAllocations[index].private = value;
            newAllocations[index].gov = 100 - value;
        }
        setRiskAllocations(newAllocations);
    };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">
          🏗️ AI-Drafted WBS & PPP Risk Allocation
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Gantt Sketch */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Gantt Sketch</CardTitle>
              <CardDescription>AI-drafted work breakdown structure. Risk overlays are updated from the PPP sheet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pr-6">
              {planningData.wbs.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <span className="w-48 text-sm font-medium truncate">{item.task}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.duration / 30 * 100}%` }}
                        transition={{ delay: i * 0.1 + 0.3, duration: 0.5, type: 'spring' }}
                        className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-2 text-white text-xs"
                    >
                        {item.duration}d
                    </motion.div>
                     <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.p80Risk * 100}%` }}
                        transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
                        className={`absolute top-0 left-0 h-full rounded-full opacity-50 ${getRiskColor(item.p80Risk)}`}
                    />
                  </div>
                   <span className="w-20 text-xs text-right text-muted-foreground">
                        P-80: {(item.p80Risk * 100).toFixed(0)}%
                   </span>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* PPP Risk Sheet */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>PPP Risk Sheet</CardTitle>
              <CardDescription>Allocate risk between Government and Private entities. Click a value to edit.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Risk Factor</TableHead>
                    <TableHead className="text-center">Govt %</TableHead>
                    <TableHead className="text-center">Private %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riskAllocations.map((item, i) => (
                    <TableRow key={item.factor}>
                      <TableCell className="font-medium">{item.factor}</TableCell>
                      <TableCell className="text-center">
                         <EditableCell value={item.gov} onSave={(val) => handleRiskChange(i, 'gov', val)} />
                      </TableCell>
                       <TableCell className="text-center">
                         <EditableCell value={item.private} onSave={(val) => handleRiskChange(i, 'private', val)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-12">
        <Button variant="outline" asChild>
          <Link href="/projects/bhu-setu-2/planning/scan">
            Back: SPARK Scan
          </Link>
        </Button>
        <Button size="lg" asChild>
          <Link href="/projects/bhu-setu-2/planning/sandbox">
            Next: Sandbox
          </Link>
        </Button>
      </div>
    </div>
  );
}
