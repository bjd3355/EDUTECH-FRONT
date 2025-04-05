import React from 'react';
import { FaBell, FaUserCircle, FaSun, FaMoon } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  unreadNotifications: number;
  profilePicture?: string;
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ unreadNotifications, profilePicture, isDarkTheme, toggleTheme }) => {
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    navigate('/messages');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-[#2C6E78] shadow-lg px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-50 min-h-[64px]">
      {/* Section gauche : Logo "EduTech" */}
      <div
        className="text-xl sm:text-2xl font-extrabold text-white font-['Poppins'] tracking-wide cursor-pointer transition-colors duration-300 hover:text-[#F4A261] mb-4 sm:mb-0"
        onClick={() => navigate('/dashboard')}
      >
        EDUTECH
      </div>

      {/* Section droite : Notifications, Profil, Thème */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        {/* Icône de notification avec badge */}
        <div
          className="relative group cursor-pointer"
          onClick={handleNotificationClick}
          title="Notifications"
        >
          <FaBell className="text-xl sm:text-2xl text-white transition-transform duration-300 group-hover:scale-110 group-hover:text-[#F4A261]" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-2 -right-2 w-4 sm:w-5 h-4 sm:h-5 bg-[#F4A261] rounded-full text-[#1F2A44] text-xs font-bold flex items-center justify-center animate-pulse">
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
              className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover border-2 border-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:border-[#F4A261]"
            />
          ) : (
            <FaUserCircle className="text-2xl sm:text-3xl text-white transition-transform duration-300 group-hover:scale-110 group-hover:text-[#F4A261]" />
          )}
        </div>

        {/* Bascule de thème */}
        <div
          className="relative group cursor-pointer"
          onClick={toggleTheme}
          title={isDarkTheme ? 'Passer au thème clair' : 'Passer au thème sombre'}
        >
          {isDarkTheme ? (
            <FaSun className="text-xl sm:text-2xl text-white transition-transform duration-300 group-hover:scale-110 group-hover:text-[#F4A261]" />
          ) : (
            <FaMoon className="text-xl sm:text-2xl text-white transition-transform duration-300 group-hover:scale-110 group-hover:text-[#F4A261]" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;