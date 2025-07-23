'use client';
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { radarAxes, radarPolygons } from "@/data/planning";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowRight } from "lucide-react";

/* -------------------------------------------------------------------- */

type AxisKey = (typeof radarAxes)[number];

interface RadarDatum {
  name: string;
  data: { axis: AxisKey; value: number }[];
}

interface DashboardProps {
  /** List of project names available in radarData */
  projects: string[];
  /** Polygons coming from your existing `radarPolygons` */
  radarData: RadarDatum[];
}

const colors = [
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

/* -------------------------------------------------------------------- */

export default function ScanPage() {
    const projectNames = radarPolygons.map(p => p.name);
    const [selected, setSelected] = useState<string | "all">("all");
    
    /* -------- helpers -------------------------------------------------- */
    const filterRadar = selected === "all" ? radarPolygons : radarPolygons.filter((p) => p.name === selected);
    
    const barData = radarPolygons.map((p) => {
        const entry: Record<string, number | string> = { name: p.name };
        p.data.forEach((d) => {
          entry[d.axis] = d.value;
        });
        return entry;
    });

    const axisMeans = radarAxes.map((axis) => {
        const vals = filterRadar
          .flatMap((p) => p.data.filter((d) => d.axis === axis))
          .map((d) => d.value);
        const mean = vals.reduce((s, v) => s + v, 0) / (vals.length || 1);
        return { name: axis, value: mean };
    });

    const strongCount = axisMeans.filter((a) => a.value >= 0.7).length;
    const pieData = [
        { name: "Strong", value: strongCount },
        { name: "Needs Work", value: axisMeans.length - strongCount },
    ];

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-headline tracking-tight">
                ⚡️ SPARK Scan
                </h1>
                <p className="mt-2 text-xl text-muted-foreground max-w-3xl mx-auto">
                Systematic Project Assessment of Risk &amp; Capability. We analyze a corpus of similar public-governance projects to find insights for you.
                </p>
            </div>
        <Card>
        <CardHeader>
            <CardTitle>SPARK Analysis Report</CardTitle>
            <CardDescription>
            Interactive breakdown of past project performance to inform your planning.
            </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
            <div className="flex justify-end">
            <Select value={selected} onValueChange={(v) => setSelected(v as any)}>
                <SelectTrigger className="w-48">
                <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projectNames.map((p) => (
                    <SelectItem key={p} value={p}>
                    {p}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            </div>

            <Tabs defaultValue="overview">
            <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {axisMeans.map((axis, i) => (
                    <Card key={axis.name}>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">
                        {axis.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            innerRadius="75%"
                            outerRadius="100%"
                            data={[{ name: axis.name, value: axis.value * 100 }]}
                            startAngle={90}
                            endAngle={-270}
                        >
                            <RadialBar
                            dataKey="value"
                            cornerRadius={4}
                            fill={colors[i % colors.length]}
                            background
                            />
                            <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="font-semibold text-lg fill-foreground"
                            >
                            {axis.value.toFixed(2)}
                            </text>
                        </RadialBarChart>
                        </ResponsiveContainer>
                    </CardContent>
                    </Card>
                ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                    <CardTitle>Axis Comparison</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {radarAxes.map((axis, i) => (
                            <Bar
                            key={axis}
                            dataKey={axis}
                            stackId="a"
                            fill={colors[i % colors.length]}
                            />
                        ))}
                        </BarChart>
                    </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                    <CardTitle>Strength Split</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="90%"
                            label
                        >
                            <Cell key={`cell-0`} fill={"hsl(var(--accent))"} />
                            <Cell key={`cell-1`} fill={"hsl(var(--destructive))"} />
                        </Pie>
                        <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    </CardContent>
                </Card>
                </div>
            </TabsContent>

            <TabsContent value="insights">
                <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="factors">
                    <AccordionTrigger>Success Factors</AccordionTrigger>
                    <AccordionContent>
                    <ul className="list-disc space-y-1 ml-4">
                        <li>
                        <strong>Interoperability:</strong> Single API layers accelerate
                        adoption.
                        </li>
                        <li>
                        <strong>Robust Authentication:</strong> Biometric / two‑factor
                        flows build trust.
                        </li>
                        <li>
                        <strong>Policy Support:</strong> Clear mandates unblock scale.
                        </li>
                    </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="watchouts">
                    <AccordionTrigger>Lessons & Watch‑outs</AccordionTrigger>
                    <AccordionContent>
                    <ul className="list-disc space-y-1 ml-4">
                        <li>Ensure privacy safeguards scale with adoption.</li>
                        <li>Design fallback UX for low‑connectivity zones.</li>
                        <li>Plan vendor lock‑in exit paths.</li>
                    </ul>
                    </AccordionContent>
                </AccordionItem>
                </Accordion>
            </TabsContent>

            <TabsContent value="details">
                <Accordion type="multiple" className="w-full">
                <AccordionItem value="glossary">
                    <AccordionTrigger>Axis Glossary</AccordionTrigger>
                    <AccordionContent>
                    <ul className="list-disc space-y-1 ml-4">
                        <li>
                        <strong>Cost:</strong> CAPEX plus 3‑year OPEX, normalized 0‑1.
                        </li>
                        <li>
                        <strong>Delay:</strong> Schedule variance vs baseline.
                        </li>
                        <li>
                        <strong>Quality:</strong> Service uptime & error rates.
                        </li>
                        <li>
                        <strong>Scale:</strong> Active user count relative to
                        population.
                        </li>
                        <li>
                        <strong>Inclusivity:</strong> Rural & gender parity adoption
                        index.
                        </li>
                        <li>
                        <strong>User Adoption:</strong> MAU / Target Population.
                        </li>
                        <li>
                        <strong>Security:</strong> Composite of ISO 27001 controls
                        met.
                        </li>
                    </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="proj">
                    <AccordionTrigger>Project Descriptions</AccordionTrigger>
                    <AccordionContent>
                    <p className="mb-2">
                        <strong>Aadhaar:</strong> National digital ID with biometric
                        auth.
                    </p>
                    <p className="mb-2">
                        <strong>UPI:</strong> Real‑time payments API unifying banks.
                    </p>
                    <p className="mb-2">
                        <strong>DigiLocker:</strong> Citizen doc‑vault with e‑sign.
                    </p>
                    </AccordionContent>
                </AccordionItem>
                </Accordion>
            </TabsContent>
            </Tabs>
        </CardContent>
        </Card>
        <div className="flex justify-between mt-12">
            <Button variant="outline" asChild>
            <Link href="/projects/bhu-setu-2/planning/charter">
                Back: Charter
            </Link>
            </Button>
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
            <Link href="/projects/bhu-setu-2/planning/wbs">
                Next: AI-Drafted WBS
                <ArrowRight className="ml-2"/>
            </Link>
            </Button>
        </div>
        </div>
    );
}