"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projects } from '@/data';
import { ProjectCard } from '@/components/project-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import {
  PlusCircle,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  BarChart3,
  Activity,
  Target,
  Zap,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  MapPin,
  Star,
  ArrowRight,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentTime, setCurrentTime] = useState(new Date());

  const activeProjects = projects.filter((p) => p.status === 'active');
  const completedProjects = projects.filter((p) => p.status === 'completed');
  const onHoldProjects = projects.filter((p) => p.status === 'on-hold');

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate dashboard metrics from available data
  const avgROI = Math.round((projects.reduce((sum, p) => sum + (p.kpi.roi || 0), 0) / projects.length) * 100);
  const avgDelayDays = Math.round(projects.reduce((sum, p) => sum + Math.abs(p.kpi.delayDays || 0), 0) / projects.length);
  const avgQuality = Math.round(projects.reduce((sum, p) => sum + (p.kpi.quality || 0), 0) / projects.length);
  const totalProjects = projects.length;

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'planning': return 'bg-yellow-500';
      case 'paused': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'planning': return <Clock className="h-4 w-4" />;
      case 'paused': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    NirmalGov
                  </h1>
                  <p className="text-sm text-slate-600">Project Portfolio Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {currentTime.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-slate-600">
                  {currentTime.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Asia/Kolkata'
                  })} IST
                </p>
              </div>
              <Link href="/new">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Total Projects</p>
                    <p className="text-3xl font-bold text-white">{totalProjects}</p>
                    <p className="text-emerald-200 text-xs mt-1">Active portfolio</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute -right-6 -bottom-6 opacity-20">
                  <BarChart3 className="h-24 w-24 text-white" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Avg ROI</p>
                    <p className="text-3xl font-bold text-white">{avgROI}%</p>
                    <p className="text-blue-200 text-xs mt-1">Return on investment</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute -right-6 -bottom-6 opacity-20">
                  <DollarSign className="h-24 w-24 text-white" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Avg Quality</p>
                    <p className="text-3xl font-bold text-white">{avgQuality}%</p>
                    <p className="text-purple-200 text-xs mt-1">Quality score</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute -right-6 -bottom-6 opacity-20">
                  <CheckCircle2 className="h-24 w-24 text-white" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Avg Delay</p>
                    <p className="text-3xl font-bold text-white">{avgDelayDays}d</p>
                    <p className="text-orange-200 text-xs mt-1">Timeline impact</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute -right-6 -bottom-6 opacity-20">
                  <Calendar className="h-24 w-24 text-white" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-green-600" />
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{activeProjects.length}</div>
                  <Progress value={(activeProjects.length / totalProjects) * 100} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {Math.round((activeProjects.length / totalProjects) * 100)}% of portfolio
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  Completed Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{completedProjects.length}</div>
                  <Progress value={(completedProjects.length / totalProjects) * 100} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {Math.round((completedProjects.length / totalProjects) * 100)}% completion rate
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  On-Hold Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{onHoldProjects.length}</div>
                  <Progress value={(onHoldProjects.length / totalProjects) * 100} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {Math.round((onHoldProjects.length / totalProjects) * 100)}% need attention
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Projects</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  {filteredProjects.length} of {totalProjects} projects
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] overflow-hidden">
                  <div className="relative">
                    {/* Project Image */}
                    <div
                      className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden"
                      style={{
                        backgroundImage: `url(${project.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className={cn(
                          "text-white border-0 shadow-lg",
                          project.status === 'active' ? 'bg-green-500' :
                          project.status === 'completed' ? 'bg-blue-500' :
                          'bg-orange-500'
                        )}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1 capitalize">{project.status}</span>
                        </Badge>
                      </div>

                      {/* Quick Stats */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="grid grid-cols-3 gap-2 text-white text-xs">
                          <div className="text-center bg-black/30 rounded-lg p-2 backdrop-blur-sm">
                            <TrendingUp className="h-3 w-3 mx-auto mb-1" />
                            <div className="font-semibold">{Math.round(project.kpi.roi * 100)}%</div>
                            <div className="opacity-75">ROI</div>
                          </div>
                          <div className="text-center bg-black/30 rounded-lg p-2 backdrop-blur-sm">
                            <Clock className="h-3 w-3 mx-auto mb-1" />
                            <div className="font-semibold">{project.kpi.delayDays}d</div>
                            <div className="opacity-75">Delay</div>
                          </div>
                          <div className="text-center bg-black/30 rounded-lg p-2 backdrop-blur-sm">
                            <Star className="h-3 w-3 mx-auto mb-1" />
                            <div className="font-semibold">{project.kpi.quality}%</div>
                            <div className="opacity-75">Quality</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Content */}
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                          {project.name}
                        </h3>
                        <Badge variant="outline" className="mb-3">
                          <MapPin className="h-3 w-3 mr-1" />
                          {project.sector}
                        </Badge>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.kpi.quality}%</span>
                        </div>
                        <Progress value={project.kpi.quality} className="h-2" />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link href={`/projects/${project.id}`} className="flex-1">
                          <Button className="w-full group-hover:bg-blue-600 transition-colors">
                            <Eye className="h-4 w-4 mr-2" />
                            View Dashboard
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Create New Project Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + filteredProjects.length * 0.1 }}
            >
              <Link href="/new" className="h-full block group">
                <Card className="h-full border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 group-hover:scale-[1.02] flex flex-col items-center justify-center min-h-[400px]">
                  <CardContent className="text-center p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <PlusCircle className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                      Create New Project
                    </CardTitle>
                    <CardDescription className="text-center max-w-xs">
                      Start a new governance initiative and track its progress from planning to completion.
                    </CardDescription>
                    <Button variant="outline" className="mt-4 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 text-center"
        >
          <div className="text-muted-foreground text-sm">
            <p>GovernAI Studio • Transforming Public Governance with Intelligence</p>
            <p className="mt-1">Last updated: {currentTime.toLocaleString('en-IN')}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
