import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaBell, FaCalendarAlt, FaGift, FaExclamationCircle, FaCheck, FaTimes, FaTrash, FaFilter } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Interfaces
interface Notification {
  id: number;
  type: 'reminder' | 'announcement' | 'birthday' | 'general';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

interface Message {
  id: number;
  sender: string;
  subject: string;
  content: string;
  date: string;
  isRead: boolean;
}

// Mock data
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
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filterType, setFilterType] = useState<string>('Tous');

  useEffect(() => {
    setTimeout(() => {
      setNotifications(mockNotifications);
      setMessages(mockMessages);
      setIsLoading(false);
    }, 1000);
  }, []);

  const markAsRead = (id: number, type: 'notification' | 'message') => {
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

  const deleteItem = (id: number, type: 'notification' | 'message') => {
    if (type === 'notification') {
      setNotifications(notifications.filter(notif => notif.id !== id));
      toast.success('Notification supprimée !', { icon: <FaTrash /> });
    } else {
      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      toast.success('Message supprimé !', { icon: <FaTrash /> });
    }
  };

  const getIconForNotification = (type: Notification['type']) => {
    switch (type) {
      case 'reminder': return <FaCalendarAlt className="text-orange-500 animate-pulse" />;
      case 'birthday': return <FaGift className="text-pink-500 animate-bounce-slow" />;
      case 'announcement': return <FaExclamationCircle className="text-blue-500" />;
      case 'general': return <FaBell className="text-gray-500" />;
      default: return <FaBell className="text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notif =>
    filterType === 'Tous' || notif.type === filterType
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 px-4 sm:px-6 lg:p-8">
      {/* En-tête */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-8 sm:mb-12 text-center relative"
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#6B7280] via-[#2CB3C2] to-[#1A8A97] bg-clip-text text-transparent flex justify-center items-center">
          <FaEnvelope className="mr-4 text-[#2CB3C2] animate-spin-slow" /> Messages et notifications
        </h1>
        <motion.div
          className="mt-3 h-1 w-24 sm:w-40 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] mx-auto rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-full sm:max-w-6xl mx-auto"
      >
        {/* Filtre pour les notifications */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <FaFilter className="text-[#2CB3C2] animate-bounce-slow" />
          <motion.select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#2CB3C2]/20 focus:border-[#2CB3C2] bg-white shadow-md transition-all duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <option value="Tous">Tous les types</option>
            <option value="reminder">Rappels</option>
            <option value="announcement">Annonces</option>
            <option value="birthday">Anniversaires</option>
            <option value="general">Général</option>
          </motion.select>
        </div>

        {/* Section des notifications */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center justify-center mb-6">
            <FaBell className="mr-3 text-[#2CB3C2] animate-pulse" /> Notifications
          </h2>
          {isLoading ? (
            <Skeleton height={100} count={3} className="mb-6 rounded-2xl" />
          ) : filteredNotifications.length > 0 ? (
            <div className="space-y-6">
              <AnimatePresence>
                {filteredNotifications.map(notif => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className={`p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start space-x-0 sm:space-x-4 ${
                      notif.isRead ? 'bg-gray-100' : 'bg-white'
                    } border border-gray-200 hover:shadow-xl transition-all duration-300`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-3xl">{getIconForNotification(notif.type)}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">{notif.title}</h3>
                      <p className="text-gray-600 mt-1">{notif.message}</p>
                      <p className="text-sm text-gray-500 mt-2">{notif.date}</p>
                    </div>
                    <div className="flex gap-3">
                      {!notif.isRead && (
                        <motion.button
                          onClick={() => markAsRead(notif.id, 'notification')}
                          className="text-[#2CB3C2] hover:text-[#1A8A97] transition-colors duration-200"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaCheck className="text-xl" />
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => deleteItem(notif.id, 'notification')}
                        className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaTrash className="text-xl" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.p
              className="text-gray-500 text-lg italic text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Aucune notification pour le moment...
            </motion.p>
          )}
        </div>

        {/* Section des messages */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center justify-center mb-6">
            <FaEnvelope className="mr-3 text-[#2CB3C2] animate-pulse" /> Messages
          </h2>
          {isLoading ? (
            <Skeleton height={100} count={3} className="mb-6 rounded-2xl" />
          ) : messages.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Liste des messages */}
              <div className="space-y-6">
                <AnimatePresence>
                  {messages.map(msg => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className={`p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between cursor-pointer ${
                        msg.isRead ? 'bg-gray-100' : 'bg-white'
                      } ${selectedMessage?.id === msg.id ? 'border-2 border-[#2CB3C2]' : ''} border border-gray-200 hover:shadow-xl transition-all duration-300`}
                      onClick={() => setSelectedMessage(msg)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{msg.subject}</h3>
                        <p className="text-gray-600 line-clamp-1 mt-1">{msg.content}</p>
                        <p className="text-sm text-gray-500 mt-2">{msg.date}</p>
                      </div>
                      <div className="flex gap-3">
                        {!msg.isRead && (
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(msg.id, 'message');
                            }}
                            className="text-[#2CB3C2] hover:text-[#1A8A97] transition-colors duration-200"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaCheck className="text-xl" />
                          </motion.button>
                        )}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(msg.id, 'message');
                          }}
                          className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaTrash className="text-xl" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Détail du message sélectionné */}
              <motion.div
                className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-200"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                {selectedMessage ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-semibold text-gray-800">{selectedMessage.subject}</h3>
                    <p className="text-gray-600 mt-2">De : {selectedMessage.sender}</p>
                    <p className="text-gray-500 text-sm mt-1">{selectedMessage.date}</p>
                    <p className="text-gray-700 mt-4 leading-relaxed">{selectedMessage.content}</p>
                    <motion.button
                      onClick={() => setSelectedMessage(null)}
                      className="mt-6 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white px-6 py-2 rounded-xl shadow-lg hover:from-[#1A8A97] hover:to-[#2CB3C2] transition-all duration-300 w-full sm:w-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Fermer
                    </motion.button>
                  </motion.div>
                ) : (
                  <p className="text-gray-500 text-lg italic text-center">Sélectionnez un message pour voir les détails...</p>
                )}
              </motion.div>
            </div>
          ) : (
            <motion.p
              className="text-gray-500 text-lg italic text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Aucun message pour le moment...
            </motion.p>
          )}
        </div>
      </motion.section>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="colored"
        className="font-semibold"
      />
    </div>
  );
};

export default MessagesPage;