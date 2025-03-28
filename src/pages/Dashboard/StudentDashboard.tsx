import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// Interfaces pour les données du tableau de bord
interface ScheduleEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  status: string;
}

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  status: string;
}

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

// Données simulées
const mockSchedule: ScheduleEvent[] = [
  { id: 1, title: "Cours 1", date: "01/04/2025", time: "17h30", status: "En ligne" },
  { id: 2, title: "Cours 2", date: "01/04/2025", time: "09h00", status: "En venir" },
  { id: 3, title: "Cours 3", date: "02/04/2025", time: "--:--", status: "À venir" },
  { id: 4, title: "Cours 4", date: "02/04/2025", time: "--:--", status: "À venir" },
  { id: 5, title: "Cours 5", date: "27/03/2025", time: "09h00", status: "Annuler" },
  { id: 6, title: "Cours 6", date: "29/03/2025", time: "09h00", status: "En venir" },
  { id: 7, title: "Cours 7", date: "30/03/2025", time: "11h30", status: "En ligne" },
];

const mockAssignments: Assignment[] = [
  { id: 1, title: "Devoir cours 1", dueDate: "25/04/2025", status: "À rendre" },
  { id: 2, title: "Devoir cours 2", dueDate: "--/--/----", status: "Note" },
  { id: 3, title: "Projet cours 3", dueDate: "01/04/2025", status: "Rendu" },
  { id: 4, title: "QCM cours 4", dueDate: "27/04/2025", status: "À rendre" },
];

const mockNotifications: Notification[] = [
  { id: 1, message: "Nouveau support disponible.", time: "2025-03-27 08:00", read: false },
  { id: 2, message: "Rappel : Cours à 11h.", time: "2025-03-27 09:00", read: false },
];

// Styles
const customStyles = `
  .dark .card { background: #1F2A44; color: #F9FAFB; border: 1px solid #2C6E78; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
  .light-card { background: #FFFFFF; color: #374151; border: 1px solid #E5E7EB; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
  .dark .Toastify__toast { background: #1F2A44; color: #F9FAFB; }
  .dark .sidebar-item:hover { background: #2C6E78; transition: background 0.3s ease; }
  .light .sidebar-item:hover { background: rgba(44, 110, 120, 0.2); transition: background 0.3s ease; }
  .status-a-rendre { background: #F4A261; color: #1F2A44; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
  .status-note { background: #10B981; color: #FFFFFF; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
  .status-rendu { background: #A855F7; color: #FFFFFF; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
  .status-en-ligne { background: #F4A261; color: #1F2A44; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
  .status-en-venir { background: #2C6E78; color: #FFFFFF; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
  .status-a-venir { background: #A855F7; color: #FFFFFF; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
  .status-annuler { background: #EF4444; color: #FFFFFF; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
  .font-roboto { font-family: 'Roboto', sans-serif; }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = customStyles;
document.head.appendChild(styleSheet);

// Composant interne pour le tableau de bord par défaut
const DashboardContent: React.FC = () => {
  const [schedule] = useState<ScheduleEvent[]>(mockSchedule);
  const [assignments] = useState<Assignment[]>(mockAssignments);

  return (
    <>
      {/* Bannière de bienvenue */}
      <div className="relative bg-[#4B7285] text-white rounded-xl p-8 mb-6 flex items-center justify-between overflow-hidden w-full max-w-screen-xl mx-auto shadow-xl">
  {/* Côté gauche : Texte */}
  <div className="z-10 max-w-2xl">
    <h1 className="text-4xl font-bold mb-4 tracking-wide">
      BIENVENUE SUR LA PLATEFORME{" "}
      <span className="text-5xl text-[#1E3A8A] font-extrabold drop-shadow-md">EDUTECH</span>
    </h1>
    <p className="text-lg opacity-95 text-gray-100">
      Pôle Sciences et Technologie et Numérique
    </p>
  </div>

  {/* Côté droit : Image avec un format amélioré */}
  <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-end pr-8">
    <div className="relative w-56 h-56 rounded-full overflow-hidden border-6 border-white shadow-lg transform hover:scale-105 transition-transform duration-300">
      <img
        src="/src/pages/assets/fond.jpg" // Vérifiez ce chemin selon votre structure
        alt="Étudiant en train d'étudier"
        className="w-full h-full object-cover"
        onError={() => console.log("Erreur : Image non trouvée à /src/pages/assets/cdd.jpg")}
      />
    </div>
  </div>

  {/* Éléments décoratifs en arrière-plan */}
  <div className="absolute inset-0 opacity-15">
    <div className="absolute top-10 left-16 w-28 h-28 rounded-full bg-teal-300"></div>
    <div className="absolute bottom-10 left-32 w-24 h-24 rounded-full bg-teal-400"></div>
    <div className="absolute top-6 right-32 w-20 h-20 rounded-full bg-teal-200"></div>
  </div>
</div>

      {/* Navigation et contenu existants */}
      <nav className="text-sm text-gray-500 mb-4">
        <span>Accueil / Tableau de bord</span>
      </nav>
      <h1 className="text-2xl font-bold mb-6 text-[#2C6E78]">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Devoirs Section */}
        <div className="light-card p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-[#374151]">Devoirs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#2C6E78] text-white">
                  <th className="p-3 rounded-tl-lg">Devoirs</th>
                  <th className="p-3">Date limite</th>
                  <th className="p-3 rounded-tr-lg">Statut</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="border-b border-gray-200">
                    <td className="p-3">{assignment.title}</td>
                    <td className="p-3">{assignment.dueDate}</td>
                    <td className="p-3">
                      <span
                        className={
                          assignment.status === 'À rendre'
                            ? 'status-a-rendre'
                            : assignment.status === 'Note'
                            ? 'status-note'
                            : 'status-rendu'
                        }
                      >
                        {assignment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Liste des prochains cours Section */}
        <div className="light-card p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-[#374151]">Liste des prochains cours</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#2C6E78] text-white">
                  <th className="p-3 rounded-tl-lg">Modules</th>
                  <th className="p-3">Jour</th>
                  <th className="p-3">Horaire</th>
                  <th className="p-3 rounded-tr-lg">Statut</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((event) => (
                  <tr key={event.id} className="border-b border-gray-200">
                    <td className="p-3">{event.title}</td>
                    <td className="p-3">{event.date}</td>
                    <td className="p-3">{event.time}</td>
                    <td className="p-3">
                      <span
                        className={
                          event.status === 'En ligne'
                            ? 'status-en-ligne'
                            : event.status === 'En venir'
                            ? 'status-en-venir'
                            : event.status === 'À venir'
                            ? 'status-a-venir'
                            : 'status-annuler'
                        }
                      >
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

interface StudentDashboardProps {
  children?: React.ReactNode;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [notifications] = useState<Notification[]>(mockNotifications);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'dark bg-[#1F2A44]' : 'bg-[#F9FAFB]'} transition-colors duration-300 font-roboto`}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        {/* Header */}
        <Header
          toggleSidebar={toggleSidebar}
          theme={theme}
          toggleTheme={toggleTheme}
          unreadNotifications={unreadNotifications}
        />

        {/* Contenu principal */}
        <main className="p-8">
          {children || <DashboardContent />}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;