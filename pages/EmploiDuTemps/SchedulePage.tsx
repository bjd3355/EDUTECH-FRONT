import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaPlus, FaChalkboardTeacher, FaSearch, FaFilter, FaCheck, FaTimes } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configurer moment comme localizer pour react-big-calendar
const localizer = momentLocalizer(moment);

// Interface pour un cours
interface Course {
  id: number;
  title: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  description: string;
  className: string;
  start?: Date;
  end?: Date;
}

// Interface pour un événement du calendrier
interface CalendarEvent extends Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Course;
}

const SchedulePage: React.FC = () => {
  const [schedule, setSchedule] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterClass, setFilterClass] = useState<string>('Toutes');
  const [newCourse, setNewCourse] = useState<Partial<Course>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/schedule');
        const formattedData = response.data.map((course: Course) => {
          const startDate = moment(`${course.day} ${course.startTime}`, 'dddd HH:mm').toDate();
          const endDate = moment(`${course.day} ${course.endTime}`, 'dddd HH:mm').toDate();
          return { ...course, start: startDate, end: endDate };
        });
        setSchedule(formattedData);
      } catch (error) {
        toast.error('Erreur lors du chargement', { icon: <FaTimes /> });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const openModal = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setIsModalOpen(false);
  };

  const handleAddCourse = () => {
    if (newCourse.title && newCourse.day && newCourse.startTime && newCourse.endTime) {
      const startDate = moment(`${newCourse.day} ${newCourse.startTime}`, 'dddd HH:mm').toDate();
      const endDate = moment(`${newCourse.day} ${newCourse.endTime}`, 'dddd HH:mm').toDate();
      const newCourseData: Course = {
        id: schedule.length + 1,
        title: newCourse.title,
        day: newCourse.day,
        startTime: newCourse.startTime,
        endTime: newCourse.endTime,
        room: newCourse.room || 'Non spécifié',
        description: newCourse.description || 'Aucune description',
        className: newCourse.className || 'Non spécifié',
        start: startDate,
        end: endDate,
      };
      setSchedule([...schedule, newCourseData]);
      setNewCourse({});
      toast.success('Cours ajouté avec succès !', { icon: <FaCheck /> });
    } else {
      toast.error('Champs obligatoires manquants !', { icon: <FaTimes /> });
    }
  };

  const filteredSchedule = schedule.filter((course) => {
    const classMatch = filterClass === 'Toutes' || course.className === filterClass;
    const searchMatch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.className.toLowerCase().includes(searchTerm.toLowerCase());
    return classMatch && searchMatch;
  });

  const calendarEvents: CalendarEvent[] = filteredSchedule.map((course) => ({
    id: course.id,
    title: `${course.title} (${course.className})`,
    start: course.start!,
    end: course.end!,
    resource: course,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-6 sm:mb-8 md:mb-12 text-center relative"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-[#6B7280] via-[#2CB3C2] to-[#1A8A97] bg-clip-text text-transparent flex justify-center items-center">
          <FaCalendar className="mr-2 sm:mr-3 md:mr-4 text-[#2CB3C2] animate-spin-slow text-lg sm:text-xl md:text-2xl" /> Emploi du Temps
        </h1>
        <motion.div
          className="mt-2 sm:mt-3 h-1 w-24 sm:w-32 md:w-40 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] mx-auto rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.header>

      {/* Sidebar simplifiée */}
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-12 sm:w-16 bg-gradient-to-b from-[#2CB3C2] to-[#1A8A97] text-white h-full p-2 sm:p-4 flex flex-col items-center space-y-6 sm:space-y-8 shadow-lg z-10"
      >
        <FaCalendar className="text-lg sm:text-2xl hover:scale-125 transition-transform duration-300 cursor-pointer" />
        <FaChalkboardTeacher className="text-lg sm:text-2xl hover:scale-125 transition-transform duration-300 cursor-pointer" />
      </motion.aside>

      {/* Contenu principal */}
      <main className="ml-14 sm:ml-20 max-w-6xl mx-auto">
        {/* Filtres et recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10"
        >
          <div className="relative flex-1">
            <FaSearch className="absolute top-1/2 left-3 sm:left-4 transform -translate-y-1/2 text-[#2CB3C2] text-sm sm:text-base" />
            <motion.input
              type="text"
              placeholder="Rechercher un cours ou une classe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 p-3 sm:p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#2CB3C2]/20 focus:border-[#2CB3C2] bg-white shadow-md transition-all duration-300 text-sm sm:text-base"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <FaFilter className="text-[#2CB3C2] animate-bounce-slow text-sm sm:text-base md:text-lg" />
            <motion.select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="p-3 sm:p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#2CB3C2]/20 focus:border-[#2CB3C2] bg-white shadow-md transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
              whileHover={{ scale: 1.03 }}
            >
              <option value="Toutes">Toutes les classes</option>
              <option value="L2 A GI">L2 A GI</option>
              <option value="L1 C">L1 C</option>
            </motion.select>
          </div>
        </motion.div>

        {/* Formulaire d'ajout de cours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl mb-6 sm:mb-8 md:mb-10 border border-gray-100"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
            <FaPlus className="mr-2 sm:mr-3 text-[#2CB3C2] animate-pulse text-lg sm:text-xl" /> Nouveau Cours
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { placeholder: 'Titre du cours', key: 'title', type: 'text' },
              { placeholder: 'Jour', key: 'day', type: 'select', options: days },
              { placeholder: 'Début', key: 'startTime', type: 'select', options: timeSlots },
              { placeholder: 'Fin', key: 'endTime', type: 'select', options: timeSlots },
              { placeholder: 'Salle', key: 'room', type: 'text' },
              { placeholder: 'Classe', key: 'className', type: 'text' },
            ].map((field) => (
              field.type === 'select' ? (
                <motion.select
                  key={field.key}
                  value={newCourse[field.key as keyof Course] || ''}
                  onChange={(e) => setNewCourse({ ...newCourse, [field.key]: e.target.value })}
                  className="p-3 sm:p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#2CB3C2]/20 focus:border-[#2CB3C2] bg-gray-50 hover:bg-white transition-all duration-300 text-sm sm:text-base"
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">{field.placeholder}</option>
                  {field.options!.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </motion.select>
              ) : (
                <motion.input
                  key={field.key}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={newCourse[field.key as keyof Course] || ''}
                  onChange={(e) => setNewCourse({ ...newCourse, [field.key]: e.target.value })}
                  className="p-3 sm:p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#2CB3C2]/20 focus:border-[#2CB3C2] bg-gray-50 hover:bg-white transition-all duration-300 text-sm sm:text-base"
                  whileFocus={{ scale: 1.02 }}
                />
              )
            ))}
            <motion.textarea
              placeholder="Description"
              value={newCourse.description || ''}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              className="p-3 sm:p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#2CB3C2]/20 focus:border-[#2CB3C2] bg-gray-50 hover:bg-white transition-all duration-300 col-span-1 sm:col-span-2 md:col-span-3 text-sm sm:text-base"
              rows={3}
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          <motion.button
            onClick={handleAddCourse}
            className="mt-4 sm:mt-6 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg hover:from-[#1A8A97] hover:to-[#2CB3C2] transition-all duration-300 flex items-center gap-2 mx-auto text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus /> Ajouter
          </motion.button>
        </motion.div>

        {/* Calendrier interactif */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-100"
        >
          {isLoading ? (
            <div className="space-y-4 sm:space-y-6">
              {Array(5).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-16 sm:h-24 bg-gray-100 rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                />
              ))}
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 'calc(100vh - 300px)', minHeight: '400px' }} // Hauteur responsive
              onSelectEvent={(event: CalendarEvent) => openModal(event.resource)}
              defaultView="week"
              views={['week', 'day']}
              step={30}
              timeslots={2}
              min={new Date(0, 0, 0, 8, 0)}
              max={new Date(0, 0, 0, 18, 0)}
              eventPropGetter={(event) => ({
                style: {
                  background: 'linear-gradient(135deg, #2CB3C2, #1A8A97)',
                  color: 'white',
                  borderRadius: '8px sm:12px',
                  border: 'none',
                  padding: '4px sm:8px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s',
                  fontSize: '0.75rem sm:1rem', // Taille de texte responsive
                },
              })}
              components={{
                event: ({ event }) => (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {event.title}
                  </motion.div>
                ),
              }}
            />
          )}
        </motion.div>
      </main>

      {/* Modal pour les détails */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-90"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-90"
              >
                <Dialog.Panel className="w-full max-w-sm sm:max-w-md bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-100">
                  <Dialog.Title as="h3" className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                    <FaChalkboardTeacher className="mr-2 sm:mr-3 text-[#2CB3C2] animate-pulse text-lg sm:text-xl" /> Détails du Cours
                  </Dialog.Title>
                  {selectedCourse && (
                    <motion.div
                      className="space-y-3 sm:space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm sm:text-base md:text-lg"><strong className="text-[#2CB3C2]">Titre :</strong> {selectedCourse.title}</p>
                      <p className="text-sm sm:text-base md:text-lg"><strong className="text-[#2CB3C2]">Classe :</strong> {selectedCourse.className}</p>
                      <p className="text-sm sm:text-base md:text-lg"><strong className="text-[#2CB3C2]">Jour :</strong> {selectedCourse.day}</p>
                      <p className="text-sm sm:text-base md:text-lg"><strong className="text-[#2CB3C2]">Horaire :</strong> {selectedCourse.startTime} - {selectedCourse.endTime}</p>
                      <p className="text-sm sm:text-base md:text-lg"><strong className="text-[#2CB3C2]">Salle :</strong> {selectedCourse.room}</p>
                      <p className="text-sm sm:text-base md:text-lg"><strong className="text-[#2CB3C2]">Description :</strong> {selectedCourse.description}</p>
                    </motion.div>
                  )}
                  <motion.button
                    onClick={closeModal}
                    className="mt-4 sm:mt-6 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg hover:from-[#1A8A97] hover:to-[#2CB3C2] transition-all duration-300 w-full text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Fermer
                  </motion.button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="colored"
        className="font-semibold text-sm sm:text-base"
      />
    </div>
  );
};

export default SchedulePage;