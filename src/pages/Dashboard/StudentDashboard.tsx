import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// Interfaces
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

interface Resource {
  id: number;
  title: string;
  type: string;
  uploadedAt: string;
}

interface Grade {
  id: number;
  course: string;
  grade: string;
  date: string;
}

interface Task {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
}

// Données simulées
const mockSchedule: ScheduleEvent[] = [
  { id: 1, title: "Cours 1", date: "01/04/2025", time: "17h30", status: "En ligne" },
  { id: 2, title: "Cours 2", date: "02/04/2025", time: "09h00", status: "En venir" },
  { id: 3, title: "Cours 3", date: "02/04/2025", time: "--:--", status: "À venir" },
];

const mockAssignments: Assignment[] = [
  { id: 1, title: "Devoir cours 1", dueDate: "25/04/2025", status: "À rendre" },
  { id: 2, title: "Devoir cours 2", dueDate: "--/--/----", status: "Note" },
  { id: 3, title: "Projet cours 3", dueDate: "01/04/2025", status: "Rendu" },
];

const mockNotifications: Notification[] = [
  { id: 1, message: "Nouveau support disponible.", time: "2025-03-27 08:00", read: false },
  { id: 2, message: "Rappel : Cours à 11h.", time: "2025-03-27 09:00", read: false },
];

const mockResources: Resource[] = [
  { id: 1, title: "Support Cours 1", type: "PDF", uploadedAt: "2025-03-25" },
  { id: 2, title: "Vidéo Cours 2", type: "Vidéo", uploadedAt: "2025-03-26" },
];

const mockGrades: Grade[] = [
  { id: 1, course: "Cours 1", grade: "A", date: "2025-03-20" },
  { id: 2, course: "Cours 2", grade: "B+", date: "2025-03-22" },
];

const mockTasks: Task[] = [
  { id: 1, title: "Réviser Cours 1", dueDate: "2025-04-02", completed: false },
  { id: 2, title: "Soumettre Projet", dueDate: "2025-04-02", completed: true },
];

const mockAnnouncements: Announcement[] = [
  { id: 1, title: "Examen reporté", content: "L'examen du 05/04 est reporté au 10/04.", date: "2025-03-28" },
  { id: 2, title: "Nouveau cours", content: "Un cours optionnel est ajouté.", date: "2025-03-29" },
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
  .hover-scale { transition: transform 0.3s ease; }
  .hover-scale:hover { transform: scale(1.02); }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = customStyles;
document.head.appendChild(styleSheet);

// Composant Notifications
const NotificationsSection: React.FC = () => {
  const [notifications] = useState<Notification[]>(mockNotifications);
  return (
    <div className="light-card p-4 rounded-lg hover-scale">
      <h2 className="text-md font-semibold mb-2 text-[#374151]">Notifications</h2>
      <ul className="space-y-2 max-h-40 overflow-y-auto">
        {notifications.map((n) => (
          <li key={n.id} className={`p-2 rounded-md ${n.read ? 'bg-gray-100' : 'bg-teal-50'}`}>
            <span className={n.read ? 'text-gray-500' : 'text-[#2C6E78] font-medium'}>
              {n.message}
            </span>
            <span className="block text-xs text-gray-400">{n.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Composant Progression
const ProgressWidget: React.FC = () => {
  const completedAssignments = mockAssignments.filter((a) => a.status === 'Rendu').length;
  const totalAssignments = mockAssignments.length;
  const progress = (completedAssignments / totalAssignments) * 100;

  return (
    <div className="light-card p-4 rounded-lg hover-scale">
      <h2 className="text-md font-semibold mb-2 text-[#374151]">Progression</h2>
      <div className="flex items-center">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="text-[#2C6E78]"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${progress}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-[#2C6E78]">{Math.round(progress)}%</span>
          </div>
        </div>
        <p className="ml-3 text-sm text-gray-600">
          {completedAssignments}/{totalAssignments}
        </p>
      </div>
    </div>
  );
};

// Composant Ressources
const ResourcesSection: React.FC = () => {
  const [resources] = useState<Resource[]>(mockResources);
  return (
    <div className="light-card p-4 rounded-lg hover-scale">
      <h2 className="text-md font-semibold mb-2 text-[#374151]">Ressources récentes</h2>
      <ul className="space-y-2 max-h-40 overflow-y-auto">
        {resources.map((r) => (
          <li key={r.id} className="p-2 rounded-md bg-gray-50">
            <span className="text-[#2C6E78] font-medium">{r.title}</span>
            <span className="block text-xs text-gray-400">
              {r.type} - {r.uploadedAt}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Composant Résumé des notes
const GradesSummary: React.FC = () => {
  const [grades] = useState<Grade[]>(mockGrades);
  return (
    <div className="light-card p-4 rounded-lg hover-scale">
      <h2 className="text-md font-semibold mb-2 text-[#374151]">Résumé des notes</h2>
      <ul className="space-y-2 max-h-40 overflow-y-auto">
        {grades.map((g) => (
          <li key={g.id} className="flex justify-between p-2 rounded-md bg-gray-50">
            <span className="text-[#2C6E78]">{g.course}</span>
            <span className="font-bold text-[#10B981]">{g.grade}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Composant Liste de tâches
const TasksSection: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const toggleTask = (id: number) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  return (
    <div className="light-card p-4 rounded-lg hover-scale">
      <h2 className="text-md font-semibold mb-2 text-[#374151]">Tâches</h2>
      <ul className="space-y-2 max-h-40 overflow-y-auto">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center p-2 rounded-md bg-gray-50">
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleTask(t.id)}
              className="mr-2"
            />
            <span className={t.completed ? 'line-through text-gray-500' : 'text-[#2C6E78]'}>
              {t.title} - {t.dueDate}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Composant Statistiques rapides
const QuickStats: React.FC = () => {
  const totalCourses = mockSchedule.length;
  const completedAssignments = mockAssignments.filter((a) => a.status === 'Rendu').length;
  const averageGrade = mockGrades.length ? "B" : "N/A"; // Simulation simple

  return (
    <div className="light-card p-4 rounded-lg hover-scale">
      <h2 className="text-md font-semibold mb-2 text-[#374151]">Statistiques rapides</h2>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-[#2C6E78]">Cours suivis :</span> {totalCourses}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-[#2C6E78]">Devoirs rendus :</span> {completedAssignments}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-[#2C6E78]">Moyenne :</span> {averageGrade}
        </p>
      </div>
    </div>
  );
};

// Composant Annonces
const AnnouncementsSection: React.FC = () => {
  const [announcements] = useState<Announcement[]>(mockAnnouncements);
  return (
    <div className="light-card p-4 rounded-lg hover-scale">
      <h2 className="text-md font-semibold mb-2 text-[#374151]">Annonces</h2>
      <ul className="space-y-2 max-h-40 overflow-y-auto">
        {announcements.map((a) => (
          <li key={a.id} className="p-2 rounded-md bg-gray-50">
            <span className="text-[#2C6E78] font-medium">{a.title}</span>
            <span className="block text-xs text-gray-600">{a.content}</span>
            <span className="block text-xs text-gray-400">{a.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Composant Agenda du jour
const TodayAgenda: React.FC = () => {
  const today = "02/04/2025"; // Simulé pour correspondre à la date actuelle (exemple)
  const todayEvents = mockSchedule.filter((e) => e.date === today);
  const todayTasks = mockTasks.filter((t) => t.dueDate === today);

  return (
    <div className="light-card p-4 rounded-lg hover-scale">
      <h2 className="text-md font-semibold mb-2 text-[#374151]">Agenda du jour ({today})</h2>
      <ul className="space-y-2 max-h-40 overflow-y-auto">
        {todayEvents.map((e) => (
          <li key={e.id} className="p-2 rounded-md bg-teal-50">
            <span className="text-[#2C6E78]">{e.title} - {e.time}</span>
          </li>
        ))}
        {todayTasks.map((t) => (
          <li key={t.id} className="p-2 rounded-md bg-gray-50">
            <span className={t.completed ? 'line-through text-gray-500' : 'text-[#2C6E78]'}>
              {t.title}
            </span>
          </li>
        ))}
        {todayEvents.length === 0 && todayTasks.length === 0 && (
          <li className="text-sm text-gray-500">Rien prévu aujourd'hui.</li>
        )}
      </ul>
    </div>
  );
};

// Composant principal
const DashboardContent: React.FC = () => {
  const [schedule] = useState<ScheduleEvent[]>(mockSchedule);
  const [assignments] = useState<Assignment[]>(mockAssignments);
  const [assignmentFilter, setAssignmentFilter] = useState<string>('Tous');
  const [scheduleFilter, setScheduleFilter] = useState<string>('Tous');

  const filteredAssignments =
    assignmentFilter === 'Tous'
      ? assignments
      : assignments.filter((a) => a.status === assignmentFilter);
  const filteredSchedule =
    scheduleFilter === 'Tous' ? schedule : schedule.filter((s) => s.status === scheduleFilter);

  return (
    <>
      {/* Bannière */}
      <div className="relative bg-[#4B7285] text-white rounded-xl p-8 mb-6 flex items-center justify-between overflow-hidden w-full max-w-screen-xl mx-auto shadow-xl">
        <div className="z-10 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4 tracking-wide">
            BIENVENUE SUR{' '}
            <span className="text-5xl text-[#1E3A8A] font-extrabold drop-shadow-md">EDUTECH</span>
          </h1>
          <p className="text-lg opacity-95 text-gray-100">Pôle Sciences et Technologie</p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-end pr-8">
          <div className="relative w-56 h-56 rounded-full overflow-hidden border-6 border-white shadow-lg hover-scale">
            <img
              src="/src/pages/assets/fond.jpg"
              alt="Étudiant"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 left-16 w-28 h-28 rounded-full bg-teal-300"></div>
          <div className="absolute bottom-10 left-32 w-24 h-24 rounded-full bg-teal-400"></div>
        </div>
      </div>

      <nav className="text-sm text-gray-500 mb-4">
        <span>Accueil / Tableau de bord</span>
      </nav>
      <h1 className="text-2xl font-bold mb-6 text-[#2C6E78]">Tableau de bord</h1>

      {/* Ligne 1 : Devoirs + Prochains cours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="light-card p-6 rounded-lg hover-scale">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#374151]">Devoirs</h2>
            <select
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value)}
              className="p-2 rounded-lg border border-gray-300"
            >
              <option>Tous</option>
              <option>À rendre</option>
              <option>Note</option>
              <option>Rendu</option>
            </select>
          </div>
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
                {filteredAssignments.map((assignment) => (
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

        <div className="light-card p-6 rounded-lg hover-scale">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#374151]">Prochains cours</h2>
            <select
              value={scheduleFilter}
              onChange={(e) => setScheduleFilter(e.target.value)}
              className="p-2 rounded-lg border border-gray-300"
            >
              <option>Tous</option>
              <option>En ligne</option>
              <option>En venir</option>
              <option>À venir</option>
              <option>Annuler</option>
            </select>
          </div>
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
                {filteredSchedule.map((event) => (
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

      {/* Ligne 2 : Notifications + Annonces */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <NotificationsSection />
        <AnnouncementsSection />
      </div>

      {/* Ligne 3 : Progression + Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ProgressWidget />
        <QuickStats />
      </div>

      {/* Ligne 4 : Ressources + Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ResourcesSection />
        <GradesSummary />
      </div>

      {/* Ligne 5 : Tâches + Agenda du jour */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TasksSection />
        <TodayAgenda />
      </div>
    </>
  );
};

// Composant principal
interface StudentDashboardProps {
  children?: React.ReactNode;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [notifications] = useState<Notification[]>(mockNotifications);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div
      className={`min-h-screen flex ${
        theme === 'dark' ? 'dark bg-[#1F2A44]' : 'bg-[#F9FAFB]'
      } transition-colors duration-300 font-roboto`}
    >
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <Header
          toggleSidebar={toggleSidebar}
          theme={theme}
          toggleTheme={toggleTheme}
          unreadNotifications={unreadNotifications}
        />
        <main className="p-8">{children || <DashboardContent />}</main>
      </div>
    </div>
  );
};

export default StudentDashboard;
