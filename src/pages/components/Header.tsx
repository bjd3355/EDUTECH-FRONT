import React from 'react';
import { FaBell, FaUserCircle, FaSun, FaMoon } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  unreadNotifications: number; // Nombre de notifications non lues
  profilePicture?: string; // URL de l'image de profil (optionnelle)
  isDarkTheme: boolean; // État du thème (clair ou sombre)
  toggleTheme: () => void; // Fonction pour basculer le thème
}

const Header: React.FC<HeaderProps> = ({ unreadNotifications, profilePicture, isDarkTheme, toggleTheme }) => {
  const navigate = useNavigate();

  // Gestion du clic sur la notification
  const handleNotificationClick = () => {
    navigate('/messages');
  };

  // Gestion du clic sur l'image de profil
  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-[#2C6E78] shadow-lg p-4 flex justify-between items-center sticky top-0 z-50">
      {/* Section gauche : Logo "EduTech" avec une belle police */}
      <div
        className="text-2xl font-extrabold text-white font-['Poppins'] tracking-wide cursor-pointer transition-colors duration-300 hover:text-[#F4A261]"
        onClick={() => navigate('/dashboard')}
      >
        EDUTECH
      </div>

      {/* Section droite : Notifications, Profil, Thème */}
      <div className="flex items-center space-x-6">
        {/* Icône de notification avec badge */}
        <div
          className="relative group cursor-pointer"
          onClick={handleNotificationClick}
          title="Notifications"
        >
          <FaBell className="text-2xl text-white transition-transform duration-300 group-hover:scale-110 group-hover:text-[#F4A261]" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#F4A261] rounded-full text-[#1F2A44] text-xs font-bold flex items-center justify-center animate-pulse">
              {unreadNotifications}
            </span>
          )}
        </div>

        {/* Image de profil */}
        <div
          className="relative group cursor-pointer"
          onClick={handleProfileClick}
          title="Profil"
        >
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profil"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:border-[#F4A261]"
            />
          ) : (
            <FaUserCircle className="text-3xl text-white transition-transform duration-300 group-hover:scale-110 group-hover:text-[#F4A261]" />
          )}
        </div>

        {/* Bascule de thème */}
        <div
          className="relative group cursor-pointer"
          onClick={toggleTheme}
          title={isDarkTheme ? 'Passer au thème clair' : 'Passer au thème sombre'}
        >
          {isDarkTheme ? (
            <FaSun className="text-2xl text-white transition-transform duration-300 group-hover:scale-110 group-hover:text-[#F4A261]" />
          ) : (
            <FaMoon className="text-2xl text-white transition-transform duration-300 group-hover:scale-110 group-hover:text-[#F4A261]" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;