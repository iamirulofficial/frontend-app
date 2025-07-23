'use client';
import { useMemo, useState } from "react";
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
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { radarPolygons, insights, radarAxes } from "@/data/planning";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* -------------------------------------------------- */
// hard‑coded palette to match the rest of the app
const COLORS = [
  "#10B981", // emerald
  "#3B82F6", // blue
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#EC4899", // pink
];

/**
 * Utility – compute the average value across all axes for a project
 */
function avgOfProject(projectName: string) {
  const p = radarPolygons.find((d) => d.name === projectName);
  if (!p) return 0;
  const total = p.data.reduce((acc, cur) => acc + cur.value, 0);
  return +(total / p.data.length).toFixed(2);
}

interface DashboardProps {
  /** list of project names to include – defaults to all */
  projects?: string[];
}

export default function AnalysisDashboard({ projects }: DashboardProps) {
  const projectNames = projects && projects.length > 0 ? projects : radarPolygons.map((p) => p.name);

  /* ----------------------------- Derived data */
  // KPI cards – radial gauge for avg score
  const kpiData = useMemo(
    () =>
      projectNames.map((name) => ({
        name,
        score: avgOfProject(name),
      })),
    [projectNames]
  );

  // Stacked bar – x: axis, stacks: projects
  const stackedBarData = useMemo(() => {
    return radarAxes.map((axis) => {
      const entry: any = { axis };
      projectNames.forEach((proj) => {
        const p = radarPolygons.find((d) => d.name === proj);
        const val = p?.data.find((d) => d.axis === axis)?.value ?? 0;
        entry[proj] = val;
      });
      return entry;
    });
  }, [projectNames]);

  // Donut – proportion of high‑performing axes (>0.7) vs rest (aggregated across projects)
  const donutData = useMemo(() => {
    let good = 0,
      needs = 0;
    projectNames.forEach((proj) => {
      const p = radarPolygons.find((d) => d.name === proj);
      p?.data.forEach((d) => {
        if (d.value >= 0.7) good += 1;
        else needs += 1;
      });
    });
    return [
      { name: "Good (≥0.7)", value: good },
      { name: "Needs work", value: needs },
    ];
  }, [projectNames]);

  /* ----------------------------- UI */
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Report Dashboard</CardTitle>
        <CardDescription>Visual and narrative insights side‑by‑side</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* ---------------- Overview Tab */}
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {kpiData.map((kpi, i) => (
                <Card key={kpi.name} className="p-2 flex flex-col items-center justify-center">
                  <div className="w-full h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        innerRadius="70%"
                        outerRadius="100%"
                        data={[kpi]}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <RadialBar
                          dataKey="score"
                          cornerRadius={5}
                          fill={COLORS[i % COLORS.length]}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-center text-xs mt-1 font-medium">{kpi.name}</p>
                  <p className="text-center text-xs text-muted-foreground">
                    {(kpi.score * 100).toFixed(0)}%
                  </p>
                </Card>
              ))}
            </div>

            {/* Stacked Bar */}
            <Card className="h-80">
              <CardHeader>
                <CardTitle>Axis comparison by project</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stackedBarData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="axis" />
                    <YAxis domain={[0, 1]} tickFormatter={(t) => `${t * 100}%`} />
                    <ReTooltip formatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
                    {projectNames.map((proj, i) => (
                      <Bar
                        key={proj}
                        dataKey={proj}
                        stackId="a"
                        fill={COLORS[i % COLORS.length]}
                        name={proj}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Donut */}
            <Card className="h-72">
              <CardHeader>
                <CardTitle>Overall axis health</CardTitle>
              </CardHeader>
              <CardContent className="h-full flex items-center justify-center">
                <ResponsiveContainer width="60%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="60%"
                      outerRadius="100%"
                      paddingAngle={4}
                      label={(d) => `${d.name}`}
                    >
                      {donutData.map((_, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- Insights Tab */}
          <TabsContent value="insights" className="prose max-w-none">
            <h2>Interpretation of the Radar Chart</h2>
            <p>
              The radar visualization compares projects across Cost, Delay, Quality, Scale,
              Inclusivity, User Adoption, and Security. Larger polygons signal better
              all‑round performance.
            </p>
            <h2>Success Factors for Aadhaar & UPI</h2>
            <ul>
              <li>
                <strong>Interoperability&nbsp;</strong>—UPI’s single API drove ubiquity; Aadhaar’s open
                KYC enabled third‑party innovation.
              </li>
              <li>
                <strong>Robust authentication&nbsp;</strong>—biometric + device factors built trust.
              </li>
              <li>
                <strong>Scale & reach&nbsp;</strong>—architected for the population peak, not the pilot.
              </li>
              <li>
                <strong>Policy tailwinds&nbsp;</strong>—mandates & incentives accelerated adoption.
              </li>
              <li>
                <strong>Clear problem–solution fit&nbsp;</strong>—duplicate IDs & realtime payments.
              </li>
            </ul>
          </TabsContent>

          {/* ---------------- Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="axis-glossary">
                <AccordionTrigger>Axis glossary</AccordionTrigger>
                <AccordionContent className="prose max-w-none">
                  <ul>
                    <li><strong>Cost</strong> — total outlay, <em>lower is better</em>.</li>
                    <li><strong>Delay</strong> — schedule adherence.</li>
                    <li><strong>Quality</strong> — reliability & accuracy.</li>
                    <li><strong>Scale</strong> — user & geo coverage.</li>
                    <li><strong>Inclusivity</strong> — accessibility across segments.</li>
                    <li><strong>User Adoption</strong> — actual usage vs target.</li>
                    <li><strong>Security</strong> — data & transaction safeguards.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="project-details">
                <AccordionTrigger>Project descriptions</AccordionTrigger>
                <AccordionContent className="prose max-w-none">
                  <p><strong>Aadhaar:</strong> 12‑digit unique ID improving subsidy delivery.</p>
                  <p><strong>UPI:</strong> realtime bank‑to‑bank payment rail via NPCI.</p>
                  <p><strong>DigiLocker:</strong> citizen document vault with e‑sign.</p>
                  <p><strong>NDHM:</strong> national backbone for digital health records.</p>
                  <p><strong>GSTN:</strong> IT spine of India’s GST regime.</p>
                  <p><strong>PMGSY Bridges:</strong> geo‑tagged asset monitoring for rural roads.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}