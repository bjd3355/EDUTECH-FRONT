import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaBell, FaCalendarAlt, FaGift, FaExclamationCircle, FaCheck, FaTimes, FaTrash, FaFilter } from 'react-icons/fa';
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
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
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notif =>
    filterType === 'Tous' || notif.type === filterType
  );

  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  };

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

      {/* Boutons pour ouvrir les modales */}
      <div className="max-w-6xl mx-auto flex justify-center gap-4 mb-8">
        <motion.button
          onClick={() => setIsNotificationModalOpen(true)}
          className="bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white px-6 py-3 rounded-xl shadow-lg flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaBell className="mr-2" /> Notifications
        </motion.button>
        <motion.button
          onClick={() => setIsMessageModalOpen(true)}
          className="bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white px-6 py-3 rounded-xl shadow-lg flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaEnvelope className="mr-2" /> Messages
        </motion.button>
      </div>

      {/* Modal Notifications */}
      <AnimatePresence>
        {isNotificationModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto sm:ml-[250px] sm:mr-4"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaBell className="mr-2 text-[#2CB3C2]" /> Notifications
                </h2>
                <button onClick={() => setIsNotificationModalOpen(false)} className="text-gray-500 hover:text-red-500">
                  <FaTimes size={24} />
                </button>
              </div>

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
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex items-start space-x-4">
                        {getIconForNotification(notif.type)}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{notif.title}</h3>
                          <p className="text-gray-600">{notif.message}</p>
                          <p className="text-sm text-gray-500">{notif.date}</p>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Messages */}
      <AnimatePresence>
        {isMessageModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto sm:ml-[250px] sm:mr-4"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaEnvelope className="mr-2 text-[#2CB3C2]" /> Messages
                </h2>
                <button onClick={() => setIsMessageModalOpen(false)} className="text-gray-500 hover:text-red-500">
                  <FaTimes size={24} />
                </button>
              </div>

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
                        exit={{ opacity: 0, y: -20 }}
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
                  <div>
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
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover theme="colored" />
    </div>
  );
};

export default MessagesPage;