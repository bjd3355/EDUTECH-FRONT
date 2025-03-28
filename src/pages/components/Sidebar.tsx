import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaCalendar, FaBook, FaClipboardList, FaEnvelope, FaUser, FaSignOutAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; // Ajout de useNavigate
import logo from '../assets/logo.png';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate(); // Hook pour la navigation

  // Gestion de la déconnexion
  const handleLogout = () => {
    // Vous pouvez ajouter ici votre logique de déconnexion (ex: supprimer token, etc.)
    alert('Vous êtes déconnecté'); // Message de confirmation
    navigate('/login'); // Redirection vers la page de login
  };

  // Variantes d'animation pour une transition plus fluide
  const sidebarVariants = {
    open: { width: 256 },
    closed: { width: 64 }
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="closed"
      animate={sidebarOpen ? 'open' : 'closed'}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bg-[#2C6E78] text-white p-4 flex flex-col fixed h-screen z-30 shadow-lg font-roboto"
    >
      {/* Logo et bouton de toggle */}
      <div className="flex items-center justify-between mb-8">
        <motion.div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <img src={logo} alt="Logo" className="w-10 h-10" />
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-[#F4A261] text-[#1F2A44]"
        >
          {sidebarOpen ? <FaChevronLeft size={20} /> : <FaChevronRight size={20} />}
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto"> {/* Ajout de overflow-y-auto pour le scroll */}
        <ul className="space-y-2">
          {[
            { label: 'Tableau de bord', icon: <FaHome size={24} />, path: '/dashboard' },
            { label: 'Mes cours', icon: <FaBook size={24} />, path: '/courses' },
            { label: 'Emploi du temps', icon: <FaCalendar size={24} />, path: '/schedule' },
            { label: 'Devoirs et Évaluations', icon: <FaClipboardList size={24} />, path: '/assignments' },
            { label: 'Messages et notifications', icon: <FaEnvelope size={24} />, path: '/messages'},
            { label: 'Mon Profil', icon: <FaUser size={24} />, path: '/profile' },
          ].map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg sidebar-item"
            >
              <Link
                to={item.path}
                className={`flex items-center p-3 ${sidebarOpen ? 'space-x-4' : 'justify-center'} text-white hover:bg-[#3A8791] hover:text-[#F4A261] transition-all duration-200 rounded-lg`}
              >
                <span className="text-2xl">{item.icon}</span>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-base font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Bouton Déconnexion */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="mt-auto p-3 bg-red-500 rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition-colors duration-200"
      >
        <FaSignOutAlt size={20} />
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="ml-2 text-base font-medium"
            >
              Déconnexion
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.aside>
  );
};

export default Sidebar;