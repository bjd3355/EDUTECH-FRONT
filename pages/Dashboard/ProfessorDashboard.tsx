import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FaBook, FaCalendarAlt, FaClipboardList, FaCheck, FaTimes, FaVideo } from 'react-icons/fa';

// Interfaces
interface ScheduleEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  status: string;
  room?: string;
  class: string;
  field: string;
}

interface AssignmentToGrade {
  id: number;
  title: string;
  submittedBy: string;
  submissionDate: string;
  status: string;
  class: string;
  field: string;
}

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

// Données simulées
const mockSchedule: ScheduleEvent[] = [
  { id: 1, title: "Cours de Mathématiques", date: "01/04/2025", time: "14h00", status: "En ligne", class: "L1A", field: "Mathématiques" },
  { id: 2, title: "Cours de Physique", date: "01/04/2025", time: "09h00", status: "Présentiel", room: "Salle A12", class: "L2B", field: "Physique" },
  { id: 3, title: "TD Algorithmique", date: "02/04/2025", time: "10h30", status: "À venir", class: "M1A", field: "Informatique" },
  { id: 4, title: "Cours de Chimie", date: "03/04/2025", time: "15h00", status: "À venir", class: "L3C", field: "Chimie" },
  { id: 5, title: "Séminaire Recherche", date: "27/03/2025", time: "11h00", status: "Annulé", class: "M2A", field: "Informatique" },
];

const mockAssignmentsToGrade: AssignmentToGrade[] = [
  { id: 1, title: "Devoir Mathématiques", submittedBy: "Jean Dupont", submissionDate: "27/03/2025", status: "À corriger", class: "L1A", field: "Mathématiques" },
  { id: 2, title: "Projet Algorithmique", submittedBy: "Marie Curie", submissionDate: "28/03/2025", status: "À corriger", class: "M1A", field: "Informatique" },
  { id: 3, title: "TD Physique", submittedBy: "Paul Martin", submissionDate: "26/03/2025", status: "Corrigé", class: "L2B", field: "Physique" },
  { id: 4, title: "Exercice Chimie", submittedBy: "Sophie Leclerc", submissionDate: "28/03/2025", status: "À corriger", class: "L3C", field: "Chimie" },
];

const mockNotifications: Notification[] = [
  { id: 1, message: "Nouveau devoir soumis par Jean Dupont (L1A).", time: "2025-03-27 14:00", read: false },
  { id: 2, message: "Rappel : Cours de Physique (L2B) demain.", time: "2025-03-28 08:00", read: false },
];

// Styles
const customStyles = `
  .dark .card { background: #1F2A44; color: #F9FAFB; border: 1px solid #2C6E78; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); transition: transform 0.2s; }
  .dark .card:hover { transform: translateY(-5px); }
  .light-card { background: #FFFFFF; color: #374151; border: 1px solid #E5E7EB; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); transition: transform 0.2s; }
  .light-card:hover { transform: translateY(-5px); }
  .status-a-corriger { background: #F4A261; color: #1F2A44; padding: 6px 12px; border-radius: 20px; font-size: 12px; }
  .status-corrige { background: #10B981; color: #FFFFFF; padding: 6px 12px; border-radius: 20px; font-size: 12px; }
  .status-en-ligne { background: #F4A261; color: #1F2A44; padding: 6px 12px; border-radius: 20px; font-size: 12px; }
  .status-presentiel { background: #2C6E78; color: #FFFFFF; padding: 6px 12px; border-radius: 20px; font-size: 12px; }
  .status-a-venir { background: #A855F7; color: #FFFFFF; padding: 6px 12px; border-radius: 20px; font-size: 12px; }
  .status-annule { background: #EF4444; color: #FFFFFF; padding: 6px 12px; border-radius: 20px; font-size: 12px; }
  .btn-action { padding: 6px 12px; border-radius: 8px; transition: background 0.3s; }
  .btn-action:hover { background: #2C6E78; color: #FFFFFF; }
  .stats-card { background: linear-gradient(135deg, #2C6E78, #4B7285); color: #FFFFFF; border-radius: 12px; padding: 20px; }
  .session-card { background: linear-gradient(135deg, #4B7285, #2C6E78); color: #FFFFFF; border-radius: 12px; padding: 20px; text-align: center; }
  .font-roboto { font-family: 'Roboto', sans-serif; }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = customStyles;
document.head.appendChild(styleSheet);

// Composant interne modifié
const ProfessorDashboardContent: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleEvent[]>(mockSchedule);
  const [assignmentsToGrade, setAssignmentsToGrade] = useState<AssignmentToGrade[]>(mockAssignmentsToGrade);
  const [filterScheduleStatus, setFilterScheduleStatus] = useState<string>('Tous');
  const [filterScheduleClass, setFilterScheduleClass] = useState<string>('Tous');
  const [filterAssignmentsStatus, setFilterAssignmentsStatus] = useState<string>('Tous');
  const [filterAssignmentsClass, setFilterAssignmentsClass] = useState<string>('Tous');

  // Fonctions interactives
  const markAsCorrected = (id: number) => {
    setAssignmentsToGrade(prev =>
      prev.map(assignment =>
        assignment.id === id ? { ...assignment, status: 'Corrigé' } : assignment
      )
    );
  };

  const cancelCourse = (id: number) => {
    setSchedule(prev =>
      prev.map(event =>
        event.id === id ? { ...event, status: 'Annulé' } : event
      )
    );
  };

  // Liste unique des classes pour les filtres
  const uniqueClasses = Array.from(new Set([...schedule.map(e => e.class), ...assignmentsToGrade.map(a => a.class)]));

  // Filtrer les données
  const filteredSchedule = schedule.filter(event =>
    (filterScheduleStatus === 'Tous' || event.status === filterScheduleStatus) &&
    (filterScheduleClass === 'Tous' || event.class === filterScheduleClass)
  );
  const filteredAssignments = assignmentsToGrade.filter(assignment =>
    (filterAssignmentsStatus === 'Tous' || assignment.status === filterAssignmentsStatus) &&
    (filterAssignmentsClass === 'Tous' || assignment.class === filterAssignmentsClass)
  );

  // Lancer une session en ligne (simulation)
  const startOnlineSession = () => {
    alert("Lancement d'une session en ligne (simulation : lien vers Zoom/Teams).");
  };

  return (
    <>
      {/* Bannière */}
      <div className="relative bg-gradient-to-r from-[#2C6E78] to-[#4B7285] text-white rounded-xl p-8 mb-8 flex items-center justify-between overflow-hidden w-full max-w-screen-xl mx-auto shadow-2xl">
        <div className="z-10 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4 tracking-wide">
            BIENVENUE, PROFESSEUR{" "}
            <span className="text-5xl text-[#F9FAFB] font-extrabold drop-shadow-md">EDUTECH</span>
          </h1>
          <p className="text-lg opacity-90">Gérez vos classes et filières</p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-end pr-8">
          <img
            src="/assets/logo.png"
            alt="Professeur en classe"
            className="w-64 h-64 object-cover rounded-full border-4 border-white shadow-lg transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stats-card flex items-center">
          <FaBook className="text-3xl mr-4" />
          <div>
            <h3 className="text-xl font-semibold">{schedule.filter(e => e.status !== 'Annulé').length}</h3>
            <p>Cours prévus</p>
          </div>
        </div>
        <div className="stats-card flex items-center">
          <FaClipboardList className="text-3xl mr-4" />
          <div>
            <h3 className="text-xl font-semibold">{assignmentsToGrade.filter(a => a.status === 'À corriger').length}</h3>
            <p>Devoirs à corriger</p>
          </div>
        </div>
        <div className="stats-card flex items-center">
          <FaCalendarAlt className="text-3xl mr-4" />
          <div>
            <h3 className="text-xl font-semibold">{uniqueClasses.length}</h3>
            <p>Classes gérées</p>
          </div>
        </div>
      </div>

      {/* Contenu principal - Disposition verticale */}
      <div className="space-y-8 mb-8">
        {/* Devoirs à corriger */}
        <div className="light-card p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#374151]">Devoirs à corriger</h2>
            <div className="flex space-x-2">
              <select
                className="p-2 border rounded-lg"
                value={filterAssignmentsStatus}
                onChange={(e) => setFilterAssignmentsStatus(e.target.value)}
              >
                <option value="Tous">Statut : Tous</option>
                <option value="À corriger">À corriger</option>
                <option value="Corrigé">Corrigé</option>
              </select>
              <select
                className="p-2 border rounded-lg"
                value={filterAssignmentsClass}
                onChange={(e) => setFilterAssignmentsClass(e.target.value)}
              >
                <option value="Tous">Classe : Tous</option>
                {uniqueClasses.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#2C6E78] text-white">
                  <th className="p-3 rounded-tl-lg">Devoir</th>
                  <th className="p-3">Soumis par</th>
                  <th className="p-3">Classe</th>
                  <th className="p-3">Filière</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-3">{assignment.title}</td>
                    <td className="p-3">{assignment.submittedBy}</td>
                    <td className="p-3">{assignment.class}</td>
                    <td className="p-3">{assignment.field}</td>
                    <td className="p-3">{assignment.submissionDate}</td>
                    <td className="p-3">
                      <span
                        className={assignment.status === 'À corriger' ? 'status-a-corriger' : 'status-corrige'}
                      >
                        {assignment.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {assignment.status === 'À corriger' && (
                        <button
                          className="btn-action bg-green-500 text-white"
                          onClick={() => markAsCorrected(assignment.id)}
                        >
                          <FaCheck />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Prochains cours */}
        <div className="light-card p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#374151]">Prochains cours</h2>
            <div className="flex space-x-2">
              <select
                className="p-2 border rounded-lg"
                value={filterScheduleStatus}
                onChange={(e) => setFilterScheduleStatus(e.target.value)}
              >
                <option value="Tous">Statut : Tous</option>
                <option value="En ligne">En ligne</option>
                <option value="Présentiel">Présentiel</option>
                <option value="À venir">À venir</option>
                <option value="Annulé">Annulé</option>
              </select>
              <select
                className="p-2 border rounded-lg"
                value={filterScheduleClass}
                onChange={(e) => setFilterScheduleClass(e.target.value)}
              >
                <option value="Tous">Classe : Tous</option>
                {uniqueClasses.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#2C6E78] text-white">
                  <th className="p-3 rounded-tl-lg">Cours</th>
                  <th className="p-3">Classe</th>
                  <th className="p-3">Filière</th>
                  <th className="p-3">Jour</th>
                  <th className="p-3">Horaire</th>
                  <th className="p-3">Salle</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedule.map((event) => (
                  <tr key={event.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-3">{event.title}</td>
                    <td className="p-3">{event.class}</td>
                    <td className="p-3">{event.field}</td>
                    <td className="p-3">{event.date}</td>
                    <td className="p-3">{event.time}</td>
                    <td className="p-3">{event.room || '--'}</td>
                    <td className="p-3">
                      <span
                        className={
                          event.status === 'En ligne'
                            ? 'status-en-ligne'
                            : event.status === 'Présentiel'
                            ? 'status-presentiel'
                            : event.status === 'À venir'
                            ? 'status-a-venir'
                            : 'status-annule'
                        }
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {event.status !== 'Annulé' && (
                        <button
                          className="btn-action bg-red-500 text-white"
                          onClick={() => cancelCourse(event.id)}
                        >
                          <FaTimes />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section pour démarrer une session en ligne */}
      <div className="session-card mt-8">
        <h2 className="text-2xl font-bold mb-4">Démarrer une session en ligne</h2>
        <p className="mb-4">Lancez une réunion virtuelle avec vos étudiants en un clic.</p>
        <button
          className="btn-action bg-[#F4A261] text-[#1F2A44] px-6 py-3 rounded-lg flex items-center mx-auto hover:bg-[#2C6E78] hover:text-white transition-colors"
          onClick={startOnlineSession}
        >
          <FaVideo className="mr-2" /> Démarrer maintenant
        </button>
      </div>
    </>
  );
};

interface ProfessorDashboardProps {
  children?: React.ReactNode;
}

const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [notifications] = useState<Notification[]>(mockNotifications);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'dark bg-[#1F2A44]' : 'bg-[#F9FAFB]'} transition-colors duration-300 font-roboto`}>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <Header
          toggleSidebar={toggleSidebar}
          theme={theme}
          toggleTheme={toggleTheme}
          unreadNotifications={unreadNotifications}
        />
        <main className="p-8">
          {children || <ProfessorDashboardContent />}
        </main>
      </div>
    </div>
  );
};

export default ProfessorDashboard;