import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaBell, FaCalendarAlt, FaGift, FaExclamationCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Interface pour les notifications et messages
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

// Données mock pour les notifications et messages
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'reminder',
    title: 'Rappel : Devoir à rendre',
    message: 'Vous devez rendre le devoir "Projet cours 3" avant le 26/03/2025.',
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
    title: 'Annonce : Cours annulé',
    message: 'Le cours de Programmation Orientée Objet du 27/03/2025 est annulé.',
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
    sender: 'Prof. Dupont',
    subject: 'Feedback sur votre dernier devoir',
    content: 'Bonjour, votre dernier devoir est excellent ! Continuez comme ça.',
    date: '25/03/2025 14:20',
    isRead: false,
  },
  {
    id: 2,
    sender: 'Administration',
    subject: 'Rappel : Inscription aux examens',
    content: 'N’oubliez pas de vous inscrire aux examens avant le 30/03/2025.',
    date: '24/03/2025 09:00',
    isRead: true,
  },
  {
    id: 3,
    sender: 'Prof. Martin',
    subject: 'Ressources supplémentaires',
    content: 'Voici un lien vers des ressources pour le cours d’Intelligence Artificielle.',
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
    } else {
      setMessages(messages.map(msg =>
        msg.id === id ? { ...msg, isRead: true } : msg
      ));
    }
  };

  const getIconForNotification = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return <FaCalendarAlt className="text-orange-500" />;
      case 'birthday':
        return <FaGift className="text-pink-500" />;
      case 'announcement':
        return <FaExclamationCircle className="text-blue-500" />;
      case 'general':
        return <FaBell className="text-gray-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold text-[#2CB3C2] flex justify-center items-center">
          <FaEnvelope className="mr-3 text-[#2CB3C2]" /> {t('Annonces du site')}
        </h1>
        <div className="mt-2 h-1 w-32 bg-[#2CB3C2] mx-auto rounded-full"></div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* Notifications Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-4">
            <FaBell className="mr-2 text-[#2CB3C2]" /> {t('notifications')}
          </h2>
          {isLoading ? (
            <Skeleton height={80} count={3} className="mb-4 rounded-lg" />
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map(notif => (
                <motion.div
                  key={notif.id}
                  className={`p-4 rounded-lg shadow-md flex items-start space-x-4 ${
                    notif.isRead ? 'bg-gray-100' : 'bg-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-2xl">{getIconForNotification(notif.type)}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{notif.title}</h3>
                    <p className="text-gray-600">{notif.message}</p>
                    <p className="text-sm text-gray-500 mt-1">{notif.date}</p>
                  </div>
                  {!notif.isRead && (
                    <button
                      onClick={() => markAsRead(notif.id, 'notification')}
                      className="text-sm text-[#2CB3C2] hover:underline"
                    >
                      {t('marquerCommeLu')}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">{t('aucuneNotification')}</p>
          )}
        </div>

        {/* Messages Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-4">
            <FaEnvelope className="mr-2 text-[#2CB3C2]" /> {t('messages')}
          </h2>
          {isLoading ? (
            <Skeleton height={80} count={3} className="mb-4 rounded-lg" />
          ) : messages.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Liste des messages */}
              <div className="space-y-4">
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    className={`p-4 rounded-lg shadow-md flex items-center justify-between cursor-pointer ${
                      msg.isRead ? 'bg-gray-100' : 'bg-white'
                    } ${selectedMessage?.id === msg.id ? 'border-2 border-[#2CB3C2]' : ''}`}
                    onClick={() => setSelectedMessage(msg)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{msg.subject}</h3>
                      <p className="text-gray-600 line-clamp-1">{msg.content}</p>
                      <p className="text-sm text-gray-500 mt-1">{msg.date}</p>
                    </div>
                    {!msg.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(msg.id, 'message');
                        }}
                        className="text-sm text-[#2CB3C2] hover:underline"
                      >
                        {t('marquerCommeLu')}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Détail du message sélectionné */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                {selectedMessage ? (
                  <>
                    <h3 className="text-xl font-semibold text-gray-800">{selectedMessage.subject}</h3>
                    <p className="text-gray-600 mt-2">De : {selectedMessage.sender}</p>
                    <p className="text-gray-500 text-sm mt-1">{selectedMessage.date}</p>
                    <p className="text-gray-700 mt-4 leading-relaxed">{selectedMessage.content}</p>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="mt-4 px-4 py-2 bg-[#2CB3C2] text-white rounded-lg hover:bg-[#218a91] transition-colors"
                    >
                      {t('fermer')}
                    </button>
                  </>
                ) : (
                  <p className="text-gray-600">{t('selectionnerMessage')}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">{t('aucunMessage')}</p>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default MessagesPage;