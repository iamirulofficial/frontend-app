import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Rocket, FileText, Handshake, Landmark, HeartPulse, TramFront } from 'lucide-react';

export default function NewProjectPage() {
  const templates = [
    { id: 'land', name: 'Land & Urban', icon: <Landmark className="h-8 w-8 mb-2" /> },
    { id: 'health', name: 'Health', icon: <HeartPulse className="h-8 w-8 mb-2" /> },
    { id: 'transport', name: 'Transport', icon: <TramFront className="h-8 w-8 mb-2" /> },
  ];
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Create a New Project</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Launch your next public-governance initiative in three simple steps.
        </p>
      </div>

      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basics"><FileText className="mr-2 h-4 w-4"/>Basics</TabsTrigger>
          <TabsTrigger value="template"><Rocket className="mr-2 h-4 w-4"/>Template</TabsTrigger>
          <TabsTrigger value="ppp"><Handshake className="mr-2 h-4 w-4"/>PPP Model</TabsTrigger>
        </TabsList>
        
        <Card className="mt-4">
            <CardContent className="pt-6">
                <TabsContent value="basics">
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="projectName">Project Name</Label>
                            <Input id="projectName" placeholder="e.g., Bhu-Setu 3.0" />
                        </div>
                        <div>
                            <Label htmlFor="sector">Sector</Label>
                             <Select>
                                <SelectTrigger id="sector">
                                    <SelectValue placeholder="Select a sector" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="land">Land & Urban</SelectItem>
                                    <SelectItem value="health">Health</SelectItem>
                                    <SelectItem value="transport">Transport</SelectItem>
                                    <SelectItem value="water">Water</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="A brief description of the project's goals." />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="template">
                    <div className="space-y-4">
                        <Label>Select a Project Template</Label>
                        <p className="text-sm text-muted-foreground">Templates provide a pre-configured starting point for your project.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {templates.map(template => (
                                <Card key={template.id} className="p-4 text-center hover:bg-accent hover:border-primary cursor-pointer transition-colors">
                                    {template.icon}
                                    <p className="font-semibold">{template.name}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="ppp">
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="concession">Concession Period (Years)</Label>
                            <Input id="concession" type="number" placeholder="15" />
                        </div>
                        <div>
                            <Label htmlFor="vgf">Viability Gap Funding (%)</Label>
                            <Input id="vgf" type="number" placeholder="10" />
                        </div>
                         <div>
                            <Label htmlFor="revenue-share">Operator Revenue Share (%)</Label>
                            <Input id="revenue-share" type="number" placeholder="20" />
                        </div>
                    </div>
                </TabsContent>
                <div className="flex justify-end mt-8">
                    <Button>Create Project <Rocket className="ml-2 h-4 w-4" /></Button>
                </div>
            </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
