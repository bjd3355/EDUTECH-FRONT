import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaTasks, FaPlus, FaFilter, FaEdit, FaTrash, FaCopy, FaLink, FaCheck, FaTimes, FaCheckCircle, FaSort, FaDownload, FaFileDownload, FaClipboardList, FaFileAlt, FaUpload, FaFileArchive, FaFilePdf } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Interfaces
interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'À venir' | 'En cours' | 'Terminé' | 'Rendu' | 'Noté' | 'En retard';
  googleFormLink?: string;
  courseName: string;
  className: string;
  duration?: string;
  grade?: string;
  tasks?: Task[];
  resources?: Resource[];
  studentSubmissions?: SubmissionStatus[];
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

interface Student {
  id: number;
  name: string;
  email: string;
}

interface SubmissionStatus {
  studentId: number;
  submitted: boolean;
  submissionDate?: string;
  submissionType?: 'file' | 'text'; // Type de soumission
  submissionContent?: string | File; // Contenu : fichier ou texte (ex. réponses QCM)
}

// Mock data
const mockClasses = [
  { id: 1, name: 'Classe 1A' },
  { id: 2, name: 'Classe 2B' },
  { id: 3, name: 'Classe 3C' },
];

const mockStudents: Student[] = [
  { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com' },
  { id: 2, name: 'Marie Curie', email: 'marie.curie@email.com' },
  { id: 3, name: 'Pierre Martin', email: 'pierre.martin@email.com' },
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
      className: 'Classe 1A',
      duration: '01:00',
      tasks: [
        { id: 1, title: 'Étudier les bases de Python', completed: false },
        { id: 2, title: 'Répondre au QCM', completed: false },
      ],
      resources: [
        { id: 1, title: 'Cours PDF', url: 'https://example.com/pdf1.pdf', type: 'PDF' },
      ],
      studentSubmissions: [
        { 
          studentId: 1, 
          submitted: true, 
          submissionDate: '2025-03-30', 
          submissionType: 'text', 
          submissionContent: '1. Vrai\n2. Faux\n3. Vrai' 
        },
        { studentId: 2, submitted: false },
        { 
          studentId: 3, 
          submitted: true, 
          submissionDate: '2025-03-31', 
          submissionType: 'text', 
          submissionContent: '1. Faux\n2. Vrai\n3. Vrai' 
        },
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
      className: 'Classe 2B',
      duration: '02:30',
      studentSubmissions: [
        { studentId: 1, submitted: false },
        { 
          studentId: 2, 
          submitted: true, 
          submissionDate: '2025-03-27', 
          submissionType: 'file', 
          submissionContent: new File(['algorithme_tri.zip'], 'algorithme_tri.zip', { type: 'application/zip' }) 
        },
        { studentId: 3, submitted: false },
      ],
    },
    {
      id: 3,
      title: 'Projet Web',
      description: 'Création d’un site web simple.',
      dueDate: '2025-03-26',
      status: 'Rendu',
      courseName: 'Développement Web',
      className: 'Classe 3C',
      duration: '03:00',
      grade: 'A',
      studentSubmissions: [
        { 
          studentId: 1, 
          submitted: true, 
          submissionDate: '2025-03-25', 
          submissionType: 'file', 
          submissionContent: new File(['projet_web.zip'], 'projet_web.zip', { type: 'application/zip' }) 
        },
        { 
          studentId: 2, 
          submitted: true, 
          submissionDate: '2025-03-25', 
          submissionType: 'file', 
          submissionContent: new File(['site_web.zip'], 'site_web.zip', { type: 'application/zip' }) 
        },
        { 
          studentId: 3, 
          submitted: true, 
          submissionDate: '2025-03-26', 
          submissionType: 'file', 
          submissionContent: new File(['mon_site.zip'], 'mon_site.zip', { type: 'application/zip' }) 
        },
      ],
    },
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('Tous');
  const [sortBy, setSortBy] = useState<'dueDate' | 'title'>('dueDate');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({});
  const [isEditing, setIsEditing] = useState(false);

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
        className: newAssignment.className,
        duration: newAssignment.duration || '01:00',
        tasks: newAssignment.tasks || [],
        resources: newAssignment.resources || [],
        studentSubmissions: mockStudents.map(student => ({
          studentId: student.id,
          submitted: false,
        })),
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
        className: newAssignment.className,
        duration: newAssignment.duration || '01:00',
        grade: newAssignment.grade,
        tasks: newAssignment.tasks || [],
        resources: newAssignment.resources || [],
        studentSubmissions: newAssignment.studentSubmissions || [],
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

  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredAndSortedAssignments = useMemo(() => {
    let result = [...assignments];
    if (filterStatus !== 'Tous') result = result.filter(assignment => assignment.status === filterStatus);
    if (searchTerm) {
      result = result.filter(assignment =>
        assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.className.toLowerCase().includes(searchTerm.toLowerCase())
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
    const headers = ['Cours', 'Classe', 'Devoir', 'Date limite', 'Durée', 'Statut', 'Note', 'Rendus/Total'].join(',');
    const rows = filteredAndSortedAssignments.map(assignment => {
      const submittedCount = assignment.studentSubmissions?.filter(s => s.submitted).length || 0;
      const totalCount = assignment.studentSubmissions?.length || 0;
      return [
        assignment.courseName,
        assignment.className,
        assignment.title,
        assignment.dueDate || '---',
        assignment.duration || '01:00',
        assignment.status,
        assignment.grade || 'N/A',
        `${submittedCount}/${totalCount}`
      ].join(',');
    }).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'assignments.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            { placeholder: 'Lien Google Forms (optionnel)', key: 'google ModeloLink', type: 'text' },
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
                className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {paginatedAssignments.map((assignment) => (
                  <motion.div
                    key={assignment.id}
                    className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-[#2CB3C2] mb-2">{assignment.title}</h3>
                        <p><strong>Cours :</strong> {assignment.courseName}</p>
                        <p><strong>Classe :</strong> {assignment.className}</p>
                        <p><strong>Date limite :</strong> {assignment.dueDate} {isDueSoon(assignment.dueDate) && <span className="text-yellow-500">(Bientôt)</span>}</p>
                        <p><strong>Durée :</strong> {assignment.duration || '01:00'}</p>
                        <p><strong>Statut :</strong> <span className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(assignment.status)}`}>{assignment.status}</span></p>
                        <p><strong>Description :</strong> {assignment.description}</p>
                        {assignment.googleFormLink && (
                          <p className="flex items-center gap-2">
                            <strong>Lien :</strong>
                            <a href={assignment.googleFormLink} target="_blank" rel="noopener noreferrer" className="text-[#2CB3C2] hover:underline flex items-center gap-1">
                              <FaLink /> Ouvrir
                            </a>
                            <motion.button onClick={() => copyToClipboard(assignment.googleFormLink!)} className="text-gray-500 hover:text-[#2CB3C2]" whileHover={{ scale: 1.2 }}>
                              <FaCopy />
                            </motion.button>
                          </p>
                        )}
                      </div>

                      <div className="space-y-4">
                        {/* Tâches */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center"><FaTasks className="mr-2" /> Tâches</h4>
                          {assignment.tasks && assignment.tasks.length > 0 ? (
                            <ul className="space-y-2 text-sm">
                              {assignment.tasks.map(task => (
                                <li key={task.id} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask(assignment.id, task.id)}
                                    className="mr-2 rounded text-[#2CB3C2] focus:ring-[#2CB3C2]"
                                  />
                                  <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.title}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-600 text-sm">Aucune tâche disponible.</p>
                          )}
                        </div>

                        {/* Ressources */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center"><FaFileAlt className="mr-2" /> Ressources</h4>
                          {assignment.resources && assignment.resources.length > 0 ? (
                            <ul className="space-y-2 text-sm">
                              {assignment.resources.map(resource => (
                                <li key={resource.id}>
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-[#2CB3C2] hover:underline flex items-center">
                                    <FaFileDownload className="mr-2" /> {resource.title} ({resource.type})
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-600 text-sm">Aucune ressource disponible.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rendus */}
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center"><FaUpload className="mr-2" /> Statuts de rendu</h4>
                      {assignment.studentSubmissions && assignment.studentSubmissions.length > 0 ? (
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm font-medium text-gray-700">
                            <span>Étudiant</span>
                            <span className="flex-1 ml-4">Statut</span>
                            <span>Soumission</span>
                          </div>
                          {assignment.studentSubmissions.map((submission) => {
                            const student = mockStudents.find(s => s.id === submission.studentId);
                            return (
                              <div key={submission.studentId} className="flex items-center p-2 bg-white rounded-lg shadow-sm text-sm">
                                <span className="w-1/4">{student?.name || 'Étudiant inconnu'}</span>
                                <span className={`w-1/4 ${submission.submitted ? 'text-green-600' : 'text-red-600'}`}>
                                  {submission.submitted ? (
                                    <span className="flex items-center">
                                      <FaCheck className="mr-1" /> Rendu {submission.submissionDate}
                                    </span>
                                  ) : (
                                    <span className="flex items-center">
                                      <FaTimes className="mr-1" /> Non rendu
                                    </span>
                                  )}
                                </span>
                                <span className="flex-1">
                                  {submission.submitted && submission.submissionType === 'text' && (
                                    <pre className="text-xs bg-gray-100 p-2 rounded">{submission.submissionContent as string}</pre>
                                  )}
                                  {submission.submitted && submission.submissionType === 'file' && (
                                    <motion.button
                                      onClick={() => downloadFile(submission.submissionContent as File)}
                                      className="flex items-center text-[#2CB3C2] hover:underline"
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      {submission.submissionContent instanceof File && submission.submissionContent.type === 'application/zip' ? (
                                        <FaFileArchive className="mr-1" />
                                      ) : (
                                        <FaFilePdf className="mr-1" />
                                      )}
                                      {submission.submissionContent instanceof File ? submission.submissionContent.name : 'Télécharger'}
                                    </motion.button>
                                  )}
                                </span>
                              </div>
                            );
                          })}
                          <div className="mt-2 text-sm">
                            <p><strong>Total rendus :</strong> {assignment.studentSubmissions.filter(s => s.submitted).length}/{assignment.studentSubmissions.length}</p>
                            <p><strong>Pourcentage :</strong> {Math.round((assignment.studentSubmissions.filter(s => s.submitted).length / assignment.studentSubmissions.length) * 100)}%</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm">Aucune information de rendu disponible.</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-4">
                      <motion.button
                        onClick={() => handleEditAssignment(assignment)}
                        className="text-gray-500 hover:text-[#2CB3C2] transition-colors duration-200"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        <FaEdit className="text-lg" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                        whileHover={{ scale: 1.2, rotate: -10 }}
                      >
                        <FaTrash className="text-lg" />
                      </motion.button>
                      {assignment.status !== 'Rendu' && assignment.status !== 'Noté' && (
                        <motion.button
                          onClick={() => handleMarkAsSubmitted(assignment.id)}
                          className="text-gray-500 hover:text-purple-500 transition-colors duration-200"
                          whileHover={{ scale: 1.2 }}
                        >
                          <FaCheckCircle className="text-lg" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
                {totalPages > 1 && (
                  <div className="mt-4 flex justify-center gap-4">
                    <motion.button
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white rounded-xl disabled:bg-gray-400 text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Précédent
                    </motion.button>
                    <span className="text-sm">Page {currentPage} / {totalPages}</span>
                    <motion.button
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white rounded-xl disabled:bg-gray-400 text-sm"
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