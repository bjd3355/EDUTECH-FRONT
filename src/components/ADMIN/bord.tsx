"use client";

import React, { useState } from "react";
import {
  Users,
  BookOpen,
  Calendar,
  Video,
  Bell,
  AlertTriangle,
  TrendingUp,
  BarChart2,
  PieChartIcon,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Filter,
  Download,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Share2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardProps,
} from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Définition des couleurs personnalisées
const PRIMARY_COLOR = "#2CB3C2";
const SECONDARY_COLOR = "#10b981";
const TERTIARY_COLOR = "#f59e0b";
const QUATERNARY_COLOR = "#8b5cf6";
const ERROR_COLOR = "#ef4444";
const SUCCESS_COLOR = "#22c55e";
const WARNING_COLOR = "#f59e0b";
const INFO_COLOR = "#3b82f6";

// Types pour les données du dashboard
type StatCardType = {
  id: string;
  title: string;
  value: number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

type AlertType = "warning" | "error" | "info" | "success";

type AlertItemType = {
  id: string;
  title: string;
  description: string;
  type: AlertType;
  timestamp: string;
  isRead: boolean;
};

type EnrollmentDataType = {
  month: string;
  students: number;
  professors: number;
};

type CourseAttendanceDataType = {
  course: string;
  attendance: number;
  expected: number;
  actual: number;
};

type FiliereDataType = {
  id: string;
  name: string;
  students: number;
  color: string;
  campus: string[];
};

type CampusDataType = {
  id: string;
  name: string;
  students: number;
  professors: number;
  courses: number;
};

type ConflictType = {
  id: string;
  filiere: string;
  campus: string;
  cours: string;
  date: string;
  heure: string;
  status: "non-resolu" | "en-attente" | "resolu";
  professeurs: string[];
  details?: string;
};

type ActivityType = {
  id: string;
  action: string;
  user: string;
  time: string;
  color: string;
};

// Données de démonstration
const statCards: StatCardType[] = [
  { id: "students", title: "Étudiants", value: 2500, change: 5, icon: Users, color: PRIMARY_COLOR },
  { id: "professors", title: "Professeurs", value: 102, change: 2, icon: BookOpen, color: SECONDARY_COLOR },
  { id: "schedules", title: "Emplois du temps", value: 120, change: 10, icon: Calendar, color: TERTIARY_COLOR },
  { id: "sessions", title: "Sessions actives", value: 15, change: -3, icon: Video, color: QUATERNARY_COLOR },
];

const alerts: AlertItemType[] = [
  {
    id: "alert-1",
    title: "Conflit d'emploi du temps détecté",
    description: "Génie Civil et Génie Informatique programmés simultanément au Campus 1",
    type: "error",
    timestamp: "Il y a 30 min",
    isRead: false,
  },
  {
    id: "alert-2",
    title: "Validation en attente",
    description: "8 emplois du temps pour le Campus 2 nécessitent une validation",
    type: "warning",
    timestamp: "Il y a 2 heures",
    isRead: false,
  },
  {
    id: "alert-3",
    title: "Absence signalée",
    description: "Professeur de Marketing indisponible ce jour",
    type: "info",
    timestamp: "Il y a 5 heures",
    isRead: true,
  },
  {
    id: "alert-4",
    title: "Nouveau semestre préparé",
    description: "Les emplois du temps du prochain semestre sont prêts pour vérification",
    type: "success",
    timestamp: "Hier, 18:30",
    isRead: true,
  },
];

const enrollmentData: EnrollmentDataType[] = [
  { month: "Jan", students: 2000, professors: 98 },
  { month: "Fév", students: 2050, professors: 98 },
  { month: "Mar", students: 2100, professors: 99 },
  { month: "Avr", students: 2200, professors: 100 },
  { month: "Mai", students: 2250, professors: 100 },
  { month: "Juin", students: 2300, professors: 101 },
  { month: "Juil", students: 2320, professors: 101 },
  { month: "Août", students: 2350, professors: 101 },
  { month: "Sep", students: 2400, professors: 102 },
  { month: "Oct", students: 2450, professors: 102 },
  { month: "Nov", students: 2480, professors: 102 },
  { month: "Déc", students: 2500, professors: 102 },
];

const courseAttendanceData: CourseAttendanceDataType[] = [
  { course: "Génie Civil", attendance: 90, expected: 180, actual: 162 },
  { course: "Génie Informatique", attendance: 88, expected: 150, actual: 132 },
  { course: "Ressources Humaines", attendance: 85, expected: 120, actual: 102 },
  { course: "Marketing", attendance: 92, expected: 90, actual: 83 },
  { course: "Comptabilité", attendance: 87, expected: 110, actual: 96 },
];

const filiereData: FiliereDataType[] = [
  { id: "gc", name: "Génie Civil", students: 300, color: PRIMARY_COLOR, campus: ["Campus 1", "Campus 3"] },
  { id: "gi", name: "Génie Informatique", students: 280, color: "#10b981", campus: ["Campus 1", "Campus 2"] },
  { id: "rh", name: "Ressources Humaines", students: 200, color: "#f59e0b", campus: ["Campus 2", "Campus 4"] },
  { id: "tl", name: "Transport et Logistique", students: 220, color: "#8b5cf6", campus: ["Campus 3"] },
  { id: "ci", name: "Commerce International", students: 210, color: "#ef4444", campus: ["Campus 2", "Campus 4"] },
  { id: "ms", name: "Marketing et Stratégie", students: 230, color: "#6b7280", campus: ["Campus 1", "Campus 4"] },
  { id: "hqse", name: "HQSE", students: 180, color: "#d946ef", campus: ["Campus 3"] },
  { id: "bf", name: "Banque et Finances", students: 250, color: "#14b8a6", campus: ["Campus 2"] },
  { id: "cg", name: "Comptabilité et Gestion", students: 240, color: "#84cc16", campus: ["Campus 1", "Campus 4"] },
  { id: "com", name: "Communication", students: 190, color: "#f97316", campus: ["Campus 2"] },
  { id: "pme", name: "Entreprise et PME", students: 200, color: "#a855f7", campus: ["Campus 4"] },
  { id: "ma", name: "Management des Affaires", students: 190, color: "#ec4899", campus: ["Campus 1", "Campus 3"] },
];

const campusData: CampusDataType[] = [
  { id: "c1", name: "Campus 1", students: 850, professors: 32, courses: 40 },
  { id: "c2", name: "Campus 2", students: 720, professors: 28, courses: 35 },
  { id: "c3", name: "Campus 3", students: 540, professors: 22, courses: 25 },
  { id: "c4", name: "Campus 4", students: 390, professors: 20, courses: 20 },
];

const conflicts: ConflictType[] = [
  {
    id: "conf-1",
    filiere: "Génie Civil",
    campus: "Campus 1",
    cours: "Structure",
    date: "Lun 31 Mar",
    heure: "10h-12h",
    status: "non-resolu",
    professeurs: ["Dr. Amadou Diop", "Dr. Fatou Ndiaye"],
    details:
      "Conflit entre deux cours programmés dans la même salle (A102). Le cours de Structure pour Génie Civil et le cours de Programmation pour Génie Informatique sont prévus au même moment.",
  },
  {
    id: "conf-2",
    filiere: "Génie Informatique",
    campus: "Campus 1",
    cours: "Programmation",
    date: "Lun 31 Mar",
    heure: "10h-12h",
    status: "non-resolu",
    professeurs: ["Dr. Omar Sène", "Mme. Aïssatou Ba"],
    details:
      "Conflit entre deux cours programmés dans la même salle (A102). Le cours de Structure pour Génie Civil et le cours de Programmation pour Génie Informatique sont prévus au même moment.",
  },
  {
    id: "conf-3",
    filiere: "Marketing",
    campus: "Campus 3",
    cours: "Stratégie",
    date: "Mar 1 Avr",
    heure: "14h-16h",
    status: "en-attente",
    professeurs: ["M. Ibrahima Fall"],
    details:
      "Le professeur M. Ibrahima Fall a signalé un problème potentiel avec la salle B205 qui pourrait être en rénovation à cette date.",
  },
  {
    id: "conf-4",
    filiere: "Commerce International",
    campus: "Campus 2",
    cours: "Économie mondiale",
    date: "Mer 2 Avr",
    heure: "08h-10h",
    status: "en-attente",
    professeurs: ["Dr. Mariama Sall", "M. Cheikh Diagne"],
    details:
      "Deux professeurs sont assignés au même cours, mais Dr. Mariama Sall a indiqué qu'elle pourrait être en mission à l'étranger à cette date.",
  },
  {
    id: "conf-5",
    filiere: "Ressources Humaines",
    campus: "Campus 4",
    cours: "Droit du travail",
    date: "Jeu 3 Avr",
    heure: "15h-17h",
    status: "resolu",
    professeurs: ["Me. Aminata Diallo"],
    details: "Le conflit a été résolu en déplaçant le cours dans la salle C301 au lieu de C201.",
  },
];

const activities: ActivityType[] = [
  {
    id: "act-1",
    action: "Validation d'emploi du temps",
    user: "Admin Diop",
    time: "Il y a 20 min",
    color: PRIMARY_COLOR,
  },
  {
    id: "act-2",
    action: "Ajout d'un nouveau professeur",
    user: "Admin Sall",
    time: "Il y a 45 min",
    color: SECONDARY_COLOR,
  },
  {
    id: "act-3",
    action: "Annulation de cours",
    user: "Admin Ndiaye",
    time: "Il y a 1h",
    color: ERROR_COLOR,
  },
  {
    id: "act-4",
    action: "Modification de salle",
    user: "Admin Ba",
    time: "Il y a 2h",
    color: WARNING_COLOR,
  },
  {
    id: "act-5",
    action: "Ajout d'un nouvel étudiant",
    user: "Admin Diallo",
    time: "Il y a 3h",
    color: SUCCESS_COLOR,
  },
  {
    id: "act-6",
    action: "Mise à jour du programme",
    user: "Admin Gueye",
    time: "Il y a 4h",
    color: INFO_COLOR,
  },
];

// Composant principal du dashboard
export default function DashboardOverview() {
  // États
  const [activeChartTab, setActiveChartTab] = useState<"enrollment" | "attendance" | "distribution" | "campus">(
    "enrollment"
  );
  const [unreadAlerts, setUnreadAlerts] = useState<number>(alerts.filter((alert) => !alert.isRead).length);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedConflict, setSelectedConflict] = useState<ConflictType | null>(null);
  const [showAllConflicts, setShowAllConflicts] = useState<boolean>(false);
  const [showAllAlerts, setShowAllAlerts] = useState<boolean>(false);
  const [showAllActivities, setShowAllActivities] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const { toast } = useToast();

  // Fonctions
  const markAllAlertsAsRead = () => {
    setUnreadAlerts(0);
    toast({
      title: "Notifications",
      description: "Toutes les notifications ont été marquées comme lues",
    });
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Exportation réussie",
        description: "Le rapport a été exporté au format PDF",
      });
    }, 1500);
  };

  const handlePublishToAgenda = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      toast({
        title: "Publication réussie",
        description: "Les emplois du temps ont été publiés sur Google Agenda",
      });
    }, 1500);
  };

  const handleViewConflictDetails = (conflict: ConflictType) => {
    setSelectedConflict(conflict);
  };

  const handleResolveConflict = (conflictId: string) => {
    toast({
      title: "Conflit résolu",
      description: `Le conflit #${conflictId} a été marqué comme résolu`,
    });
    setSelectedConflict(null);
  };

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const displayedConflicts = showAllConflicts ? conflicts : conflicts.slice(0, 3);
  const displayedAlerts = showAllAlerts ? alerts : alerts.slice(0, 3);
  const displayedActivities = showAllActivities ? activities : activities.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="p-4 md:p-6 space-y-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard UNI-PRO</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble des 4 campus |{" "}
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Input
                className="pl-9 w-[200px] md:w-[300px]"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                  {unreadAlerts > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                      {unreadAlerts}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[380px]">
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Notifications récentes</span>
                  <Button variant="ghost" size="sm" onClick={markAllAlertsAsRead}>
                    Tout marquer comme lu
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                  {alerts.map((alert) => (
                    <DropdownMenuItem
                      key={alert.id}
                      className={cn("flex flex-col items-start gap-1 p-3", !alert.isRead && "bg-accent/40")}
                    >
                      <div className="flex justify-between w-full">
                        <div className="flex items-center gap-2">
                          {alert.type === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                          {alert.type === "warning" && <AlertCircle className="h-4 w-4 text-amber-500" />}
                          {alert.type === "info" && <Bell className="h-4 w-4 text-blue-500" />}
                          {alert.type === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          <span className="font-medium">{alert.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </DropdownMenuItem>
                  ))}
                </ScrollArea>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="justify-center font-medium cursor-pointer"
                  onClick={() => setShowAllAlerts(true)}
                >
                  Voir toutes les notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="bg-[var(--primary-color)] border-[var(--primary-color)]"
            >
              {isExporting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Exportation...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter (PDF)
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statCards.map((stat) => (
            <Card
              key={stat.id}
              className="overflow-hidden border-t-4"
              style={{ "--border-top-color": stat.color } as React.CSSProperties}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className="p-2 rounded-full text-white" style={{ backgroundColor: stat.color }}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold">{formatNumber(stat.value)}</div>
                <div className="flex items-center mt-1 text-xs">
                  {stat.change > 0 ? (
                    <div className="flex items-center text-green-600">
                      <ArrowUp className="h-3 w-3 mr-1" />+{stat.change}%
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      {stat.change}%
                    </div>
                  )}
                  <span className="text-muted-foreground ml-1">depuis le mois dernier</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content - Two columns layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts - Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Charts Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Statistiques et Analyses</CardTitle>
                    <CardDescription>Visualisation des données clés à travers tous les campus</CardDescription>
                  </div>
                  <Tabs
                    defaultValue="enrollment"
                    className="w-full max-w-[400px]"
                    value={activeChartTab}
                    onValueChange={(value) =>
                      setActiveChartTab(value as "enrollment" | "attendance" | "distribution" | "campus")
                    }
                  >
                    <TabsList className="grid grid-cols-4 h-9">
                      <TabsTrigger value="enrollment" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1 md:mr-2" />
                        <span className="hidden md:inline">Inscriptions</span>
                      </TabsTrigger>
                      <TabsTrigger value="attendance" className="text-xs">
                        <BarChart2 className="h-3 w-3 mr-1 md:mr-2" />
                        <span className="hidden md:inline">Présence</span>
                      </TabsTrigger>
                      <TabsTrigger value="distribution" className="text-xs">
                        <PieChartIcon className="h-3 w-3 mr-1 md:mr-2" />
                        <span className="hidden md:inline">Filières</span>
                      </TabsTrigger>
                      <TabsTrigger value="campus" className="text-xs">
                        <Users className="h-3 w-3 mr-1 md:mr-2" />
                        <span className="hidden md:inline">Campus</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] mt-4">
                  {activeChartTab === "enrollment" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={enrollmentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={PRIMARY_COLOR} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={PRIMARY_COLOR} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorProfessors" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={SECONDARY_COLOR} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={SECONDARY_COLOR} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            formatNumber(value),
                            name === "students" ? "Étudiants" : "Professeurs",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="students"
                          stroke={PRIMARY_COLOR}
                          fillOpacity={1}
                          fill="url(#colorStudents)"
                          name="Étudiants"
                        />
                        <Area
                          type="monotone"
                          dataKey="professors"
                          stroke={SECONDARY_COLOR}
                          fillOpacity={1}
                          fill="url(#colorProfessors)"
                          name="Professeurs"
                        />
                        <Legend />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}

                  {activeChartTab === "attendance" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={courseAttendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="course" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip
                          formatter={(value: number, name: string) =>
                            name === "attendance"
                              ? [`${value}%`, "Taux de présence"]
                              : [formatNumber(value), name === "expected" ? "Étudiants attendus" : "Étudiants présents"]
                          }
                        />
                        <Bar dataKey="attendance" name="Taux de présence" fill={PRIMARY_COLOR} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expected" name="Étudiants attendus" fill="#d1d5db" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="actual" name="Étudiants présents" fill={SECONDARY_COLOR} radius={[4, 4, 0, 0]} />
                        <Legend />
                      </BarChart>
                    </ResponsiveContainer>
                  )}

                  {activeChartTab === "distribution" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={filiereData}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          innerRadius={60}
                          dataKey="students"
                          nameKey="name"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          labelLine={true}
                        >
                          {filiereData.map((entry) => (
                            <Cell key={`cell-${entry.id}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => [formatNumber(value), name]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}

                  {activeChartTab === "campus" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={campusData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                        <XAxis type="number" axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            formatNumber(value),
                            name === "students" ? "Étudiants" : name === "professors" ? "Professeurs" : "Cours",
                          ]}
                        />
                        <Bar dataKey="students" name="Étudiants" fill={PRIMARY_COLOR} barSize={20} />
                        <Bar dataKey="professors" name="Professeurs" fill={SECONDARY_COLOR} barSize={20} />
                        <Bar dataKey="courses" name="Cours" fill={TERTIARY_COLOR} barSize={20} />
                        <Legend />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Conflicts Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-red-500" />
                    Conflits d'emplois du temps
                  </CardTitle>
                  <CardDescription>Liste des conflits détectés et leur statut actuel</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 p-3 bg-muted/50 font-medium text-sm">
                    <div className="col-span-2">Filière</div>
                    <div className="col-span-2">Campus</div>
                    <div className="col-span-2">Cours</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Heure</div>
                    <div className="col-span-2">Statut</div>
                  </div>
                  {displayedConflicts.map((conflict) => (
                    <div
                      key={conflict.id}
                      className="grid grid-cols-12 p-3 text-sm border-t hover:bg-muted/20 cursor-pointer"
                      onClick={() => handleViewConflictDetails(conflict)}
                    >
                      <div className="col-span-2 font-medium">{conflict.filiere}</div>
                      <div className="col-span-2">{conflict.campus}</div>
                      <div className="col-span-2">{conflict.cours}</div>
                      <div className="col-span-2">{conflict.date}</div>
                      <div className="col-span-2">{conflict.heure}</div>
                      <div className="col-span-2">
                        {conflict.status === "non-resolu" && (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Non résolu
                          </Badge>
                        )}
                        {conflict.status === "en-attente" && (
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            En attente
                          </Badge>
                        )}
                        {conflict.status === "resolu" && (
                          <Badge variant="outline" className="gap-1 bg-green-100 text-green-800 hover:bg-green-100/80">
                            <CheckCircle2 className="h-3 w-3" />
                            Résolu
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => setShowAllConflicts(!showAllConflicts)}>
                  {showAllConflicts ? "Réduire la liste" : "Voir tous les conflits"}
                </Button>
                <Button
                  size="sm"
                  onClick={handlePublishToAgenda}
                  disabled={isPublishing}
                  className="bg-[var(--primary-color)] border-[var(--primary-color)]"
                >
                  {isPublishing ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Publication...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Publier sur Google Agenda
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar - Alerts and Quick Info */}
          <div className="space-y-6">
            {/* Alerts Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Alertes et notifications
                </CardTitle>
                <CardDescription>Informations importantes nécessitant votre attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[280px] pr-4">
                  <div className="space-y-3">
                    {displayedAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={cn(
                          "border rounded-md p-3 transition-colors relative",
                          alert.type === "error" &&
                            "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-900/50",
                          alert.type === "warning" &&
                            "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900/50",
                          alert.type === "info" &&
                            "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900/50",
                          alert.type === "success" &&
                            "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-900/50",
                          !alert.isRead && "pl-5"
                        )}
                      >
                        {!alert.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-current"></div>}
                        <div className="font-medium flex items-center gap-2">
                          {alert.type === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                          {alert.type === "warning" && <AlertCircle className="h-4 w-4 text-amber-500" />}
                          {alert.type === "info" && <Bell className="h-4 w-4 text-blue-500" />}
                          {alert.type === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {alert.title}
                        </div>
                        <div className="text-sm mt-1">{alert.description}</div>
                        <div className="text-xs mt-2 text-muted-foreground flex justify-between items-center">
                          <span>{alert.timestamp}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="-mr-2 h-7 text-xs"
                            onClick={() => {
                              toast({
                                title: alert.title,
                                description: alert.description,
                              });
                            }}
                          >
                            Détails <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setShowAllAlerts(!showAllAlerts)}>
                  {showAllAlerts ? "Réduire la liste" : "Voir toutes les alertes"}
                </Button>
              </CardFooter>
            </Card>

            {/* Campus Distribution Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Distribution par campus</CardTitle>
                <CardDescription>Répartition des étudiants et cours</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={campusData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatNumber(value),
                        name === "students" ? "Étudiants" : name === "courses" ? "Cours" : "Professeurs",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke={PRIMARY_COLOR}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="courses"
                      stroke={TERTIARY_COLOR}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="mt-4 space-y-2">
                  {campusData.map((campus) => (
                    <div key={campus.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIMARY_COLOR }}></div>
                        <span className="text-sm font-medium ml-2">{campus.name}</span>
                      </div>
                      <div className="text-sm">{formatNumber(campus.students)} étudiants</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Activité récente</CardTitle>
                <CardDescription>Dernières actions des administrateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 relative before:absolute before:h-full before:w-0.5 before:bg-muted before:left-1.5 before:top-0">
                  {displayedActivities.map((activity) => (
                    <div key={activity.id} className="pl-6 relative">
                      <div
                        className="absolute left-0 top-1 h-3 w-3 rounded-full ring-4 ring-background"
                        style={{ backgroundColor: activity.color }}
                      ></div>
                      <div className="text-sm font-medium">{activity.action}</div>
                      <div className="text-xs text-muted-foreground">
                        Par {activity.user} · {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowAllActivities(!showAllActivities)}
                >
                  {showAllActivities ? "Réduire la liste" : "Voir tout l'historique"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog pour les détails de conflit */}
      <Dialog open={!!selectedConflict} onOpenChange={(open) => !open && setSelectedConflict(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Détails du conflit</DialogTitle>
            <DialogDescription>Informations complètes sur le conflit d'emploi du temps</DialogDescription>
          </DialogHeader>
          {selectedConflict && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Filière</h4>
                  <p className="text-sm">{selectedConflict.filiere}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Campus</h4>
                  <p className="text-sm">{selectedConflict.campus}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Cours</h4>
                  <p className="text-sm">{selectedConflict.cours}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date et heure</h4>
                  <p className="text-sm">
                    {selectedConflict.date}, {selectedConflict.heure}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Professeurs concernés</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedConflict.professeurs.map((prof, index) => (
                    <Badge key={index} variant="secondary">
                      {prof}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Statut</h4>
                <div className="mt-1">
                  {selectedConflict.status === "non-resolu" && (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Non résolu
                    </Badge>
                  )}
                  {selectedConflict.status === "en-attente" && (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      En attente
                    </Badge>
                  )}
                  {selectedConflict.status === "resolu" && (
                    <Badge variant="outline" className="gap-1 bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3 w-3" />
                      Résolu
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                <p className="text-sm mt-1">{selectedConflict.details}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedConflict && selectedConflict.status !== "resolu" && (
              <Button
                variant="outline"
                onClick={() => handleResolveConflict(selectedConflict.id)}
                className="bg-[var(--primary-color)] border-[var(--primary-color)] text-white"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Marquer comme résolu
              </Button>
            )}
            <Button variant="outline" onClick={() => setSelectedConflict(null)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour voir toutes les alertes */}
      <Dialog open={showAllAlerts} onOpenChange={setShowAllAlerts}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Toutes les alertes</DialogTitle>
            <DialogDescription>Liste complète des alertes et notifications</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "border rounded-md p-3 transition-colors relative",
                    alert.type === "error" && "bg-red-50 border-red-200 text-red-800",
                    alert.type === "warning" && "bg-amber-50 border-amber-200 text-amber-800",
                    alert.type === "info" && "bg-blue-50 border-blue-200 text-blue-800",
                    alert.type === "success" && "bg-green-50 border-green-200 text-green-800",
                    !alert.isRead && "pl-5"
                  )}
                >
                  {!alert.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-current"></div>}
                  <div className="font-medium flex items-center gap-2">
                    {alert.type === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                    {alert.type === "warning" && <AlertCircle className="h-4 w-4 text-amber-500" />}
                    {alert.type === "info" && <Bell className="h-4 w-4 text-blue-500" />}
                    {alert.type === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {alert.title}
                  </div>
                  <div className="text-sm mt-1">{alert.description}</div>
                  <div className="text-xs mt-2 text-muted-foreground">{alert.timestamp}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAllAlerts(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}