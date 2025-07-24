"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Star,
  Camera,
  Coins,
  Shield,
  Smartphone,
  Heart,
  Award,
  Eye,
  FileText,
  MessageSquare,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Navigation,
  Zap,
  Home,
  BarChart3,
  Settings,
  Wallet,
  QrCode,
  Upload,
  Video,
  Mic,
  Globe,
  Phone,
  Languages,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  owner: string;
  budget: string;
  status: "on-track" | "delayed" | "ahead";
  spi: number;
  citizenScore: number;
  totalRatings: number;
  nextMilestone: string;
  milestoneDate: string;
  category: string;
  location: string;
  completionPercentage: number;
  verificationReward: number;
  description: string;
  image: string;
}

interface VerificationMission {
  id: string;
  projectId: string;
  projectTitle: string;
  type: "photo" | "video" | "sensor" | "ar";
  task: string;
  location: string;
  reward: number;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: string;
  aiModel: string;
  status: "available" | "in-progress" | "completed";
}

interface JanPoints {
  balance: number;
  earned: number;
  redeemed: number;
  level: string;
  nextLevelPoints: number;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export default function CitizenPage() {
  const [activeTab, setActiveTab] = useState("projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userLocation, setUserLocation] = useState({ lat: 15.3173, lng: 75.7139 }); // Gadag, Karnataka
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-dropdown')) {
        setShowLanguageDropdown(false);
      }
    };

    if (showLanguageDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageDropdown]);

  // Multi-language support
  const [languages] = useState<Language[]>([
    { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
    { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
    { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
    { code: "as", name: "Assamese", nativeName: "অসমীয়া", flag: "🇮🇳" }
  ]);

  // Translations for key UI elements
  const translations = {
    en: {
      title: "RTI 2.0 : Jan-Darpan",
      subtitle: "Universal Citizen Portal for Public Governance Projects",
      projectsNearMe: "Projects Near Me",
      nationalDashboard: "National Dashboard",
      verifyEarn: "Verify & Earn",
      services: "Services",
      profileWallet: "Profile & Wallet",
      searchPlaceholder: "Search projects...",
      allCategories: "All Categories",
      openProject: "Open Project",
      verifyWork: "Verify Work",
      earnPoints: "Earn"
    },
    hi: {
      title: "जन-दर्पण",
      subtitle: "सार्वजनिक शासन परियोजनाओं के लिए सार्वभौमिक नागरिक पोर्टल",
      projectsNearMe: "मेरे पास की परियोजनाएं",
      nationalDashboard: "राष्ट्रीय डैशबोर्ड",
      verifyEarn: "सत्यापित करें और कमाएं",
      services: "सेवाएं",
      profileWallet: "प्रोफ़ाइल और वॉलेट",
      searchPlaceholder: "परियोजनाएं खोजें...",
      allCategories: "सभी श्रेणियां",
      openProject: "परियोजना खोलें",
      verifyWork: "कार्य सत्यापित करें",
      earnPoints: "अंक कमाएं"
    },
    kn: {
      title: "ಜನ-ದರ್ಪಣ",
      subtitle: "ಸಾರ್ವಜನಿಕ ಆಡಳಿತ ಯೋಜನೆಗಳಿಗಾಗಿ ಸಾರ್ವತ್ರಿಕ ನಾಗರಿಕ ಪೋರ್ಟಲ್",
      projectsNearMe: "ನನ್ನ ಹತ್ತಿರದ ಯೋಜನೆಗಳು",
      nationalDashboard: "ರಾಷ್ಟ್ರೀಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      verifyEarn: "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಗಳಿಸಿ",
      services: "ಸೇವೆಗಳು",
      profileWallet: "ಪ್ರೊಫೈಲ್ ಮತ್ತು ವಾಲೆಟ್",
      searchPlaceholder: "ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ...",
      allCategories: "ಎಲ್ಲಾ ವರ್ಗಗಳು",
      openProject: "ಯೋಜನೆ ತೆರೆಯಿರಿ",
      verifyWork: "ಕೆಲಸ ಪರಿಶೀಲಿಸಿ",
      earnPoints: "ಅಂಕಗಳನ್ನು ಗಳಿಸಿ"
    }
  };

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  // Mock data for projects near user
  const [nearbyProjects] = useState<Project[]>([
    {
      id: "bhu-setu-2",
      title: "Bhu-Setu 2.0 – National Land Governance",
      owner: "MoHUA + State Revenue Dept",
      budget: "₹10,400 Cr",
      status: "on-track",
      spi: 1.04,
      citizenScore: 4.7,
      totalRatings: 3945,
      nextMilestone: "ULPIN API v1 Go-Live",
      milestoneDate: "30 Aug 2025",
      category: "Land Records",
      location: "Gadag District",
      completionPercentage: 42,
      verificationReward: 15,
      description: "Digitizing land records with blockchain verification and AR boundary mapping",
      image: "/api/placeholder/400/200"
    },
    {
      id: "pmgsy-bridge-532",
      title: "PMGSY Bridge Construction Phase-2",
      owner: "Ministry of Rural Development",
      budget: "₹45 Cr",
      status: "ahead",
      spi: 1.24,
      citizenScore: 4.2,
      totalRatings: 1247,
      nextMilestone: "Structural Testing Complete",
      milestoneDate: "15 Aug 2025",
      category: "Infrastructure",
      location: "Gadag-Koppal Highway",
      completionPercentage: 78,
      verificationReward: 25,
      description: "Rural connectivity bridge with smart sensors for load monitoring",
      image: "/api/placeholder/400/200"
    },
    {
      id: "smart-led-gadag",
      title: "Smart LED Streetlight Project",
      owner: "Karnataka Urban Infrastructure",
      budget: "₹12 Cr",
      status: "delayed",
      spi: 0.87,
      citizenScore: 3.9,
      totalRatings: 892,
      nextMilestone: "IoT Integration Testing",
      milestoneDate: "25 Aug 2025",
      category: "Smart City",
      location: "Gadag City Center",
      completionPercentage: 65,
      verificationReward: 10,
      description: "Energy-efficient LED streetlights with motion sensors and pollution monitoring",
      image: "/api/placeholder/400/200"
    }
  ]);

  // Mock verification missions
  const [verificationMissions] = useState<VerificationMission[]>([
    {
      id: "vm-001",
      projectId: "bhu-setu-2",
      projectTitle: "Bhu-Setu 2.0",
      type: "ar",
      task: "Verify parcel boundary using AR overlay",
      location: "Survey No. P-1047, Gadag",
      reward: 15,
      difficulty: "medium",
      estimatedTime: "10 mins",
      aiModel: "boundary-detect-v2",
      status: "available"
    },
    {
      id: "vm-002",
      projectId: "pmgsy-bridge-532",
      projectTitle: "PMGSY Bridge",
      type: "video",
      task: "Record driving across completed bridge span",
      location: "Gadag-Koppal Highway KM 23",
      reward: 25,
      difficulty: "easy",
      estimatedTime: "5 mins",
      aiModel: "bridge-integrity-v1",
      status: "available"
    },
    {
      id: "vm-003",
      projectId: "smart-led-gadag",
      projectTitle: "Smart LED Streetlights",
      type: "photo",
      task: "Night luminance check of LED installations",
      location: "Gandhi Circle, Gadag",
      reward: 10,
      difficulty: "easy",
      estimatedTime: "3 mins",
      aiModel: "luminance-detect-v1",
      status: "available"
    }
  ]);

  // Mock Jan-Points data
  const [janPoints] = useState<JanPoints>({
    balance: 347,
    earned: 1250,
    redeemed: 903,
    level: "Verification Champion",
    nextLevelPoints: 153
  });

  // Mock national dashboard data
  const [nationalStats] = useState({
    totalProjects: 15847,
    activeVerifiers: 2847593,
    completedVerifications: 8947234,
    totalBudget: "₹4,23,847 Cr",
    citizenSatisfaction: 4.3,
    avgProjectDelay: 12.4,
    topPerformingState: "Karnataka",
    recentlyCompleted: 1247
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track": return "text-green-600 bg-green-50 border-green-200";
      case "ahead": return "text-blue-600 bg-blue-50 border-blue-200";
      case "delayed": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-track": return "🟢";
      case "ahead": return "🔵";
      case "delayed": return "🔴";
      default: return "⚪";
    }
  };

  const filteredProjects = nearbyProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
            <p className="text-muted-foreground">
              {t.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative language-dropdown">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Languages className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">
                  {languages.find(lang => lang.code === selectedLanguage)?.flag}
                  {languages.find(lang => lang.code === selectedLanguage)?.nativeName}
                </span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </button>

              {showLanguageDropdown && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setSelectedLanguage(language.code);
                        setShowLanguageDropdown(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2",
                        selectedLanguage === language.code ? "bg-blue-50 text-blue-700" : ""
                      )}
                    >
                      <span>{language.flag}</span>
                      <div>
                        <div className="font-medium text-sm">{language.nativeName}</div>
                        <div className="text-xs text-gray-500">{language.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <Coins className="h-4 w-4 text-yellow-600" />
              <span className="font-bold text-yellow-700">{janPoints.balance}</span>
              <span className="text-sm text-yellow-600">Jan-Points</span>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              <Award className="h-3 w-3 mr-1" />
              {janPoints.level}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Near You</p>
                <p className="font-bold">{nearbyProjects.length} Projects</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="font-bold">{verificationMissions.length} Missions</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Earned</p>
                <p className="font-bold">{janPoints.earned} Points</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Star className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="font-bold">{nationalStats.citizenSatisfaction}★</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            {t.projectsNearMe}
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t.nationalDashboard}
          </TabsTrigger>
          <TabsTrigger value="verify" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            {t.verifyEarn}
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {t.services}
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            {t.profileWallet}
          </TabsTrigger>
        </TabsList>

        {/* Projects Near Me Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-input rounded-md"
            >
              <option value="all">{t.allCategories}</option>
              <option value="Land Records">Land Records</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Smart City">Smart City</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    <div className="absolute top-4 left-4">
                      <Badge className={cn("border", getStatusColor(project.status))}>
                        {getStatusIcon(project.status)} {project.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary">
                        SPI: {project.spi}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{project.title}</CardTitle>
                      <CardDescription className="text-sm">{project.owner}</CardDescription>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-green-600">{project.budget}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{project.citizenScore}</span>
                          <span className="text-muted-foreground">({project.totalRatings.toLocaleString()})</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-mono">{project.completionPercentage}%</span>
                      </div>
                      <Progress value={project.completionPercentage} className="h-1" />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Next: {project.nextMilestone} • {project.milestoneDate}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{project.location}</span>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        className="flex-1 text-xs px-2 py-1"
                        onClick={() => setSelectedProject(project)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        {t.openProject}
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs px-2 py-1">
                        <Camera className="h-3 w-3 mr-1" />
                        {t.verifyWork}
                      </Button>
                      <Button size="sm" variant="secondary" className="text-xs px-2 py-1">
                        <Settings className="h-3 w-3 mr-1" />
                        {t.services}
                      </Button>
                    </div>

                    {project.verificationReward > 0 && (
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                        <Coins className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-700">
                          {t.earnPoints} <strong>+{project.verificationReward} Jan-Points</strong> for verification
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* National Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{nationalStats.totalProjects.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across all ministries</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active Verifiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{nationalStats.activeVerifiers.toLocaleString()}</div>
                <p className="text-xs text-green-600">+12% this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{nationalStats.totalBudget}</div>
                <p className="text-xs text-muted-foreground">Public spending tracked</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Citizen Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-1">
                  {nationalStats.citizenSatisfaction}
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
                <p className="text-xs text-green-600">+0.2 vs last quarter</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Fastest Projects (SPI &gt; 1.2)</CardTitle>
              <CardDescription>Projects ahead of schedule across all ministries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Delhi Metro Phase-4", spi: 1.45, ministry: "MoHUA", state: "Delhi" },
                  { name: "Digital India Land Records", spi: 1.38, ministry: "MoHUA", state: "Multi-State" },
                  { name: "Bharatmala Highway NH-44", spi: 1.32, ministry: "MoRTH", state: "Punjab" },
                  { name: "Smart City Mission - Pune", spi: 1.28, ministry: "MoHUA", state: "Maharashtra" },
                  { name: "Ayushman Bharat Centers", spi: 1.24, ministry: "MoHFW", state: "Kerala" }
                ].map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">{project.ministry} • {project.state}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      SPI: {project.spi}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verify & Earn Tab */}
        <TabsContent value="verify" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Verification Missions</CardTitle>
                  <CardDescription>Help verify public projects and earn Jan-Points</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {verificationMissions.map((mission, index) => (
                    <motion.div
                      key={mission.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                          <h4 className="font-medium">{mission.task}</h4>
                          <p className="text-sm text-muted-foreground">{mission.projectTitle}</p>
                        </div>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          +{mission.reward} Points
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {mission.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          ~{mission.estimatedTime}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {mission.difficulty}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        {mission.type === "photo" && <Camera className="h-4 w-4" />}
                        {mission.type === "video" && <Video className="h-4 w-4" />}
                        {mission.type === "ar" && <QrCode className="h-4 w-4" />}
                        {mission.type === "sensor" && <Smartphone className="h-4 w-4" />}
                        <span className="text-sm capitalize">{mission.type} verification</span>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="flex-1">
                          <Navigation className="h-4 w-4 mr-1" />
                          Start Mission
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Jan-Points</CardTitle>
                  <CardDescription>Blockchain rewards for verification work</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-3xl font-bold text-yellow-700">{janPoints.balance}</div>
                    <p className="text-sm text-yellow-600">Available Points</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Level Progress</span>
                      <span className="font-mono">{janPoints.nextLevelPoints} to next level</span>
                    </div>
                    <Progress value={((500 - janPoints.nextLevelPoints) / 500) * 100} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="font-bold text-green-600">{janPoints.earned}</p>
                      <p className="text-xs text-green-600">Earned</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-bold text-blue-600">{janPoints.redeemed}</p>
                      <p className="text-xs text-blue-600">Redeemed</p>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Wallet className="h-4 w-4 mr-2" />
                    Redeem Points
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <QrCode className="h-4 w-4 mr-2" />
                    Scan QR Beacon
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Evidence
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mic className="h-4 w-4 mr-2" />
                    Voice Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Land Services</CardTitle>
                    <CardDescription>Mutation, registry, ULPIN services</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    Pay Mutation Fee
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Download Title Certificate
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Check ULPIN Status
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Payments</CardTitle>
                    <CardDescription>Fees, fines, and government dues</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    Property Tax
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Water Bill
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Trade License Fee
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Grievances</CardTitle>
                    <CardDescription>File complaints and track status</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    File New Complaint
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Track Existing Issues
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    RTI Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Services */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent service interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { service: "Mutation Fee Payment", status: "Completed", date: "22 Jul 2025", amount: "₹300" },
                  { service: "Property Tax", status: "Pending", date: "20 Jul 2025", amount: "₹1,200" },
                  { service: "Grievance #GT2025001", status: "In Progress", date: "18 Jul 2025", amount: "-" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{item.service}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={item.status === "Completed" ? "default" :
                                item.status === "Pending" ? "secondary" : "outline"}
                      >
                        {item.status}
                      </Badge>
                      {item.amount !== "-" && (
                        <p className="text-sm font-medium mt-1">{item.amount}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile & Wallet Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your citizen profile and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/api/placeholder/100/100" />
                      <AvatarFallback>PK</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-medium">Prakash Kumar</h3>
                      <p className="text-sm text-muted-foreground">Farmer • Gadag, Karnataka</p>
                      <p className="text-sm text-muted-foreground">Mobile: +91 98765 43210</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Aadhaar (Last 4 digits)</label>
                      <p className="text-sm">****1234</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Preferred Language</label>
                      <p className="text-sm">Kannada</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline">
                      <Globe className="h-4 w-4 mr-2" />
                      Language Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Accessibility Features</CardTitle>
                  <CardDescription>Jan-Darpan inclusion features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex-col">
                      <Mic className="h-6 w-6 mb-2" />
                      <span className="text-sm">Voice Assistant</span>
                      <span className="text-xs text-muted-foreground">"Hey Jan-Darpan..."</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col">
                      <Phone className="h-6 w-6 mb-2" />
                      <span className="text-sm">SMS Fallback</span>
                      <span className="text-xs text-muted-foreground">Send to 14545</span>
                    </Button>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-1">22-Language Support</h4>
                    <p className="text-sm text-blue-700">Interface available in all official languages</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Jan-Points Wallet</CardTitle>
                  <CardDescription>Polygon PoS blockchain tokens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg">
                    <div className="text-2xl font-bold">{janPoints.balance}</div>
                    <p className="text-sm opacity-90">Jan-Points (ERC-20)</p>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Redeem for Services
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Transfer Points
                    </Button>
                    <Button className="w-full" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Transaction History
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• 1 Point = ₹1 in government services</p>
                    <p>• Minimum redemption: 50 points</p>
                    <p>• Points expire in 2 years</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">First Verifier</p>
                      <p className="text-xs text-muted-foreground">Completed 1st mission</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Local Hero</p>
                      <p className="text-xs text-muted-foreground">50+ verifications</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                    <Heart className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Community Champion</p>
                      <p className="text-xs text-muted-foreground">Top 10% in district</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                <p className="text-muted-foreground">{selectedProject.owner}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedProject(null)}
              >
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Project Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedProject.budget}</div>
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedProject.completionPercentage}%</div>
                    <p className="text-sm text-muted-foreground">Completion</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedProject.spi}</div>
                    <p className="text-sm text-muted-foreground">SPI Score</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Information for Bhu-Setu */}
              {selectedProject.id === "bhu-setu-2" && (
                <div className="space-y-6">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-6">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="budget">Budget & Contracts</TabsTrigger>
                      <TabsTrigger value="map">Live Map</TabsTrigger>
                      <TabsTrigger value="proof">Proof-of-Work</TabsTrigger>
                      <TabsTrigger value="services">Services</TabsTrigger>
                      <TabsTrigger value="discussion">Discussion</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Project Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            {[
                              { phase: "DPR Approval", status: "completed", date: "Mar 2024" },
                              { phase: "State MoU Signed", status: "completed", date: "Jun 2024" },
                              { phase: "ULPIN API Development", status: "in-progress", date: "Aug 2025" },
                              { phase: "Blockchain Integration", status: "upcoming", date: "Oct 2025" },
                              { phase: "Full Rollout", status: "upcoming", date: "Dec 2025" }
                            ].map((milestone, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div className={cn(
                                  "h-3 w-3 rounded-full",
                                  milestone.status === "completed" ? "bg-green-500" :
                                  milestone.status === "in-progress" ? "bg-blue-500" : "bg-gray-300"
                                )}></div>
                                <div className="flex-1">
                                  <p className="font-medium">{milestone.phase}</p>
                                  <p className="text-sm text-muted-foreground">{milestone.date}</p>
                                </div>
                                <Badge variant={
                                  milestone.status === "completed" ? "default" :
                                  milestone.status === "in-progress" ? "secondary" : "outline"
                                }>
                                  {milestone.status.replace("-", " ")}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Key Performance Indicators</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Parcels Digitized</span>
                                <span className="font-mono">2.4M / 5.7M</span>
                              </div>
                              <Progress value={42} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Revenue Generated</span>
                                <span className="font-mono">₹847 Cr / ₹2000 Cr</span>
                              </div>
                              <Progress value={42} className="h-2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="budget" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Budget Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {[
                              { category: "Technology Infrastructure", allocated: 4200, spent: 2100 },
                              { category: "State Implementation", allocated: 3800, spent: 1900 },
                              { category: "Training & Capacity Building", allocated: 1400, spent: 700 },
                              { category: "Change Management", allocated: 1000, spent: 400 }
                            ].map((item, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="font-medium">{item.category}</span>
                                  <span className="text-sm">₹{item.spent}Cr / ₹{item.allocated}Cr</span>
                                </div>
                                <Progress value={(item.spent / item.allocated) * 100} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Contract Documents</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {[
                            { name: "Detailed Project Report (DPR)", size: "45.2 MB", type: "PDF" },
                            { name: "State MoU - Karnataka", size: "12.8 MB", type: "PDF" },
                            { name: "Technical Specifications", size: "23.4 MB", type: "PDF" },
                            { name: "Procurement Guidelines", size: "8.7 MB", type: "PDF" }
                          ].map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-red-600" />
                                <div>
                                  <p className="font-medium text-sm">{doc.name}</p>
                                  <p className="text-xs text-muted-foreground">{doc.size} • {doc.type}</p>
                                </div>
                              </div>
                              <Button size="sm" variant="outline">Download</Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="map" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Digital Twin & GIS View</CardTitle>
                          <CardDescription>Real-time view of digitized parcels</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-video bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white">
                            <div className="text-center">
                              <MapPin className="h-16 w-16 mx-auto mb-4" />
                              <h3 className="text-xl font-bold">Interactive Map View</h3>
                              <p className="text-sm opacity-90">Gadag District - 42% Parcels Digitized</p>
                              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                <div>
                                  <div className="text-2xl font-bold">2,847</div>
                                  <div className="text-xs">Completed</div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold">1,234</div>
                                  <div className="text-xs">In Progress</div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold">3,692</div>
                                  <div className="text-xs">Pending</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="proof" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Citizen Verification Feed</CardTitle>
                          <CardDescription>Community-verified proof of work</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {[
                            { user: "Prakash K.", action: "Verified parcel boundary P-1047", reward: 15, time: "2 hours ago" },
                            { user: "Anita M.", action: "Uploaded survey stone photo", reward: 10, time: "4 hours ago" },
                            { user: "Rajesh S.", action: "Confirmed ULPIN generation", reward: 20, time: "6 hours ago" },
                            { user: "Sunita D.", action: "Validated mutation document", reward: 12, time: "8 hours ago" }
                          ].map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{activity.user}</p>
                                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-green-600">+{activity.reward} Points</p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="services" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Available Services</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Button className="w-full justify-start" variant="outline">
                              <DollarSign className="h-4 w-4 mr-2" />
                              Pay Mutation Fee (₹300)
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                              <FileText className="h-4 w-4 mr-2" />
                              Download Title Certificate
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Check ULPIN Status
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                              <Camera className="h-4 w-4 mr-2" />
                              Upload Boundary Photo
                            </Button>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between">
                              <span>Avg Processing Time</span>
                              <span className="font-bold">3.2 days</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Success Rate</span>
                              <span className="font-bold">94.7%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Digital Adoption</span>
                              <span className="font-bold">78%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Citizen Satisfaction</span>
                              <span className="font-bold">4.7★</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="discussion" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Public Discussion & FAQ</CardTitle>
                          <CardDescription>Community questions and official responses</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {[
                            {
                              question: "When will ULPIN be available for all parcels in Gadag?",
                              answer: "We are targeting 100% coverage by December 2025. Currently 42% completed.",
                              votes: 24,
                              official: true
                            },
                            {
                              question: "How can I verify my land boundary using AR?",
                              answer: "Download the Jan-Darpan app, enable camera access, and follow AR overlay instructions.",
                              votes: 18,
                              official: true
                            },
                            {
                              question: "What documents are needed for mutation?",
                              answer: "Sale deed, Aadhaar card, previous title documents, and survey settlement records.",
                              votes: 15,
                              official: false
                            }
                          ].map((item, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center gap-1">
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    ▲
                                  </Button>
                                  <span className="text-sm font-bold">{item.votes}</span>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    ▼
                                  </Button>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium mb-2">{item.question}</h4>
                                  <p className="text-sm text-muted-foreground mb-2">{item.answer}</p>
                                  {item.official && (
                                    <Badge variant="secondary" className="text-xs">
                                      <Shield className="h-3 w-3 mr-1" />
                                      Official Response
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {/* Generic project view for non-Bhu-Setu projects */}
              {selectedProject.id !== "bhu-setu-2" && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{selectedProject.description}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Current Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Next Milestone</span>
                          <span className="font-medium">{selectedProject.nextMilestone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Target Date</span>
                          <span className="font-medium">{selectedProject.milestoneDate}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Overall Progress</span>
                            <span className="font-mono">{selectedProject.completionPercentage}%</span>
                          </div>
                          <Progress value={selectedProject.completionPercentage} className="h-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
