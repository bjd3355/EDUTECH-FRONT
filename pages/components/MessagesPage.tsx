import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaBell, FaCalendarAlt, FaGift, FaExclamationCircle, FaCheck, FaTimes, FaTrash, FaFilter } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Interfaces
interface Notification {
  id: number;
  type: 'reminder' | 'announcement' | 'birthday' | 'general' | 'festival';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  imageUrl?: string; // Propriété optionnelle pour les images
}

interface Message {
  id: number;
  sender: string;
  subject: string;
  content: string;
  date: string;
  isRead: boolean;
}

// Mock data avec des images locales
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'reminder',
    title: 'Rappel : Devoir à corriger',
    message: 'Vous devez corriger le devoir « Projet cours 3 » avant le 26/03/2025.',
    date: '25/03/2025 10:00',
    isRead: false,
  },
  {
    id: 2,
    type: 'birthday',
    title: 'Joyeux anniversaire !',
    message: 'Toute l’équipe d’EduTech vous souhaite un joyeux anniversaire ! 🎉',
    date: '27/03/2025 08:00',
    isRead: false,
  },
  {
    id: 3,
    type: 'announcement',
    title: 'Annonce : Réunion pédagogique',
    message: 'Réunion prévue le 27/03/2025 à 14h00 en salle A12.',
    date: '26/03/2025 15:30',
    isRead: true,
  },
  {
    id: 4,
    type: 'general',
    title: 'Maintenance prévue',
    message: 'La plateforme sera en maintenance le 28/03/2025 de 22h à 23h.',
    date: '26/03/2025 09:00',
    isRead: true,
  },
  {
    id: 5,
    type: 'festival',
    title: 'Bonne fête de Korité !',
    message: 'L’équipe d’EduTech vous souhaite une joyeuse fête de Korité pleine de paix et de bonheur !',
    date: '04/04/2025 08:00',
    isRead: false,
    imageUrl: '/assets/dewenaty.jpg', // Chemin vers l'image dans public/assets/
  },
  {
    id: 6,
    type: 'festival',
    title: 'Joyeuses Pâques !',
    message: 'Profitez de cette fête de Pâques avec vos proches, l’équipe vous souhaite une excellente journée !',
    date: '20/04/2025 08:00',
    isRead: false,
    imageUrl: '/assets/paque.jpg', // Chemin vers l'image dans public/assets/
  },
  {
    id: 7,
    type: 'announcement',
    title: 'Weekend à Saly',
    message: 'Uniprosien(ne)s,\n\nNous sommes ravis de vous annoncer un weekend exceptionnel à Saly ! Ce sera l’occasion parfaite pour se détendre, profiter du soleil et passer du bon temps ensemble. Préparez-vous pour des activités amusantes, des moments de partage et une ambiance conviviale.\n\nNous avons hâte de vous voir tous là-bas !',
    date: '04/04/2025 10:00',
    isRead: false,
    imageUrl: '/assets/saly.jpg', // Chemin fictif vers une image pour Saly
  },
  {
    id: 8,
    type: 'announcement',
    title: 'Soirée Uniprosienne',
    message: 'Uniprosien(ne)s,\n\nRejoignez-nous pour une weekend mémorable  ! Au programme : musique, danse et bonne humeur. Une excellente occasion de renforcer nos liens et de célébrer notre communauté.\n\nOn compte sur vous !',
    date: '04/04/2025 12:00',
    isRead: false,
    imageUrl: '/assets/salybis.jpg', // Chemin fictif vers une image pour la soirée
  },
];

const mockMessages: Message[] = [
  {
    id: 1,
    sender: 'Étudiant A',
    subject: 'Demande de clarification',
    content: 'Bonjour, pourriez-vous expliquer davantage le chapitre sur les algorithmes de tri ? Merci !',
    date: '25/03/2025 14:20',
    isRead: false,
  },
  {
    id: 2,
    sender: 'Administration',
    subject: 'Rappel : Rapport mensuel',
    content: 'N’oubliez pas de soumettre votre rapport mensuel avant le 30/03/2025.',
    date: '24/03/2025 09:00',
    isRead: true,
  },
  {
    id: 3,
    sender: 'Collègue B',
    subject: 'Proposition de collaboration',
    content: 'Bonjour, intéressé(e) pour co-animer un atelier sur l’IA ?',
    date: '23/03/2025 16:45',
    isRead: true,
  },
];

const MessagesPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState<'notifications' | 'messages'>('notifications');
  const [filterType, setFilterType] = useState<string>('Tous');

  useEffect(() => {
    setTimeout(() => {
      setNotifications(mockNotifications);
      setMessages(mockMessages);
      setIsLoading(false);
    }, 1000);
  }, []);

  const markAsRead = (id: number, type: 'notification' | 'message'): void => {
    if (type === 'notification') {
      setNotifications(notifications.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      ));
      toast.success('Notification marquée comme lue !', { icon: <FaCheck /> });
    } else {
      setMessages(messages.map(msg =>
        msg.id === id ? { ...msg, isRead: true } : msg
      ));
      toast.success('Message marqué comme lu !', { icon: <FaCheck /> });
    }
  };

  const deleteItem = (id: number, type: 'notification' | 'message'): void => {
    if (type === 'notification') {
      setNotifications(notifications.filter(notif => notif.id !== id));
      toast.success('Notification supprimée !', { icon: <FaTrash /> });
    } else {
      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      toast.success('Message supprimé !', { icon: <FaTrash /> });
    }
  };

  const getIconForNotification = (type: Notification['type']): JSX.Element => {
    switch (type) {
      case 'reminder':
        return <FaCalendarAlt className="text-orange-500 animate-pulse" />;
      case 'birthday':
        return <FaGift className="text-pink-500 animate-bounce-slow" />;
      case 'announcement':
        return <FaExclamationCircle className="text-blue-500" />;
      case 'general':
        return <FaBell className="text-gray-500" />;
      case 'festival':
        return <FaGift className="text-purple-500 animate-bounce" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notif =>
    filterType === 'Tous' || notif.type === filterType
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 pt-[64px] px-4 sm:px-6 lg:p-8">
      {/* En-tête */}
      <motion.header
        className="mb-8 sm:mb-12 text-center relative"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#6B7280] via-[#2CB3C2] to-[#1A8A97] bg-clip-text text-transparent flex justify-center items-center">
          <FaEnvelope className="mr-4 text-[#2CB3C2] animate-spin-slow" /> Messages et notifications
        </h1>
      </motion.header>

      {/* Onglets pour naviguer entre Notifications et Messages */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-center gap-4">
          <motion.button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 rounded-xl shadow-lg flex items-center ${activeTab === 'notifications' ? 'bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaBell className="mr-2" /> Notifications
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 rounded-xl shadow-lg flex items-center ${activeTab === 'messages' ? 'bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaEnvelope className="mr-2" /> Messages
          </motion.button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <FaFilter className="text-[#2CB3C2]" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]/20"
              >
                <option value="Tous">Tous les types</option>
                <option value="reminder">Rappels</option>
                <option value="announcement">Annonces</option>
                <option value="birthday">Anniversaires</option>
                <option value="general">Général</option>
                <option value="festival">Festivals</option>
              </select>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-[100px] bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map(notif => (
                  <motion.div
                    key={notif.id}
                    className={`p-4 rounded-xl border ${notif.isRead ? 'bg-gray-100' : 'bg-white'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-start space-x-4">
                      {getIconForNotification(notif.type)}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{notif.title}</h3>
                        <p className="text-gray-600 whitespace-pre-line">{notif.message}</p> {/* whitespace-pre-line pour conserver les sauts de ligne */}
                        <p className="text-sm text-gray-500">{notif.date}</p>
                        {notif.imageUrl && (
                          <img
                            src={notif.imageUrl}
                            alt={notif.title}
                            className="mt-2 rounded-lg shadow-md max-w-full h-auto max-h-48 object-cover"
                          />
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!notif.isRead && (
                          <button onClick={() => markAsRead(notif.id, 'notification')} className="text-[#2CB3C2]">
                            <FaCheck />
                          </button>
                        )}
                        <button onClick={() => deleteItem(notif.id, 'notification')} className="text-gray-500 hover:text-red-500">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">Aucune notification</p>
            )}
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-[100px] bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : messages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  {messages.map(msg => (
                    <motion.div
                      key={msg.id}
                      className={`p-4 rounded-xl border cursor-pointer ${msg.isRead ? 'bg-gray-100' : 'bg-white'} ${selectedMessage?.id === msg.id ? 'border-[#2CB3C2]' : ''}`}
                      onClick={() => setSelectedMessage(msg)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-lg font-semibold">{msg.subject}</h3>
                      <p className="text-gray-600 line-clamp-1">{msg.content}</p>
                      <p className="text-sm text-gray-500">{msg.date}</p>
                      <div className="flex gap-2 mt-2">
                        {!msg.isRead && (
                          <button onClick={(e) => { e.stopPropagation(); markAsRead(msg.id, 'message'); }} className="text-[#2CB3C2]">
                            <FaCheck />
                          </button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); deleteItem(msg.id, 'message'); }} className="text-gray-500 hover:text-red-500">
                          <FaTrash />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  {selectedMessage ? (
                    <div>
                      <h3 className="text-xl font-semibold">{selectedMessage.subject}</h3>
                      <p className="text-gray-600">De : {selectedMessage.sender}</p>
                      <p className="text-gray-500 text-sm">{selectedMessage.date}</p>
                      <p className="text-gray-700 mt-4">{selectedMessage.content}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center">Sélectionnez un message</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center">Aucun message</p>
            )}
          </motion.div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover theme="colored" />
    </div>
  );
};

export default MessagesPage;