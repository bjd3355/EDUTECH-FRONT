import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTasks, FaPlus, FaFilter, FaEdit, FaTrash, FaCopy, FaLink, FaCheck, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Interface pour un devoir/évaluation
interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'À venir' | 'En cours' | 'Terminé' | 'Rendu' | 'Noté';
  googleFormLink?: string;
  courseName: string;
}

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: 'QCM Python - Introduction',
      description: 'QCM sur les bases de la programmation en Python.',
      dueDate: '2025-04-01',
      status: 'À venir',
      googleFormLink: 'https://forms.gle/example1',
      courseName: 'Introduction à l’Algorithmique',
    },
    {
      id: 2,
      title: 'Devoir ALGO - Tri',
      description: 'Devoir sur les algorithmes de tri.',
      dueDate: '2025-03-28',
      status: 'En cours',
      googleFormLink: 'https://forms.gle/example2',
      courseName: 'Mathématiques Avancées',
    },
    {
      id: 3,
      title: 'Projet Web',
      description: 'Création d’un site web simple.',
      dueDate: '2025-03-26',
      status: 'Rendu',
      courseName: 'Développement Web',
    },
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('Tous');
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const openModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAssignment(null);
    setIsModalOpen(false);
  };

  const handleAddAssignment = () => {
    if (newAssignment.title && newAssignment.dueDate && newAssignment.courseName) {
      const dueDate = new Date(newAssignment.dueDate);
      const today = new Date();
      const status = dueDate > today ? 'À venir' : 'En cours';

      const newAssignmentData: Assignment = {
        id: assignments.length + 1,
        title: newAssignment.title,
        description: newAssignment.description || 'Aucune description',
        dueDate: newAssignment.dueDate,
        status,
        googleFormLink: newAssignment.googleFormLink,
        courseName: newAssignment.courseName,
      };

      setAssignments([...assignments, newAssignmentData]);
      setNewAssignment({});
      toast.success('Devoir ajouté avec succès !', { icon: <FaCheck /> });
    } else {
      toast.error('Champs obligatoires manquants !', { icon: <FaTimes /> });
    }
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setNewAssignment(assignment);
    setIsEditing(true);
  };

  const handleUpdateAssignment = () => {
    if (newAssignment.id && newAssignment.title && newAssignment.dueDate && newAssignment.courseName) {
      const dueDate = new Date(newAssignment.dueDate);
      const today = new Date();
      const status = newAssignment.status || (dueDate > today ? 'À venir' : 'En cours');

      const updatedAssignment: Assignment = {
        id: newAssignment.id,
        title: newAssignment.title,
        description: newAssignment.description || 'Aucune description',
        dueDate: newAssignment.dueDate,
        status,
        googleFormLink: newAssignment.googleFormLink,
        courseName: newAssignment.courseName,
      };

      setAssignments(
        assignments.map((assignment) =>
          assignment.id === newAssignment.id ? updatedAssignment : assignment
        )
      );
      setNewAssignment({});
      setIsEditing(false);
      toast.success('Devoir mis à jour !', { icon: <FaCheck /> });
    } else {
      toast.error('Champs obligatoires manquants !', { icon: <FaTimes /> });
    }
  };

  const handleDeleteAssignment = (id: number) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
    toast.success('Devoir supprimé !', { icon: <FaCheck /> });
  };

  const handleMarkAsSubmitted = (id: number) => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === id ? { ...assignment, status: 'Rendu' } : assignment
      )
    );
    toast.success('Devoir marqué comme rendu !', { icon: <FaCheckCircle /> });
  };

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Lien copié !', { icon: <FaCopy /> });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'À venir': return 'bg-gradient-to-r from-blue-400 to-blue-600';
      case 'En cours': return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'Terminé': return 'bg-gradient-to-r from-green-400 to-green-600';
      case 'Rendu': return 'bg-gradient-to-r from-purple-400 to-purple-600';
      case 'Noté': return 'bg-gradient-to-r from-teal-400 to-teal-600';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  const filteredAssignments = assignments.filter(
    (assignment) => filterStatus === 'Tous' || assignment.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-8 text-center relative"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#6B7280] via-[#2CB3C2] to-[#1A8A97] bg-clip-text text-transparent flex justify-center items-center">
          <FaTasks className="mr-2 sm:mr-4 text-[#2CB3C2] animate-pulse text-xl sm:text-2xl" /> Devoirs & Évaluations
        </h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-2 sm:mt-3 h-1 w-32 sm:w-40 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] mx-auto rounded-full"
        />
      </motion.header>

      {/* Formulaire */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-5xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl mb-6 sm:mb-10 border border-gray-100"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
          <FaPlus className="mr-2 sm:mr-3 text-[#2CB3C2] animate-spin-slow text-lg sm:text-xl" /> {isEditing ? 'Modifier' : 'Nouveau Devoir'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[
            { placeholder: 'Titre du devoir', key: 'title', type: 'text' },
            { placeholder: 'Date limite', key: 'dueDate', type: 'date' },
            { placeholder: 'Nom du cours', key: 'courseName', type: 'text' },
            { placeholder: 'Lien Google Forms (optionnel)', key: 'googleFormLink', type: 'text' },
          ].map((field) => (
            <motion.input
              key={field.key}
              type={field.type}
              placeholder={field.placeholder}
              value={newAssignment[field.key as keyof Assignment] || ''}
              onChange={(e) => setNewAssignment({ ...newAssignment, [field.key]: e.target.value })}
              className="p-3 sm:p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2CB3C2]/20 focus:border-[#2CB3C2] transition-all duration-300 bg-gray-50 hover:bg-white text-sm sm:text-base"
              whileFocus={{ scale: 1.02 }}
            />
          ))}
          <motion.textarea
            placeholder="Description"
            value={newAssignment.description || ''}
            onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
            className="p-3 sm:p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2CB3C2]/20 focus:border-[#2CB3C2] transition-all duration-300 bg-gray-50 hover:bg-white col-span-1 sm:col-span-2 text-sm sm:text-base"
            rows={3}
            whileFocus={{ scale: 1.02 }}
          />
        </div>
        <motion.button
          onClick={isEditing ? handleUpdateAssignment : handleAddAssignment}
          className="mt-4 sm:mt-6 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg hover:from-[#1A8A97] hover:to-[#2CB3C2] transition-all duration-300 flex items-center gap-2 mx-auto text-sm sm:text-base"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> {isEditing ? 'Mettre à jour' : 'Ajouter'}
        </motion.button>
      </motion.section>

      {/* Filtres et Liste */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <FaFilter className="text-[#2CB3C2] text-lg sm:text-xl animate-bounce-slow" />
          <motion.select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 sm:p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2CB3C2]/20 focus:border-[#2CB3C2] bg-white shadow-md transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
            whileHover={{ scale: 1.03 }}
          >
            <option value="Tous">Tous les statuts</option>
            {['À venir', 'En cours', 'Terminé', 'Rendu', 'Noté'].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </motion.select>
        </div>

        {isLoading ? (
          <Skeleton height={60} count={3} className="mb-4 sm:mb-6 rounded-2xl" />
        ) : (
          <AnimatePresence>
            {filteredAssignments.length > 0 ? (
              <motion.div
                className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-100 overflow-x-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <table className="w-full border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white">
                      <th className="p-3 sm:p-5 text-left rounded-tl-2xl text-sm sm:text-base">Cours</th>
                      <th className="p-3 sm:p-5 text-left text-sm sm:text-base">Devoir</th>
                      <th className="p-3 sm:p-5 text-left text-sm sm:text-base">Date limite</th>
                      <th className="p-3 sm:p-5 text-left text-sm sm:text-base">Statut</th>
                      <th className="p-3 sm:p-5 text-left rounded-tr-2xl text-sm sm:text-base">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssignments.map((assignment) => (
                      <motion.tr
                        key={assignment.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <td className="p-3 sm:p-5 font-medium text-gray-700 text-sm sm:text-base">{assignment.courseName}</td>
                        <td
                          className="p-3 sm:p-5 text-[#2CB3C2] font-semibold cursor-pointer hover:underline text-sm sm:text-base"
                          onClick={() => openModal(assignment)}
                        >
                          {assignment.title}
                        </td>
                        <td className="p-3 sm:p-5 text-gray-600 text-sm sm:text-base">{assignment.dueDate || '---'}</td>
                        <td className="p-3 sm:p-5">
                          <span
                            className={`inline-block px-3 sm:px-4 py-1 rounded-full text-white text-xs sm:text-sm font-medium ${getStatusColor(
                              assignment.status
                            )} shadow-md`}
                          >
                            {assignment.status}
                          </span>
                        </td>
                        <td className="p-3 sm:p-5 flex gap-3 sm:gap-4">
                          <motion.button
                            onClick={() => handleEditAssignment(assignment)}
                            className="text-gray-500 hover:text-[#2CB3C2] transition-colors duration-200"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                          >
                            <FaEdit className="text-lg sm:text-xl" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                            whileHover={{ scale: 1.2, rotate: -10 }}
                          >
                            <FaTrash className="text-lg sm:text-xl" />
                          </motion.button>
                          {assignment.status !== 'Rendu' && assignment.status !== 'Noté' && (
                            <motion.button
                              onClick={() => handleMarkAsSubmitted(assignment.id)}
                              className="text-gray-500 hover:text-purple-500 transition-colors duration-200"
                              whileHover={{ scale: 1.2 }}
                            >
                              <FaCheckCircle className="text-lg sm:text-xl" />
                            </motion.button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.p
                className="text-center text-gray-500 text-lg sm:text-xl italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Aucun devoir à afficher pour le moment...
              </motion.p>
            )}
          </AnimatePresence>
        )}
      </motion.section>

      {/* Modal */}
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
                <Dialog.Panel className="w-full max-w-md sm:max-w-lg bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-100 transform transition-all">
                  <Dialog.Title as="h3" className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                    <FaTasks className="mr-2 sm:mr-3 text-[#2CB3C2] animate-pulse text-lg sm:text-xl" /> Détails
                  </Dialog.Title>
                  {selectedAssignment ? (
                    <motion.div
                      className="space-y-3 sm:space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm sm:text-lg"><strong className="text-[#2CB3C2]">Cours :</strong> {selectedAssignment.courseName}</p>
                      <p className="text-sm sm:text-lg"><strong className="text-[#2CB3C2]">Titre :</strong> {selectedAssignment.title}</p>
                      <p className="text-sm sm:text-lg"><strong className="text-[#2CB3C2]">Date limite :</strong> {selectedAssignment.dueDate}</p>
                      <p className="text-sm sm:text-lg"><strong className="text-[#2CB3C2]">Statut :</strong> {selectedAssignment.status}</p>
                      <p className="text-sm sm:text-lg"><strong className="text-[#2CB3C2]">Description :</strong> {selectedAssignment.description}</p>
                      {selectedAssignment.googleFormLink && (
                        <p className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-sm sm:text-lg">
                          <strong className="text-[#2CB3C2]">Lien :</strong>
                          <div className="flex items-center gap-2">
                            <a
                              href={selectedAssignment.googleFormLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#2CB3C2] hover:underline flex items-center gap-2 transition-colors duration-200"
                            >
                              <FaLink /> Ouvrir
                            </a>
                            <motion.button
                              onClick={() => copyToClipboard(selectedAssignment.googleFormLink!)}
                              className="text-gray-500 hover:text-[#2CB3C2] transition-colors duration-200"
                              whileHover={{ scale: 1.2 }}
                            >
                              <FaCopy />
                            </motion.button>
                          </div>
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <p className="text-sm sm:text-lg text-gray-500">Aucun devoir sélectionné.</p>
                  )}
                  <motion.button
                    onClick={closeModal}
                    className="mt-6 sm:mt-8 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg hover:from-[#1A8A97] hover:to-[#2CB3C2] transition-all duration-300 w-full text-sm sm:text-base"
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

export default AssignmentsPage;