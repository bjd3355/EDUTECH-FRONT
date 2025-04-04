import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaTasks, FaPlus, FaFilter, FaEdit, FaTrash, FaCopy, FaLink, FaCheck, FaTimes, FaCheckCircle, FaSort, FaDownload, FaFileDownload, FaClipboardList, FaFileAlt, FaUpload } from 'react-icons/fa';
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
  status: 'À venir' | 'En cours' | 'Terminé' | 'Rendu' | 'Noté' | 'En retard';
  googleFormLink?: string;
  courseName: string;
  className: string; // Nouvelle propriété pour la classe
  duration?: string;
  grade?: string;
  tasks?: Task[];
  resources?: Resource[];
  submission?: { text?: string; file?: File };
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface Resource {
  id: number;
  title: string;
  url: string;
  type: 'PDF' | 'Video' | 'Link';
}

// Mock data pour les classes
const mockClasses = [
  { id: 1, name: 'Classe 1A' },
  { id: 2, name: 'Classe 2B' },
  { id: 3, name: 'Classe 3C' },
];

const ITEMS_PER_PAGE = 5;

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
      className: 'Classe 1A', // Ajout de la classe
      duration: '01:00',
      tasks: [
        { id: 1, title: 'Étudier les bases de Python', completed: false },
        { id: 2, title: 'Répondre au QCM', completed: false },
      ],
      resources: [
        { id: 1, title: 'Cours PDF', url: 'https://example.com/pdf1.pdf', type: 'PDF' },
      ],
    },
    {
      id: 2,
      title: 'Devoir ALGO - Tri',
      description: 'Devoir sur les algorithmes de tri.',
      dueDate: '2025-03-28',
      status: 'En cours',
      googleFormLink: 'https://forms.gle/example2',
      courseName: 'Mathématiques Avancées',
      className: 'Classe 2B', // Ajout de la classe
      duration: '02:30',
    },
    {
      id: 3,
      title: 'Projet Web',
      description: 'Création d’un site web simple.',
      dueDate: '2025-03-26',
      status: 'Rendu',
      courseName: 'Développement Web',
      className: 'Classe 3C', // Ajout de la classe
      duration: '03:00',
      grade: 'A',
    },
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('Tous');
  const [sortBy, setSortBy] = useState<'dueDate' | 'title'>('dueDate');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('Détails');
  const [submissionText, setSubmissionText] = useState<string>('');
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setAssignments(assignments.map(assignment => ({
        ...assignment,
        status: checkIfLate(assignment.dueDate) ? 'En retard' : assignment.status,
      })));
      setIsLoading(false);
    }, 1000);
  }, []);

  const checkIfLate = (dueDate: string): boolean => {
    const today = new Date();
    const due = new Date(dueDate);
    return today > due;
  };

  const isDueSoon = (dueDate: string): boolean => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 3;
  };

  const openModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
    setSubmissionText('');
    setSubmissionFile(null);
    setActiveTab('Détails');
  };

  const handleAddAssignment = () => {
    if (newAssignment.title && newAssignment.dueDate && newAssignment.courseName && newAssignment.className) {
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
        className: newAssignment.className, // Ajout de la classe
        duration: newAssignment.duration || '01:00',
        tasks: newAssignment.tasks || [],
        resources: newAssignment.resources || [],
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
    if (newAssignment.id && newAssignment.title && newAssignment.dueDate && newAssignment.courseName && newAssignment.className) {
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
        className: newAssignment.className, // Ajout de la classe
        duration: newAssignment.duration || '01:00',
        grade: newAssignment.grade,
        tasks: newAssignment.tasks || [],
        resources: newAssignment.resources || [],
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

  const filteredAndSortedAssignments = useMemo(() => {
    let result = [...assignments];
    if (filterStatus !== 'Tous') result = result.filter(assignment => assignment.status === filterStatus);
    if (searchTerm) {
      result = result.filter(assignment =>
        assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.className.toLowerCase().includes(searchTerm.toLowerCase()) // Recherche par classe
      );
    }
    result.sort((a, b) => {
      if (sortBy === 'dueDate') return a.dueDate.localeCompare(b.dueDate);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
    return result;
  }, [assignments, filterStatus, sortBy, searchTerm]);

  const paginatedAssignments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedAssignments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedAssignments, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedAssignments.length / ITEMS_PER_PAGE);

  const completionPercentage = useMemo(() => {
    const total = assignments.length;
    const completed = assignments.filter(a => a.status === 'Rendu' || a.status === 'Noté').length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [assignments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'À venir': return 'bg-gradient-to-r from-blue-400 to-blue-600';
      case 'En cours': return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'Terminé': return 'bg-gradient-to-r from-green-400 to-green-600';
      case 'Rendu': return 'bg-gradient-to-r from-purple-400 to-purple-600';
      case 'Noté': return 'bg-gradient-to-r from-teal-400 to-teal-600';
      case 'En retard': return 'bg-gradient-to-r from-red-400 to-red-600';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  const toggleTask = (assignmentId: number, taskId: number) => {
    const updatedAssignments = [...assignments];
    const assignment = updatedAssignments.find(a => a.id === assignmentId);
    if (assignment?.tasks) {
      const taskIndex = assignment.tasks.findIndex(t => t.id === taskId);
      assignment.tasks[taskIndex].completed = !assignment.tasks[taskIndex].completed;
      setAssignments(updatedAssignments);
    }
  };

  const exportToCSV = () => {
    const headers = ['Cours', 'Classe', 'Devoir', 'Date limite', 'Durée', 'Statut', 'Note'].join(',');
    const rows = filteredAndSortedAssignments.map(assignment =>
      [assignment.courseName, assignment.className, assignment.title, assignment.dueDate || '---', assignment.duration || '01:00', assignment.status, assignment.grade || 'N/A'].join(',')
    ).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'assignments.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitAssignment = (id: number) => {
    const updatedAssignments = [...assignments];
    const assignmentIndex = updatedAssignments.findIndex(a => a.id === id);
    if (assignmentIndex !== -1) {
      updatedAssignments[assignmentIndex].status = 'Rendu';
      updatedAssignments[assignmentIndex].submission = {
        text: submissionText || undefined,
        file: submissionFile || undefined,
      };
      setAssignments(updatedAssignments);
      setSelectedAssignment(updatedAssignments[assignmentIndex]);
      setSubmissionText('');
      setSubmissionFile(null);
      toast.success('Devoir soumis avec succès !', { icon: <FaCheck /> });
    }
  };

  const tabs = [
    { name: 'Détails', icon: <FaClipboardList /> },
    { name: 'Tâches', icon: <FaTasks /> },
    { name: 'Ressources', icon: <FaFileAlt /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 p-4 sm:p-6 md:p-8">
      {/* En-tête */}
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
            { placeholder: 'Durée (HH:MM)', key: 'duration', type: 'text' },
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
          <motion.select
            value={newAssignment.className || ''}
            onChange={(e) => setNewAssignment({ ...newAssignment, className: e.target.value })}
            className="p-3 sm:p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2CB3C2]/20 focus:border-[#2CB3C2] transition-all duration-300 bg-gray-50 hover:bg-white text-sm sm:text-base"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="">Sélectionner une classe</option>
            {mockClasses.map(cls => (
              <option key={cls.id} value={cls.name}>{cls.name}</option>
            ))}
          </motion.select>
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

      {/* Progression */}
      <div className="max-w-5xl mx-auto mb-6 sm:mb-8">
        <div className="text-sm sm:text-base mb-2">Progression : {completionPercentage}%</div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
          <div className="bg-[#2CB3C2] h-2 sm:h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
        </div>
      </div>

      {/* Filtres et Liste */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <FaFilter className="text-[#2CB3C2] text-lg sm:text-xl animate-bounce-slow" />
          <motion.input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="p-2 sm:p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2CB3C2]/20 focus:border-[#2CB3C2] bg-white shadow-md transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
            whileHover={{ scale: 1.03 }}
          />
          <motion.select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 sm:p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2CB3C2]/20 focus:border-[#2CB3C2] bg-white shadow-md transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
            whileHover={{ scale: 1.03 }}
          >
            <option value="Tous">Tous les statuts</option>
            {['À venir', 'En cours', 'Terminé', 'Rendu', 'Noté', 'En retard'].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </motion.select>
          <motion.select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'title')}
            className="p-2 sm:p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2CB3C2]/20 focus:border-[#2CB3C2] bg-white shadow-md transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
            whileHover={{ scale: 1.03 }}
          >
            <option value="dueDate">Date</option>
            <option value="title">Titre</option>
          </motion.select>
          <motion.button
            onClick={exportToCSV}
            className="flex items-center px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white rounded-xl shadow-lg hover:from-[#1A8A97] hover:to-[#2CB3C2] transition-all duration-300 text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDownload className="mr-2" /> Exporter CSV
          </motion.button>
        </div>

        <div>
          {isLoading ? (
            <Skeleton height={60} count={3} className="mb-4 sm:mb-6 rounded-2xl" />
          ) : (
            paginatedAssignments.length > 0 ? (
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
                      <th className="p-3 sm:p-5 text-left text-sm sm:text-base">Classe</th> {/* Nouvelle colonne */}
                      <th className="p-3 sm:p-5 text-left text-sm sm:text-base">Devoir</th>
                      <th className="p-3 sm:p-5 text-left text-sm sm:text-base">Date limite</th>
                      <th className="p-3 sm:p-5 text-left text-sm sm:text-base">Durée</th>
                      <th className="p-3 sm:p-5 text-left text-sm sm:text-base">Statut</th>
                      <th className="p-3 sm:p-5 text-left rounded-tr-2xl text-sm sm:text-base">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAssignments.map((assignment) => (
                      <motion.tr
                        key={assignment.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <td className="p-3 sm:p-5 font-medium text-gray-700 text-sm sm:text-base">{assignment.courseName}</td>
                        <td className="p-3 sm:p-5 text-gray-700 text-sm sm:text-base">{assignment.className}</td> {/* Affichage de la classe */}
                        <td
                          className="p-3 sm:p-5 text-[#2CB3C2] font-semibold cursor-pointer hover:underline text-sm sm:text-base"
                          onClick={() => openModal(assignment)}
                        >
                          {assignment.title}
                        </td>
                        <td className="p-3 sm:p-5 text-gray-600 text-sm sm:text-base">
                          {assignment.dueDate || '---'}
                          {isDueSoon(assignment.dueDate) && <span className="ml-2 text-yellow-500">(Bientôt)</span>}
                        </td>
                        <td className="p-3 sm:p-5 text-gray-600 text-sm sm:text-base">{assignment.duration || '01:00'}</td>
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
                {totalPages > 1 && (
                  <div className="mt-4 flex justify-center gap-3 sm:gap-4">
                    <motion.button
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white rounded-xl disabled:bg-gray-400 text-sm sm:text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Précédent
                    </motion.button>
                    <span className="text-sm sm:text-base">Page {currentPage} / {totalPages}</span>
                    <motion.button
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white rounded-xl disabled:bg-gray-400 text-sm sm:text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Suivant
                    </motion.button>
                  </div>
                )}
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
            )
          )}
        </div>
      </motion.section>

      {/* Modal */}
      {isModalOpen && selectedAssignment && (
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
                      <FaTasks className="mr-2 sm:mr-3 text-[#2CB3C2] animate-pulse text-lg sm:text-xl" /> {selectedAssignment.title}
                    </Dialog.Title>

                    {/* Onglets */}
                    <div className="mb-4 sm:mb-6">
                      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
                        {tabs.map(tab => (
                          <motion.button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-medium rounded-full transition-all duration-300 shadow-sm ${
                              activeTab === tab.name
                                ? 'bg-[#2CB3C2] text-white shadow-[0_0_10px_rgba(44,179,194,0.5)]'
                                : 'bg-white text-gray-700 hover:bg-[#2CB3C2]/80 hover:text-white'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.name}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Contenu des onglets */}
                    <motion.div
                      className="space-y-3 sm:space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeTab === 'Détails' && (
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                          <p className="text-sm sm:text-lg"><strong className="text-[#2CB3C2]">Cours :</strong> {selectedAssignment.courseName}</p>
                          <p className="text-sm sm:text-lg"><strong className="text-[#2CB3C2]">Classe :</strong> {selectedAssignment.className}</p> {/* Affichage de la classe */}
                          <p className="text-sm sm:text-lg"><strong className="text-[#2CB3C2]">Date limite :</strong> {selectedAssignment.dueDate}</p>
                          <p className="text-sm sm:text-lg"><strong className="text-[#2CB3C2]">Durée :</strong> {selectedAssignment.duration || '01:00'}</p>
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
                          {selectedAssignment.status === 'À venir' || selectedAssignment.status === 'En cours' ? (
                            <div className="mt-4">
                              <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">Rendre le devoir</h4>
                              <textarea
                                value={submissionText}
                                onChange={e => setSubmissionText(e.target.value)}
                                placeholder="Entrez votre texte ici..."
                                className="w-full p-2 rounded-lg border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]"
                                rows={3}
                              />
                              <input
                                type="file"
                                onChange={e => setSubmissionFile(e.target.files?.[0] || null)}
                                className="mt-2 text-sm sm:text-base"
                              />
                              <motion.button
                                onClick={() => handleSubmitAssignment(selectedAssignment.id)}
                                className="mt-3 inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white rounded-lg shadow-md hover:from-[#1A8A97] hover:to-[#2CB3C2] transition-all duration-300 text-sm sm:text-base"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaUpload className="mr-2" /> Soumettre
                              </motion.button>
                            </div>
                          ) : selectedAssignment.submission && (
                            <p className="text-sm sm:text-lg"><strong className="text-[#2CB3C2]">Soumission :</strong> {selectedAssignment.submission.text || 'Fichier soumis'}</p>
                          )}
                        </div>
                      )}

                      {activeTab === 'Tâches' && (
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                          <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-3">Tâches</h3>
                          {selectedAssignment.tasks && selectedAssignment.tasks.length > 0 ? (
                            <ul className="space-y-2 text-sm sm:text-base">
                              {selectedAssignment.tasks.map(task => (
                                <li key={task.id} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask(selectedAssignment.id, task.id)}
                                    className="mr-2 rounded text-[#2CB3C2] focus:ring-[#2CB3C2]"
                                  />
                                  <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.title}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-600 text-sm sm:text-base">Aucune tâche disponible.</p>
                          )}
                        </div>
                      )}

                      {activeTab === 'Ressources' && (
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                          <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-3">Ressources</h3>
                          {selectedAssignment.resources && selectedAssignment.resources.length > 0 ? (
                            <ul className="space-y-2 text-sm sm:text-base">
                              {selectedAssignment.resources.map(resource => (
                                <li key={resource.id}>
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#2CB3C2] hover:underline flex items-center"
                                  >
                                    <FaFileDownload className="mr-2" /> {resource.title} ({resource.type})
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-600 text-sm sm:text-base">Aucune ressource disponible.</p>
                          )}
                        </div>
                      )}
                    </motion.div>

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
      )}

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