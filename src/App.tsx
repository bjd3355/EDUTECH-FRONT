import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import SchedulePage from './pages/EmploiDuTemps/SchedulePage';
import CoursesPage from './pages/Cours/CoursesPage';
import LiveClassPage from './pages/VirtualClasses/LiveClassPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AssignmentsPage from './pages/Devoirs et Évaluations/AssignmentsPage'; // Importé correctement
import MessagesPage from './pages/components/MessagesPage';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 border-4 border-[#2CB3C2] border-t-transparent rounded-full animate-spin"></div>
      <span className="text-gray-600 text-lg">Chargement...</span>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<StudentDashboard />} /> {/* Tableau de bord par défaut */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/schedule" element={<StudentDashboard><SchedulePage /></StudentDashboard>} />
          <Route path="/courses" element={<StudentDashboard><CoursesPage /></StudentDashboard>} />
          <Route path="/live" element={<StudentDashboard><LiveClassPage /></StudentDashboard>} />
          <Route path="/profile" element={<StudentDashboard><ProfilePage /></StudentDashboard>} />
          <Route path="/assignments" element={<StudentDashboard><AssignmentsPage /></StudentDashboard>} /> {/* Route pour les devoirs */}
          <Route path="/messages" element={<StudentDashboard><MessagesPage /></StudentDashboard>} />
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Routes>
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
};

export default App;
