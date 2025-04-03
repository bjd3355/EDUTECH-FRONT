import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaTasks, FaSort, FaBook, FaCheck, FaEdit, FaDownload, FaFileDownload, FaArrowLeft, FaClipboardList, FaFileAlt, FaUpload } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Types
interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  status: 'À rendre' | 'Rendu' | 'Noté' | 'En retard';
  priority?: 'Low' | 'Medium' | 'High';
  description?: string;
  grade?: string;
  tasks?: Task[];
  resources?: Resource[];
  submission?: { text?: string; file?: File };
}

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  materials: string[];
  liveLink?: string;
  assignments: Assignment[];
  schedule: { date: string; time: string; status: string }[];
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

// Mock data
const mockCourses: Course[] = [
  {
    id: 1,
    title: "Introduction à l'Algorithmique",
    description: "Apprenez les bases de la programmation avec des algorithmes simples.",
    image: "",
    materials: ["https://example.com/pdf1.pdf", "https://example.com/pdf2.pdf"],
    liveLink: "https://zoom.us/j/123456789",
    assignments: [
      {
        id: 1,
        title: "Devoir cours 1",
        dueDate: "20/01/2025",
        status: "À rendre",
        priority: "High",
        description: "Implémenter un tri par insertion.",
        tasks: [
          { id: 1, title: "Étudier le tri par insertion", completed: false },
          { id: 2, title: "Coder l'algorithme", completed: false },
        ],
        resources: [
          { id: 1, title: "Cours PDF", url: "https://example.com/pdf1.pdf", type: "PDF" },
          { id: 2, title: "Vidéo explicative", url: "https://example.com/video1.mp4", type: "Video" },
        ],
      },
      {
        id: 2,
        title: "Exercice bonus",
        dueDate: "10/04/2025",
        status: "À rendre",
        priority: "Low",
        description: "Créer une fonction récursive.",
        grade: "A",
        tasks: [],
        resources: [],
      },
    ],
    schedule: [{ date: "01/04/2025", time: "17h30", status: "En ligne" }],
  },
];

const ITEMS_PER_PAGE = 5;

const AssignmentsPage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [assignments, setAssignments] = useState<{ course: string; assignment: Assignment }[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'title' | 'priority'>('dueDate');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedAssignment, setSelectedAssignment] = useState<{ course: string; assignment: Assignment } | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Détails');
  const [submissionText, setSubmissionText] = useState<string>('');
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const allAssignments = mockCourses
          .flatMap(course =>
            course.assignments.map(assignment => ({
              course: course.title,
              assignment: {
                ...assignment,
                status: checkIfLate(assignment.dueDate) ? 'En retard' : assignment.status,
              },
            }))
          );
        setAssignments(allAssignments);
      } catch (error) {
        console.error('Erreur lors du chargement des devoirs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAssignments();
  }, []);

  const checkIfLate = (dueDate: string): boolean => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate.split('/').reverse().join('-'));
    return today > due;
  };

  const isDueSoon = (dueDate: string): boolean => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate.split('/').reverse().join('-'));
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 3;
  };

  const filteredAndSortedAssignments = useMemo(() => {
    let result = [...assignments];
    if (filterStatus !== 'all') result = result.filter(({ assignment }) => assignment.status === filterStatus);
    if (filterPriority !== 'all') result = result.filter(({ assignment }) => assignment.priority === filterPriority);
    if (searchTerm) {
      result = result.filter(({ course, assignment }) =>
        course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    result.sort((a, b) => {
      if (sortBy === 'dueDate') return (a.assignment.dueDate || 'ZZZ').localeCompare(b.assignment.dueDate || 'ZZZ');
      if (sortBy === 'title') return a.assignment.title.localeCompare(b.assignment.title);
      if (sortBy === 'priority') {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return (priorityOrder[b.assignment.priority || 'Medium'] || 0) - (priorityOrder[a.assignment.priority || 'Medium'] || 0);
      }
      return 0;
    });
    return result;
  }, [assignments, filterStatus, filterPriority, sortBy, searchTerm]);

  const paginatedAssignments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedAssignments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedAssignments, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedAssignments.length / ITEMS_PER_PAGE);

  const completionPercentage = useMemo(() => {
    const total = assignments.length;
    const completed = assignments.filter(a => a.assignment.status === 'Rendu' || a.assignment.status === 'Noté').length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [assignments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'À rendre': return 'bg-orange-500';
      case 'Rendu': return 'bg-purple-500';
      case 'Noté': return 'bg-green-500';
      case 'En retard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleStatusChange = (index: number, newStatus: Assignment['status']) => {
    const updatedAssignments = [...assignments];
    updatedAssignments[index].assignment.status = newStatus;
    setAssignments(updatedAssignments);
  };

  const handleGradeChange = (index: number, grade: string) => {
    const updatedAssignments = [...assignments];
    updatedAssignments[index].assignment.grade = grade;
    setAssignments(updatedAssignments);
  };

  const toggleTask = (assignmentId: number, taskId: number) => {
    const updatedAssignments = [...assignments];
    const assignmentIndex = updatedAssignments.findIndex(a => a.assignment.id === assignmentId);
    const tasks = updatedAssignments[assignmentIndex].assignment.tasks;
    if (tasks) {
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      setAssignments(updatedAssignments);
    }
  };

  const exportToCSV = () => {
    const headers = [t('cours'), t('devoir'), t('dateLimite'), t('priorité'), t('statut'), t('note')].join(',');
    const rows = filteredAndSortedAssignments.map(({ course, assignment }) =>
      [course, assignment.title, assignment.dueDate || '---', assignment.priority || 'Medium', assignment.status, assignment.grade || 'N/A'].join(',')
    ).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'assignments.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitAssignment = () => {
    if (!selectedAssignment) return;
    const updatedAssignments = [...assignments];
    const assignmentIndex = updatedAssignments.findIndex(a => a.assignment.id === selectedAssignment.assignment.id);
    if (assignmentIndex !== -1) {
      updatedAssignments[assignmentIndex].assignment.status = 'Rendu';
      updatedAssignments[assignmentIndex].assignment.submission = {
        text: submissionText || undefined,
        file: submissionFile || undefined,
      };
      setAssignments(updatedAssignments);
      setSelectedAssignment({ ...updatedAssignments[assignmentIndex] });
      setSubmissionText('');
      setSubmissionFile(null);
      alert(t('devoirRendu'));
    }
  };

  const tabs = [
    { name: 'Détails', icon: <FaClipboardList /> },
    { name: 'Tâches', icon: <FaTasks /> },
    { name: 'Ressources', icon: <FaFileAlt /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 sm:mb-8 text-center"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2CB3C2] flex justify-center items-center">
          <FaTasks className="mr-2" /> {t('Devoirs Et Evaluations')}
        </h1>
        <div className="mt-2 h-1 w-20 sm:w-24 bg-[#2CB3C2] mx-auto rounded-full"></div>
      </motion.header>

      {selectedAssignment ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-200 max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto"
        >
          {/* En-tête */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2CB3C2]">{selectedAssignment.assignment.title}</h2>
            <p className="text-gray-600 mt-1 sm:mt-2 text-base sm:text-lg">{selectedAssignment.course}</p>
          </div>

          {/* Onglets */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 bg-gray-50 p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
              {tabs.map(tab => (
                <motion.button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 text-base sm:text-lg md:text-xl font-medium rounded-full transition-all duration-300 shadow-sm ${
                    activeTab === tab.name
                      ? 'bg-[#2CB3C2] text-white shadow-[0_0_10px_rgba(44,179,194,0.5)]'
                      : 'bg-white text-gray-700 hover:bg-[#2CB3C2]/80 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(44, 179, 194, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-2 text-base sm:text-lg md:text-xl">{tab.icon}</span>
                  {tab.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="space-y-4 sm:space-y-6">
            {activeTab === 'Détails' && (
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">{t('Détails')}</h3>
                <div className="space-y-2 sm:space-y-3 text-base sm:text-lg">
                  <p><span className="font-medium">{t('dateLimite')} :</span> {selectedAssignment.assignment.dueDate || '---'}</p>
                  <p><span className="font-medium">{t('priorité')} :</span> <span className={getPriorityColor(selectedAssignment.assignment.priority)}>{selectedAssignment.assignment.priority || 'Medium'}</span></p>
                  <p><span className="font-medium">{t('statut')} :</span> <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-white text-base sm:text-lg ${getStatusColor(selectedAssignment.assignment.status)}`}>{selectedAssignment.assignment.status}</span></p>
                  <p><span className="font-medium">{t('note')} :</span> {selectedAssignment.assignment.grade || 'N/A'}</p>
                  <p><span className="font-medium">{t('description')} :</span> {selectedAssignment.assignment.description || t('aucuneDescription')}</p>
                  {selectedAssignment.assignment.submission && (
                    <p><span className="font-medium">{t('soumission')} :</span> {selectedAssignment.assignment.submission.text || 'Fichier soumis'}</p>
                  )}
                </div>
                {selectedAssignment.assignment.status === 'À rendre' && (
                  <div className="mt-4 sm:mt-6">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{t('rendreDevoir')}</h4>
                    <textarea
                      value={submissionText}
                      onChange={e => setSubmissionText(e.target.value)}
                      placeholder={t('entrerTexte')}
                      className="w-full p-2 rounded-lg border border-gray-300 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]"
                      rows={3}
                    />
                    <input
                      type="file"
                      onChange={e => setSubmissionFile(e.target.files?.[0] || null)}
                      className="mt-2 text-base sm:text-lg"
                    />
                    <button
                      onClick={handleSubmitAssignment}
                      className="mt-3 sm:mt-4 inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-[#2CB3C2] text-white !text-white hover:bg-[#1A8A99] transition-colors shadow-md rounded-lg text-base sm:text-lg"
                    >
                      <FaUpload className="mr-1 sm:mr-2" /> {t('soumettre')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Tâches' && (
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">{t('taches')}</h3>
                {selectedAssignment.assignment.tasks && selectedAssignment.assignment.tasks.length > 0 ? (
                  <ul className="space-y-2 text-base sm:text-lg">
                    {selectedAssignment.assignment.tasks.map(task => (
                      <li key={task.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(selectedAssignment.assignment.id, task.id)}
                          className="mr-2 rounded text-[#2CB3C2] focus:ring-[#2CB3C2]"
                        />
                        <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 text-base sm:text-lg">{t('aucuneTache')}</p>
                )}
              </div>
            )}

            {activeTab === 'Ressources' && (
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">{t('ressources')}</h3>
                {selectedAssignment.assignment.resources && selectedAssignment.assignment.resources.length > 0 ? (
                  <ul className="space-y-2 text-base sm:text-lg">
                    {selectedAssignment.assignment.resources.map(resource => (
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
                  <p className="text-gray-600 text-base sm:text-lg">{t('aucuneRessource')}</p>
                )}
              </div>
            )}
          </div>

          {/* Bouton Fermer */}
          <div className="mt-6 sm:mt-8 flex justify-end">
            <button
              onClick={() => setSelectedAssignment(null)}
              className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-[#2CB3C2] text-white !text-white hover:bg-[#1A8A99] transition-colors shadow-md rounded-lg text-base sm:text-lg"
            >
              <FaArrowLeft className="mr-1 sm:mr-2" /> {t('fermer')}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {/* Progression */}
          <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
            <div className="text-base sm:text-lg mb-2">{t('progression')} : {completionPercentage}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
              <div className="bg-[#2CB3C2] h-2 sm:h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>

          {/* Filtres */}
          <div className="max-w-4xl mx-auto mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder={t('rechercher')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2CB3C2] text-base sm:text-lg"
              />
            </div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full sm:w-32 p-2 rounded-lg border bg-white border-gray-300 text-gray-900 text-base sm:text-lg"
            >
              <option value="all">{t('tous')}</option>
              <option value="À rendre">{t('à rendre')}</option>
              <option value="Rendu">{t('rendu')}</option>
              <option value="Noté">{t('noté')}</option>
              <option value="En retard">{t('en retard')}</option>
            </select>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="w-full sm:w-32 p-2 rounded-lg border bg-white border-gray-300 text-gray-900 text-base sm:text-lg"
            >
              <option value="all">{t('toutesPriorités')}</option>
              <option value="High">{t('haute')}</option>
              <option value="Medium">{t('moyenne')}</option>
              <option value="Low">{t('basse')}</option>
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'dueDate' | 'title' | 'priority')}
              className="w-full sm:w-32 p-2 rounded-lg border bg-white border-gray-300 text-gray-900 text-base sm:text-lg"
            >
              <option value="dueDate">{t('date')}</option>
              <option value="title">{t('titre')}</option>
              <option value="priority">{t('priorité')}</option>
            </select>
          </div>

          {/* Bouton d'exportation */}
          <div className="max-w-4xl mx-auto mb-4 sm:mb-6">
            <button
              onClick={exportToCSV}
              className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-[#2CB3C2] text-white !text-white hover:bg-[#1A8A99] transition-colors shadow-md rounded-lg text-base sm:text-lg"
            >
              <FaDownload className="mr-1 sm:mr-2" /> {t('exporterCSV')}
            </button>
          </div>

          {/* Liste des devoirs */}
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <Skeleton height={60} count={5} className="mb-4 rounded-lg" />
            ) : paginatedAssignments.length > 0 ? (
              <div className="p-4 rounded-xl shadow-lg bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left hidden sm:table">
                    <thead>
                      <tr className="bg-[#2CB3C2] text-white">
                        <th className="p-3 rounded-tl-lg text-base sm:text-lg">{t('cours')}</th>
                        <th className="p-3 text-base sm:text-lg">{t('devoir')}</th>
                        <th className="p-3 text-base sm:text-lg">{t('dateLimite')}</th>
                        <th className="p-3 text-base sm:text-lg">{t('priorité')}</th>
                        <th className="p-3 text-base sm:text-lg">{t('statut')}</th>
                        <th className="p-3 text-base sm:text-lg">{t('note')}</th>
                        <th className="p-3 rounded-tr-lg text-base sm:text-lg">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAssignments.map(({ course, assignment }, index) => {
                        const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
                        return (
                          <tr
                            key={assignment.id}
                            className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                            onClick={() => setSelectedAssignment({ course, assignment })}
                          >
                            <td className="p-3 text-base sm:text-lg">
                              {course}
                              <a href={mockCourses.find(c => c.title === course)?.materials[0] || '#'} target="_blank" rel="noopener noreferrer">
                                <FaBook className="inline ml-2 text-[#2CB3C2] hover:text-[#1A8A99]" />
                              </a>
                            </td>
                            <td className="p-3 text-base sm:text-lg">{assignment.title}</td>
                            <td className="p-3 text-base sm:text-lg">
                              {assignment.dueDate || '---'}
                              {isDueSoon(assignment.dueDate) && <span className="ml-2 text-yellow-500">({t('bientôt')})</span>}
                            </td>
                            <td className="p-3 text-base sm:text-lg"><span className={getPriorityColor(assignment.priority)}>{assignment.priority || 'Medium'}</span></td>
                            <td className="p-3 text-base sm:text-lg">
                              <span className={`px-2 py-1 rounded-full text-white text-base sm:text-lg ${getStatusColor(assignment.status)}`}>
                                {assignment.status}
                              </span>
                            </td>
                            <td className="p-3 text-base sm:text-lg">
                              {assignment.status === 'Noté' ? (
                                <select
                                  value={assignment.grade || 'N/A'}
                                  onChange={e => handleGradeChange(globalIndex, e.target.value)}
                                  onClick={e => e.stopPropagation()}
                                  className="p-1 rounded bg-white text-gray-900 text-base sm:text-lg"
                                >
                                  <option value="N/A">N/A</option>
                                  <option value="A">A</option>
                                  <option value="B+">B+</option>
                                  <option value="B">B</option>
                                  <option value="C+">C+</option>
                                  <option value="C">C</option>
                                  <option value="D">D</option>
                                  <option value="F">F</option>
                                </select>
                              ) : (
                                assignment.grade || 'N/A'
                              )}
                            </td>
                            <td className="p-3 flex gap-2">
                              {assignment.status === 'À rendre' && (
                                <button
                                  onClick={e => { e.stopPropagation(); handleStatusChange(globalIndex, 'Rendu'); }}
                                  className="text-purple-500 hover:text-purple-700"
                                >
                                  <FaCheck />
                                </button>
                              )}
                              {assignment.status === 'Rendu' && (
                                <button
                                  onClick={e => { e.stopPropagation(); handleStatusChange(globalIndex, 'Noté'); }}
                                  className="text-green-500 hover:text-green-700"
                                >
                                  <FaEdit />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {/* Version mobile en cartes */}
                  <div className="sm:hidden space-y-4">
                    {paginatedAssignments.map(({ course, assignment }, index) => {
                      const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
                      return (
                        <div
                          key={assignment.id}
                          className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer"
                          onClick={() => setSelectedAssignment({ course, assignment })}
                        >
                          <h4 className="text-base font-semibold text-gray-800">{assignment.title}</h4>
                          <p className="text-sm text-gray-600">{course}</p>
                          <p className="text-sm mt-1"><span className="font-medium">{t('dateLimite')} :</span> {assignment.dueDate || '---'}</p>
                          <p className="text-sm mt-1"><span className="font-medium">{t('statut')} :</span> <span className={`px-2 py-1 rounded-full text-white text-sm ${getStatusColor(assignment.status)}`}>{assignment.status}</span></p>
                          <div className="mt-2 flex gap-2">
                            {assignment.status === 'À rendre' && (
                              <button
                                onClick={e => { e.stopPropagation(); handleStatusChange(globalIndex, 'Rendu'); }}
                                className="text-purple-500 hover:text-purple-700"
                              >
                                <FaCheck />
                              </button>
                            )}
                            {assignment.status === 'Rendu' && (
                              <button
                                onClick={e => { e.stopPropagation(); handleStatusChange(globalIndex, 'Noté'); }}
                                className="text-green-500 hover:text-green-700"
                              >
                                <FaEdit />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {totalPages > 1 && (
                  <div className="mt-4 flex justify-center gap-3 sm:gap-4">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#2CB3C2] text-white !text-white rounded-lg disabled:bg-gray-400 text-base sm:text-lg"
                    >
                      {t('précédent')}
                    </button>
                    <span className="text-base sm:text-lg">{t('page')} {currentPage} / {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#2CB3C2] text-white !text-white rounded-lg disabled:bg-gray-400 text-base sm:text-lg"
                    >
                      {t('suivant')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-base sm:text-lg">{t('aucunDevoir')}</p>
            )}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default AssignmentsPage;
