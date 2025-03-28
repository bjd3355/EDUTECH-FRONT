import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendar, FaFilter } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ScheduleEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  course: string;
}

const SchedulePage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('day');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/schedule');
        setSchedule(response.data);
      } catch (error) {
        toast.error(t('erreurChargementEmploi'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, [t]);

  const filteredSchedule = schedule.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#2CB3C2] flex items-center">
          <FaCalendar className="mr-2" /> {t('emploiDuTemps')}
        </h1>
      </motion.header>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder={t('rechercherCours')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded-lg border border-[#2CB3C2] focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]"
        />
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('day')}
            className={`px-4 py-2 rounded-lg ${filter === 'day' ? 'bg-[#2CB3C2] text-white' : 'bg-gray-200'}`}
          >
            {t('jour')}
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-4 py-2 rounded-lg ${filter === 'week' ? 'bg-[#2CB3C2] text-white' : 'bg-gray-200'}`}
          >
            {t('semaine')}
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`px-4 py-2 rounded-lg ${filter === 'month' ? 'bg-[#2CB3C2] text-white' : 'bg-gray-200'}`}
          >
            {t('mois')}
          </button>
        </div>
      </div>

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {isLoading ? (
          <Skeleton count={5} height={100} />
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <iframe
              src={`https://calendar.google.com/calendar/embed?mode=${filter.toUpperCase()}&height=600&wkst=1&bgcolor=%232CB3C2`}
              className="w-full h-[600px] rounded-lg mb-6"
            />
            <div className="space-y-4">
              {filteredSchedule.map(event => (
                <motion.div
                  key={event.id}
                  className="p-4 bg-[rgba(44,179,194,0.54)] rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="font-semibold">{event.title}</p>
                  <p>{event.date} - {event.time}</p>
                  <p>{t('cours')}: {event.course}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.section>

      <ToastContainer />
    </div>
  );
};

export default SchedulePage;