import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaVideo, FaMicrophone, FaMicrophoneSlash, FaShareSquare, FaComment } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const LiveClassPage: React.FC = () => {
  const { t } = useTranslation();
  const [micOn, setMicOn] = useState<boolean>(true);
  const [screenSharing, setScreenSharing] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ text: string; sender: string; time: string }[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSendMessage = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newMessage.trim()) {
      setMessages([...messages, {
        text: newMessage,
        sender: 'Moi',
        time: new Date().toLocaleTimeString(),
      }]);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col">
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#2CB3C2] flex items-center">
          <FaVideo className="mr-2" /> {t('classeVirtuelle')}
        </h1>
      </motion.header>

      <div className="flex-1 flex space-x-6">
        {/* Zone vidéo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 bg-[rgba(44,179,194,0.54)] p-6 rounded-xl shadow-lg"
        >
          <div className="bg-gray-300 h-96 rounded-lg mb-4 flex items-center justify-center">
            <p className="text-gray-600">{t('fluxVideo')}</p>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setMicOn(!micOn)}
              className="p-2 bg-[#2CB3C2] text-white rounded-full"
            >
              {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </button>
            <button
              onClick={() => setScreenSharing(!screenSharing)}
              className={`p-2 ${screenSharing ? 'bg-green-500' : 'bg-[#2CB3C2]'} text-white rounded-full`}
            >
              <FaShareSquare />
            </button>
          </div>
        </motion.div>

        {/* Zone chat */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-80 bg-white p-4 rounded-xl shadow-lg"
        >
          <h2 className="text-lg font-semibold text-[#2CB3C2] mb-4 flex items-center">
            <FaComment className="mr-2" /> {t('chat')}
          </h2>
          <div className="h-64 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === 'Moi' ? 'text-right' : 'text-left'}`}>
                <p className={`inline-block p-2 rounded-lg ${msg.sender === 'Moi' ? 'bg-[#2CB3C2] text-white' : 'bg-gray-200'}`}>
                  {msg.text} <span className="text-xs">{msg.time}</span>
                </p>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleSendMessage}
            placeholder={t('ecrireMessage')}
            className="w-full p-2 border border-[#2CB3C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LiveClassPage;