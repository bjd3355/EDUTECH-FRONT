import React, { useState, useEffect } from "react";
import { Calendar, Clock, Users, Video, MessageSquare, Search, Filter, ChevronDown, Play, Pause, Download, Eye, BarChart2, Plus, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

// Types (inchangés)
type ClassStatus = "scheduled" | "live" | "completed" | "cancelled";

interface Participant {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "assistant";
  attendance: number;
  lastActive?: Date;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  isPrivate: boolean;
}

interface Recording {
  id: string;
  title: string;
  duration: number;
  size: number;
  createdAt: Date;
  url: string;
  viewCount: number;
}

interface VirtualClass {
  id: string;
  title: string;
  description: string;
  status: ClassStatus;
  startTime: Date;
  endTime: Date;
  teacher: string;
  participants: Participant[];
  maxParticipants: number;
  recordings: Recording[];
  chatHistory: ChatMessage[];
  tags: string[];
}

// Mock data (inchangé)
const mockClasses: VirtualClass[] = Array.from({ length: 15 }, (_, i) => {
  const now = new Date();
  const startTime = new Date(now);
  startTime.setDate(now.getDate() + (i % 7) - 3);
  startTime.setHours(9 + (i % 8), 0, 0);
  
  const endTime = new Date(startTime);
  endTime.setHours(startTime.getHours() + 1 + (i % 3));
  
  const status = i === 2 ? "live" : startTime > now ? "scheduled" : i % 10 === 0 ? "cancelled" : "completed";
  
  const participants = Array.from({ length: 5 + (i % 20) }, (_, j) => ({
    id: `p-${i}-${j}`,
    name: j === 0 ? "Prof. Ndiaye" : j === 1 ? "Ass. Diop" : `Étudiant ${j + 1} Fall`,
    email: j === 0 ? "ndiaye@univ.sn" : j === 1 ? "diop@univ.sn" : `etudiant${j + 1}@univ.sn`,
    role: j === 0 ? "teacher" : j === 1 ? "assistant" : "student" as "student" | "teacher" | "assistant",
    attendance: Math.floor(Math.random() * 100),
    lastActive: status === "live" ? new Date() : undefined
  }));
  
  const recordings = status === "scheduled" ? [] : Array.from({ length: status === "live" ? 1 : 1 + (i % 3) }, (_, k) => ({
    id: `rec-${i}-${k}`,
    title: `Enregistrement ${k + 1} - Cours ${i + 1}`,
    duration: 15 + (k * 10) + (i % 30),
    size: Math.floor(Math.random() * 500) + 50,
    createdAt: new Date(startTime),
    url: "#",
    viewCount: Math.floor(Math.random() * 100)
  }));
  
  const chatHistory = status === "scheduled" ? [] : Array.from({ length: 10 + (i % 40) }, (_, m) => {
    const chatTime = new Date(startTime);
    chatTime.setMinutes(startTime.getMinutes() + m * 2);
    return {
      id: `chat-${i}-${m}`,
      userId: `user-${m % participants.length}`,
      userName: m % participants.length === 0 ? "Prof. Ndiaye" : `Étudiant ${(m % participants.length) + 1} Fall`,
      message: `Message exemple ${m + 1} pour le cours ${i + 1}`,
      timestamp: chatTime,
      isPrivate: m % 7 === 0
    };
  });
  
  return {
    id: `class-${i}`,
    title: `Cours Virtuel ${i + 1}`,
    description: `Cours animé par le professeur sur des sujets clés du programme.`,
    status,
    startTime,
    endTime,
    teacher: `Prof. ${["Sow", "Ba", "Gueye", "Diallo", "Faye"][i % 5]}`,
    participants,
    maxParticipants: 30,
    recordings,
    chatHistory,
    tags: [`Module ${i % 5 + 1}`, `Niveau ${i % 3 + 1}`, i % 2 === 0 ? "Examen" : "Révision"]
  };
});

// Main component
const ClasseVirtuelle = () => {
  // State
  const [classes, setClasses] = useState<VirtualClass[]>(mockClasses);
  const [filteredClasses, setFilteredClasses] = useState<VirtualClass[]>(mockClasses);
  const [selectedClass, setSelectedClass] = useState<VirtualClass | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<ClassStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"create" | "edit" | "delete">("create");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"date" | "title" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [participantSearch, setParticipantSearch] = useState<string>("");
  const [chatSearch, setChatSearch] = useState<string>("");
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  // Effects (inchangé)
  useEffect(() => {
    let result = [...classes];
    
    if (searchTerm) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.teacher.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      result = result.filter(c => c.status === statusFilter);
    }
    
    const now = new Date();
    if (dateFilter === "today") {
      result = result.filter(c => 
        c.startTime.getDate() === now.getDate() &&
        c.startTime.getMonth() === now.getMonth() &&
        c.startTime.getFullYear() === now.getFullYear()
      );
    } else if (dateFilter === "week") {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      result = result.filter(c => c.startTime >= weekStart && c.startTime < weekEnd);
    } else if (dateFilter === "month") {
      result = result.filter(c => 
        c.startTime.getMonth() === now.getMonth() &&
        c.startTime.getFullYear() === now.getFullYear()
      );
    }
    
    result.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" 
          ? a.startTime.getTime() - b.startTime.getTime()
          : b.startTime.getTime() - a.startTime.getTime();
      } else if (sortBy === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else {
        const statusOrder = { live: 0, scheduled: 1, completed: 2, cancelled: 3 };
        return sortOrder === "asc"
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status];
      }
    });
    
    setFilteredClasses(result);
  }, [classes, searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

  // Handlers (inchangés sauf pour les formulaires)
  const handleClassSelect = (classItem: VirtualClass) => {
    setSelectedClass(classItem);
    setActiveTab("overview");
  };

  const handleBackToList = () => {
    setSelectedClass(null);
  };

  const handleCreateClass = () => {
    setModalType("create");
    setIsModalOpen(true);
  };

  const handleEditClass = (classItem: VirtualClass) => {
    setSelectedClass(classItem);
    setModalType("edit");
    setIsModalOpen(true);
  };

  const handleDeleteClass = (classItem: VirtualClass) => {
    setSelectedClass(classItem);
    setModalType("delete");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSortChange = (field: "date" | "title" | "status") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status: ClassStatus) => {
    switch (status) {
      case "live": return "bg-green-100 text-green-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
    }
  };

  const getStatusText = (status: ClassStatus) => {
    switch (status) {
      case "live": return "En direct";
      case "scheduled": return "Programmée";
      case "completed": return "Terminée";
      case "cancelled": return "Annulée";
    }
  };

  const handleViewRecording = (recording: Recording) => {
    alert(`Lecture de l'enregistrement : ${recording.title}`);
  };

  const handleDownloadRecording = (recording: Recording) => {
    alert(`Téléchargement de : ${recording.title} (${recording.size} MB)`);
  };

  const handleDeleteRecording = (recordingId: string) => {
    if (selectedClass) {
      const updatedRecordings = selectedClass.recordings.filter(r => r.id !== recordingId);
      const updatedClass = { ...selectedClass, recordings: updatedRecordings };
      setSelectedClass(updatedClass);
      setClasses(classes.map(c => c.id === selectedClass.id ? updatedClass : c));
    }
  };

  const handleAddParticipant = () => {
    if (selectedClass) {
      const newParticipant: Participant = {
        id: `p-${Date.now()}`,
        name: `Étudiant ${selectedClass.participants.length + 1} Fall`,
        email: `etudiant${selectedClass.participants.length + 1}@univ.sn`,
        role: "student",
        attendance: 0
      };
      const updatedClass = { ...selectedClass, participants: [...selectedClass.participants, newParticipant] };
      setSelectedClass(updatedClass);
      setClasses(classes.map(c => c.id === selectedClass.id ? updatedClass : c));
    }
  };

  const handleMessageParticipant = (participant: Participant) => {
    alert(`Envoi d'un message à ${participant.name}`);
  };

  const handleRemoveParticipant = (participantId: string) => {
    if (selectedClass) {
      const updatedParticipants = selectedClass.participants.filter(p => p.id !== participantId);
      const updatedClass = { ...selectedClass, participants: updatedParticipants };
      setSelectedClass(updatedClass);
      setClasses(classes.map(c => c.id === selectedClass.id ? updatedClass : c));
    }
  };

  const handleExportChat = () => {
    if (selectedClass) {
      const chatText = selectedClass.chatHistory.map(m => `${m.userName} (${formatTime(m.timestamp)}): ${m.message}`).join("\n");
      const blob = new Blob([chatText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedClass.title}_chat.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleMessageClick = (messageId: string) => {
    setSelectedMessage(messageId === selectedMessage ? null : messageId);
  };

  // Render functions (inchangés sauf formulaires)
  const renderStatusBadge = (status: ClassStatus) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {getStatusText(status)}
    </span>
  );

  const renderClassList = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Classes Virtuelles</h2>
        <button 
          onClick={handleCreateClass}
          className="bg-[#2CB3C2] hover:bg-[#2398A4] text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Nouvelle classe</span>
        </button>
      </div>
      {/* Suite inchangée */}
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par titre, description ou enseignant..."
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50"
            >
              <Filter size={18} />
              <span>Filtres</span>
              <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <select 
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as "date" | "title" | "status");
                setSortOrder(order as "asc" | "desc");
              }}
            >
              <option value="date-asc">Date (croissant)</option>
              <option value="date-desc">Date (décroissant)</option>
              <option value="title-asc">Titre (A-Z)</option>
              <option value="title-desc">Titre (Z-A)</option>
              <option value="status-asc">Statut</option>
            </select>
          </div>
        </div>
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select 
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ClassStatus | "all")}
              >
                <option value="all">Tous les statuts</option>
                <option value="live">En direct</option>
                <option value="scheduled">Programmée</option>
                <option value="completed">Terminée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
              <select 
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as "today" | "week" | "month" | "all")}
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
            </div>
          </div>
        )}
      </div>
      {/* Tableaux et pagination inchangés */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange("title")}>
                <div className="flex items-center gap-1">
                  Titre
                  {sortBy === "title" && <ChevronDown size={16} className={`transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange("date")}>
                <div className="flex items-center gap-1">
                  Date & Heure
                  {sortBy === "date" && <ChevronDown size={16} className={`transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enseignant</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange("status")}>
                <div className="flex items-center gap-1">
                  Statut
                  {sortBy === "status" && <ChevronDown size={16} className={`transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClasses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Aucune classe virtuelle ne correspond à vos critères de recherche.
                </td>
              </tr>
            ) : (
              filteredClasses.map((classItem) => (
                <tr key={classItem.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleClassSelect(classItem)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{classItem.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{classItem.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(classItem.startTime)}</div>
                    <div className="text-sm text-gray-500">{formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{classItem.teacher}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{classItem.participants.length} / {classItem.maxParticipants}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{renderStatusBadge(classItem.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      {classItem.status === "scheduled" && (
                        <button className="text-[#2CB3C2] hover:text-[#2398A4]" onClick={() => setClasses(classes.map(c => c.id === classItem.id ? {...c, status: "live"} : c))}>
                          <Play size={18} />
                        </button>
                      )}
                      {classItem.status === "live" && (
                        <button className="text-gray-600 hover:text-gray-900" onClick={() => setClasses(classes.map(c => c.id === classItem.id ? {...c, status: "completed"} : c))}>
                          <Pause size={18} />
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-900" onClick={() => handleEditClass(classItem)}>
                        <Edit size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteClass(classItem)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Affichage de <span className="font-medium">{filteredClasses.length}</span> classes sur <span className="font-medium">{classes.length}</span> au total
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm disabled:opacity-50" disabled>Précédent</button>
            <button className="px-3 py-1 border rounded bg-[#2CB3C2] text-white text-sm">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm disabled:opacity-50" disabled>Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClassDetail = () => {
    if (!selectedClass) return null;
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={handleBackToList} className="p-1 rounded-full hover:bg-gray-100">
              <ChevronDown className="transform rotate-90" size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">{selectedClass.title}</h2>
            {renderStatusBadge(selectedClass.status)}
          </div>
          <div className="flex gap-2">
            {selectedClass.status === "scheduled" && (
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={() => {
                setClasses(classes.map(c => c.id === selectedClass.id ? {...c, status: "live"} : c));
                setSelectedClass({...selectedClass, status: "live"});
              }}>
                <Play size={16} />
                <span>Démarrer</span>
              </button>
            )}
            {selectedClass.status === "live" && (
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={() => {
                setClasses(classes.map(c => c.id === selectedClass.id ? {...c, status: "completed"} : c));
                setSelectedClass({...selectedClass, status: "completed"});
              }}>
                <Pause size={16} />
                <span>Terminer</span>
              </button>
            )}
            <button className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md flex items-center gap-2" onClick={() => handleEditClass(selectedClass)}>
              <Edit size={16} />
              <span>Modifier</span>
            </button>
            <button className="border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md flex items-center gap-2" onClick={() => handleDeleteClass(selectedClass)}>
              <Trash2 size={16} />
              <span>Supprimer</span>
            </button>
          </div>
        </div>
        {/* Onglets inchangés */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === "overview" ? "border-[#2CB3C2] text-[#2CB3C2]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`} onClick={() => setActiveTab("overview")}>Aperçu</button>
            <button className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === "participants" ? "border-[#2CB3C2] text-[#2CB3C2]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`} onClick={() => setActiveTab("participants")}>Participants</button>
            <button className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === "recordings" ? "border-[#2CB3C2] text-[#2CB3C2]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`} onClick={() => setActiveTab("recordings")}>Enregistrements</button>
            <button className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === "chat" ? "border-[#2CB3C2] text-[#2CB3C2]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`} onClick={() => setActiveTab("chat")}>Chat</button>
            <button className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === "analytics" ? "border-[#2CB3C2] text-[#2CB3C2]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`} onClick={() => setActiveTab("analytics")}>Analytiques</button>
            <button className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === "settings" ? "border-[#2CB3C2] text-[#2CB3C2]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`} onClick={() => setActiveTab("settings")}>Paramètres</button>
          </div>
        </div>
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Contenu inchangé */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Date et heure</h3>
                  <div className="flex items-start gap-3">
                    <Calendar className="text-gray-400 mt-1" size={20} />
                    <div>
                      <p className="text-gray-900 font-medium">{formatDate(selectedClass.startTime)}</p>
                      <p className="text-gray-600">{formatTime(selectedClass.startTime)} - {formatTime(selectedClass.endTime)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Enseignant</h3>
                  <div className="flex items-start gap-3">
                    <Users className="text-gray-400 mt-1" size={20} />
                    <div>
                      <p className="text-gray-900 font-medium">{selectedClass.teacher}</p>
                      <p className="text-gray-600">Enseignant principal</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Participants</h3>
                  <div className="flex items-start gap-3">
                    <Users className="text-gray-400 mt-1" size={20} />
                    <div>
                      <p className="text-gray-900 font-medium">{selectedClass.participants.length} / {selectedClass.maxParticipants}</p>
                      <p className="text-gray-600">Participants inscrits</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-700">{selectedClass.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedClass.tags.map((tag, index) => (
                    <span key={index} className="bg-[#2CB3C2] text-white px-2 py-1 rounded-md text-xs">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Derniers participants</h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {selectedClass.participants.slice(0, 5).map((participant) => (
                        <li key={participant.id} className="px-4 py-3 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                            <p className="text-xs text-gray-500">{participant.email}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${participant.role === "teacher" ? "bg-purple-100 text-purple-800" : participant.role === "assistant" ? "bg-[#2CB3C2] text-white" : "bg-gray-100 text-gray-800"}`}>
                            {participant.role === "teacher" ? "Enseignant" : participant.role === "assistant" ? "Assistant" : "Étudiant"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Derniers enregistrements</h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    {selectedClass.recordings.length === 0 ? (
                      <p className="p-4 text-gray-500 text-sm">Aucun enregistrement disponible</p>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {selectedClass.recordings.slice(0, 3).map((recording) => (
                          <li key={recording.id} className="px-4 py-3 flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{recording.title}</p>
                              <p className="text-xs text-gray-500">{recording.duration} min • {recording.size} MB</p>
                            </div>
                            <div className="flex gap-2">
                              <button className="text-gray-600 hover:text-gray-900" onClick={() => handleViewRecording(recording)}><Eye size={16} /></button>
                              <button className="text-gray-600 hover:text-gray-900" onClick={() => handleDownloadRecording(recording)}><Download size={16} /></button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "participants" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Liste des participants</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Rechercher un participant..."
                      className="pl-9 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]"
                      value={participantSearch}
                      onChange={(e) => setParticipantSearch(e.target.value)}
                    />
                  </div>
                  <button className="bg-[#2CB3C2] hover:bg-[#2398A4] text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={handleAddParticipant}>
                    <Plus size={16} />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
              {/* Tableaux inchangés */}
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Présence</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière activité</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedClass.participants.filter(p => p.name.toLowerCase().includes(participantSearch.toLowerCase())).map((participant) => (
                      <tr key={participant.id}>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{participant.name}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{participant.email}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${participant.role === "teacher" ? "bg-purple-100 text-purple-800" : participant.role === "assistant" ? "bg-[#2CB3C2] text-white" : "bg-gray-100 text-gray-800"}`}>
                            {participant.role === "teacher" ? "Enseignant" : participant.role === "assistant" ? "Assistant" : "Étudiant"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className={`h-2.5 rounded-full ${participant.attendance > 80 ? "bg-green-600" : participant.attendance > 50 ? "bg-yellow-400" : "bg-red-600"}`} style={{ width: `${participant.attendance}%` }}></div>
                            </div>
                            <span className="ml-2 text-xs text-gray-500">{participant.attendance}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{participant.lastActive ? formatTime(participant.lastActive) : "N/A"}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button className="text-gray-600 hover:text-gray-900" onClick={() => handleMessageParticipant(participant)}><MessageSquare size={16} /></button>
                            <button className="text-red-600 hover:text-red-900" onClick={() => handleRemoveParticipant(participant.id)}><X size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "recordings" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Enregistrements</h3>
                {selectedClass.status === "live" && (
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={() => alert("Enregistrement démarré !")}>
                    <Video size={16} />
                    <span>Enregistrer maintenant</span>
                  </button>
                )}
              </div>
              {selectedClass.recordings.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <Video className="mx-auto text-gray-400 mb-2" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun enregistrement</h3>
                  <p className="text-gray-500 mb-4">Il n'y a pas encore d'enregistrements pour cette classe virtuelle.</p>
                  {selectedClass.status === "live" && (
                    <button className="bg-[#2CB3C2] hover:bg-[#2398A4] text-white px-4 py-2 rounded-md inline-flex items-center gap-2" onClick={() => alert("Enregistrement démarré !")}>
                      <Video size={16} />
                      <span>Démarrer l'enregistrement</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vues</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedClass.recordings.map((recording) => (
                        <tr key={recording.id}>
                          <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{recording.title}</div></td>
                          <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{formatDate(recording.createdAt)}</div></td>
                          <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{recording.duration} minutes</div></td>
                          <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{recording.size} MB</div></td>
                          <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{recording.viewCount}</div></td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button className="text-gray-600 hover:text-gray-900" onClick={() => handleViewRecording(recording)}><Eye size={16} /></button>
                              <button className="text-gray-600 hover:text-gray-900" onClick={() => handleDownloadRecording(recording)}><Download size={16} /></button>
                              <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteRecording(recording.id)}><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {activeTab === "chat" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Historique du chat</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Rechercher dans le chat..."
                      className="pl-9 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]"
                      value={chatSearch}
                      onChange={(e) => setChatSearch(e.target.value)}
                    />
                  </div>
                  <button className="bg-[#2CB3C2] hover:bg-[#2398A4] text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={handleExportChat}>
                    <Download size={16} />
                    <span>Exporter</span>
                  </button>
                </div>
              </div>
              {selectedClass.chatHistory.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <MessageSquare className="mx-auto text-gray-400 mb-2" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun message</h3>
                  <p className="text-gray-500">Il n'y a pas encore de messages dans le chat.</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {selectedClass.chatHistory.filter(m => m.message.toLowerCase().includes(chatSearch.toLowerCase())).map((message) => (
                      <div key={message.id} className={`flex gap-3 p-2 rounded-md ${selectedMessage === message.id ? "bg-[#2CB3C2] text-white" : "hover:bg-gray-100"} cursor-pointer`} onClick={() => handleMessageClick(message.id)}>
                        <div className="w-8 h-8 rounded-full bg-[#2CB3C2] flex items-center justify-center text-white flex-shrink-0">{message.userName.charAt(0)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${selectedMessage === message.id ? "text-white" : "text-gray-900"}`}>{message.userName}</span>
                            <span className={`text-xs ${selectedMessage === message.id ? "text-white" : "text-gray-500"}`}>{formatTime(message.timestamp)}</span>
                            {message.isPrivate && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">Privé</span>}
                          </div>
                          <p className={selectedMessage === message.id ? "text-white" : "text-gray-700 mt-1"}>{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Taux de participation</h3>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold text-gray-900">{Math.round(selectedClass.participants.reduce((acc, p) => acc + p.attendance, 0) / selectedClass.participants.length)}%</div>
                    <div className="ml-auto"><BarChart2 className="text-gray-400" size={32} /></div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Durée moyenne</h3>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold text-gray-900">{Math.round((selectedClass.endTime.getTime() - selectedClass.startTime.getTime()) / (1000 * 60))} min</div>
                    <div className="ml-auto"><Clock className="text-gray-400" size={32} /></div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Messages échangés</h3>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedClass.chatHistory.length}</div>
                    <div className="ml-auto"><MessageSquare className="text-gray-400" size={32} /></div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Participation par rôle</h3>
                <div className="h-64">
                  <Pie data={{
                    labels: ["Enseignants", "Assistants", "Étudiants"],
                    datasets: [{ data: ["teacher", "assistant", "student"].map(role => selectedClass.participants.filter(p => p.role === role).length), backgroundColor: ["#8B5CF6", "#2CB3C2", "#10B981"], borderWidth: 1 }]
                  }} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Activité du chat</h3>
                  <div className="h-48">
                    <Bar data={{
                      labels: Array.from({ length: 12 }, (_, i) => `${(selectedClass.startTime.getHours() + Math.floor(i / 2)) % 24}h`),
                      datasets: [{ label: "Messages", data: Array.from({ length: 12 }, (_, i) => selectedClass.chatHistory.filter(msg => msg.timestamp.getHours() === ((selectedClass.startTime.getHours() + Math.floor(i / 2)) % 24)).length), backgroundColor: "#2CB3C2" }]
                    }} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Vues des enregistrements</h3>
                  {selectedClass.recordings.length === 0 ? (
                    <div className="h-48 flex items-center justify-center text-gray-500">Aucun enregistrement disponible</div>
                  ) : (
                    <div className="h-48">
                      <Line data={{
                        labels: selectedClass.recordings.map(r => r.title),
                        datasets: [{ label: "Vues", data: selectedClass.recordings.map(r => r.viewCount), borderColor: "#2CB3C2", tension: 0.1 }]
                      }} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium">Paramètres généraux</h3>
                </div>
                <div className="p-6 space-y-4">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const updatedClass = {
                      ...selectedClass,
                      title: (form.elements.namedItem("title") as HTMLInputElement).value,
                      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
                      status: (form.elements.namedItem("status") as HTMLSelectElement).value as ClassStatus,
                      startTime: new Date((form.elements.namedItem("startTime") as HTMLInputElement).value),
                      endTime: new Date((form.elements.namedItem("endTime") as HTMLInputElement).value),
                      teacher: (form.elements.namedItem("teacher") as HTMLInputElement).value,
                      maxParticipants: parseInt((form.elements.namedItem("maxParticipants") as HTMLInputElement).value),
                      tags: (form.elements.namedItem("tags") as HTMLInputElement).value.split(", ").map((t: string) => t.trim())
                    };
                    setSelectedClass(updatedClass);
                    setClasses(classes.map(c => c.id === selectedClass.id ? updatedClass : c));
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la classe</label>
                        <input name="title" type="text" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" defaultValue={selectedClass.title} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                        <select name="status" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" defaultValue={selectedClass.status}>
                          <option value="scheduled">Programmée</option>
                          <option value="live">En direct</option>
                          <option value="completed">Terminée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea name="description" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" rows={4} defaultValue={selectedClass.description}></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                        <input name="startTime" type="datetime-local" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" defaultValue={selectedClass.startTime.toISOString().slice(0, 16)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                        <input name="endTime" type="datetime-local" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" defaultValue={selectedClass.endTime.toISOString().slice(0, 16)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enseignant</label>
                        <input name="teacher" type="text" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" defaultValue={selectedClass.teacher} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre maximum de participants</label>
                        <input name="maxParticipants" type="number" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" defaultValue={selectedClass.maxParticipants} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                      <input name="tags" type="text" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" defaultValue={selectedClass.tags.join(", ")} />
                      <p className="mt-1 text-xs text-gray-500">Séparez les tags par des virgules</p>
                    </div>
                    <div className="bg-white border rounded-lg overflow-hidden">
                      <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-medium">Paramètres avancés</h3>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Enregistrement automatique</h4>
                            <p className="text-sm text-gray-500">Enregistrer automatiquement la session lorsqu'elle commence</p>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="toggle-recording" className="sr-only" defaultChecked />
                            <label htmlFor="toggle-recording" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                              <span className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out translate-x-4"></span>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Chat modéré</h4>
                            <p className="text-sm text-gray-500">Les messages doivent être approuvés avant d'être visibles</p>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="toggle-moderation" className="sr-only" />
                            <label htmlFor="toggle-moderation" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                              <span className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out"></span>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Notifications par email</h4>
                            <p className="text-sm text-gray-500">Envoyer des rappels aux participants</p>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="toggle-notifications" className="sr-only" defaultChecked />
                            <label htmlFor="toggle-notifications" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                              <span className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out translate-x-4"></span>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Accès aux enregistrements</h4>
                            <p className="text-sm text-gray-500">Permettre aux participants de télécharger les enregistrements</p>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="toggle-download" className="sr-only" defaultChecked />
                            <label htmlFor="toggle-download" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                              <span className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out translate-x-4"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button type="button" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50" onClick={() => setActiveTab("overview")}>Annuler</button>
                      <button type="submit" className="px-4 py-2 bg-[#2CB3C2] text-white rounded-md hover:bg-[#2398A4]">Enregistrer les modifications</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderModal = () => {
    if (!isModalOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {modalType === "create" ? "Créer une nouvelle classe" : modalType === "edit" ? "Modifier la classe" : "Supprimer la classe"}
            </h2>
            <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
          </div>
          {modalType === "delete" ? (
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600"><AlertTriangle size={24} /></div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
                  <p className="text-gray-500">Êtes-vous sûr de vouloir supprimer cette classe virtuelle ? Cette action est irréversible.</p>
                </div>
              </div>
              {selectedClass && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="font-medium text-gray-900">{selectedClass.title}</p>
                  <p className="text-gray-500 text-sm">{formatDate(selectedClass.startTime)} • {formatTime(selectedClass.startTime)} - {formatTime(selectedClass.endTime)}</p>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button onClick={handleCloseModal} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Annuler</button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" onClick={() => {
                  if (selectedClass) {
                    setClasses(classes.filter(c => c.id !== selectedClass.id));
                    setSelectedClass(null);
                    handleCloseModal();
                  }
                }}>Supprimer</button>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const newClass: VirtualClass = {
                  id: modalType === "create" ? `class-${Date.now()}` : selectedClass!.id,
                  title: (form.elements.namedItem("title") as HTMLInputElement).value,
                  description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
                  status: "scheduled",
                  startTime: new Date((form.elements.namedItem("startTime") as HTMLInputElement).value),
                  endTime: new Date((form.elements.namedItem("endTime") as HTMLInputElement).value),
                  teacher: (form.elements.namedItem("teacher") as HTMLInputElement).value,
                  participants: modalType === "create" ? [] : selectedClass!.participants,
                  maxParticipants: parseInt((form.elements.namedItem("maxParticipants") as HTMLInputElement).value),
                  recordings: modalType === "create" ? [] : selectedClass!.recordings,
                  chatHistory: modalType === "create" ? [] : selectedClass!.chatHistory,
                  tags: (form.elements.namedItem("tags") as HTMLInputElement).value.split(", ").map((t: string) => t.trim())
                };
                if (modalType === "create") {
                  setClasses([...classes, newClass]);
                } else {
                  setClasses(classes.map(c => c.id === selectedClass!.id ? newClass : c));
                  setSelectedClass(newClass);
                }
                handleCloseModal();
              }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la classe</label>
                  <input name="title" type="text" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" defaultValue={selectedClass?.title || ""} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" rows={3} defaultValue={selectedClass?.description || ""}></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                    <input name="startTime" type="datetime-local" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" defaultValue={selectedClass?.startTime.toISOString().slice(0, 16) || ""} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                    <input name="endTime" type="datetime-local" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" defaultValue={selectedClass?.endTime.toISOString().slice(0, 16) || ""} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enseignant</label>
                    <input name="teacher" type="text" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" defaultValue={selectedClass?.teacher || ""} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre maximum de participants</label>
                    <input name="maxParticipants" type="number" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" defaultValue={selectedClass?.maxParticipants || 30} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input name="tags" type="text" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" defaultValue={selectedClass?.tags.join(", ") || ""} />
                  <p className="mt-1 text-xs text-gray-500">Séparez les tags par des virgules</p>
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={handleCloseModal} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Annuler</button>
                  <button type="submit" className="px-4 py-2 bg-[#2CB3C2] text-white rounded-md hover:bg-[#2398A4]">{modalType === "create" ? "Créer" : "Enregistrer"}</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Administration des Classes Virtuelles</h1>
          <p className="text-gray-600">Gérez et supervisez toutes les sessions en direct ou programmées</p>
        </div>
        {selectedClass ? renderClassDetail() : renderClassList()}
        {renderModal()}
      </div>
    </div>
  );
};

export default ClasseVirtuelle;