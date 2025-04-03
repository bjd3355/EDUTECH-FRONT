import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaFilePdf, FaSearch, FaPaperPlane, FaStickyNote, FaBullhorn, FaChartPie, FaClipboardList, FaBars, FaArrowLeft, FaVideo, FaCalendarAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import des images depuis le dossier assets
import course1Image from '../assets/algo.jpg';
import course2Image from '../assets/Mathématiques Avancées.jpg';
import course3Image from '../assets/Développement Web.jpg';
import course4Image from '../assets/title_ _Bases de Données_,.jpg';
import course5Image from '../assets/title_ _Programmation Orientée Objet_,.jpg';
import course6Image from '../assets/title_ _Intelligence Artificielle_,.jpg';
import course7Image from '../assets/title_ _Cybersécurité_,.jpg';

// Interfaces
interface Assignment { title: string; dueDate: string; status: string; }
interface Schedule { date: string; time: string; status: string; }
interface Course { id: number; title: string; description: string; image: string; materials: string[]; liveLink?: string; assignments: Assignment[]; schedule: Schedule[]; }
interface Note { id: number; content: string; createdAt: string; }

// Données mock
const mockCourses: Course[] = [
  { id: 1, title: "Introduction à l'Algorithmique", description: "Apprenez les bases de la programmation avec des algorithmes simples.", image: course1Image, materials: ["https://example.com/pdf1.pdf"], liveLink: "https://zoom.us/j/123456789", assignments: [{ title: "Devoir cours 1", dueDate: "20/01/2025", status: "À rendre" }], schedule: [{ date: "01/04/2025", time: "17h30", status: "En ligne" }] },
  { id: 2, title: "Mathématiques Avancées", description: "Cours sur les équations différentielles et l'algèbre linéaire.", image: course2Image, materials: ["https://example.com/math1.pdf"], assignments: [{ title: "Devoir cours 2", dueDate: "", status: "Note" }], schedule: [{ date: "01/04/2025", time: "09h00", status: "En direct" }] },
  { id: 3, title: "Développement Web", description: "Création de sites web avec HTML, CSS et JavaScript.", image: course3Image, materials: ["https://example.com/web1.pdf"], liveLink: "https://zoom.us/j/987654321", assignments: [{ title: "Projet cours 3", dueDate: "26/03/2025", status: "Rendu" }], schedule: [{ date: "02/04/2025", time: "", status: "À venir" }] },
  { id: 4, title: "Bases de Données", description: "Introduction aux bases de données relationnelles.", image: course4Image, materials: ["https://example.com/db1.pdf"], assignments: [{ title: "QCM cours 4", dueDate: "27/04/2025", status: "À rendre" }], schedule: [{ date: "02/04/2025", time: "", status: "À venir" }] },
  { id: 5, title: "Programmation Orientée Objet", description: "Concepts avancés de programmation orientée objet.", image: course5Image, materials: ["https://example.com/oop1.pdf"], assignments: [], schedule: [{ date: "27/03/2025", time: "09h00", status: "Annuler" }] },
  { id: 6, title: "Intelligence Artificielle", description: "Introduction à l'intelligence artificielle.", image: course6Image, materials: ["https://example.com/ai1.pdf"], assignments: [], schedule: [{ date: "29/03/2025", time: "09h00", status: "En direct" }] },
  { id: 7, title: "Cybersécurité", description: "Fondements de la cybersécurité.", image: course7Image, materials: ["https://example.com/cyber1.pdf"], assignments: [], schedule: [{ date: "30/03/2025", time: "11h30", status: "En ligne" }] },
];

const mockNotes: Note[] = [{ id: 1, content: "Réviser les algorithmes de tri", createdAt: "2025-04-01" }];

const CoursesPage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<string>('Tout');
  const [activeTab, setActiveTab] = useState<string>('Support de cours');
  const [message, setMessage] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [newNote, setNewNote] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setCourses(mockCourses);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En ligne": return "bg-orange-500";
      case "En direct": return "bg-blue-500";
      case "À venir": return "bg-purple-500";
      case "Annuler": return "bg-red-500";
      case "À rendre": return "bg-orange-500";
      case "Rendu": return "bg-purple-500";
      case "Note": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'Tout') return matchesSearch;

    const today = new Date('2025-04-02');
    const courseDateStr = course.schedule[0]?.date;
    let courseDate: Date | null = null;
    if (courseDateStr) {
      const [day, month, year] = courseDateStr.split('/').map(Number);
      courseDate = new Date(year, month - 1, day);
    }
    const status = course.schedule[0]?.status;

    switch (filter) {
      case 'En cours': return matchesSearch && (status === 'En ligne' || status === 'En direct');
      case 'À venir': return matchesSearch && courseDate && courseDate > today;
      case 'Passés': return matchesSearch && courseDate && courseDate < today;
      case 'Retirés de l’affichage': return matchesSearch && status === 'Annuler';
      default: return matchesSearch;
    }
  });

  const handleMaterialClick = () => toast.info(t('telechargementEnCours'), { position: "top-right", autoClose: 3000 });

  const sendMessage = () => {
    if (message.trim()) {
      toast.success(t('messageEnvoye'), { position: "top-right", autoClose: 3000 });
      setMessage('');
    } else {
      toast.error(t('messageVide'), { position: "top-right", autoClose: 3000 });
    }
  };

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { id: notes.length + 1, content: newNote, createdAt: new Date().toLocaleDateString('fr-FR') }]);
      setNewNote('');
      toast.success(t('noteAjoutee'), { position: "top-right", autoClose: 2000 });
    }
  };

  const completedAssignments = selectedCourse?.assignments.filter(a => a.status === 'Rendu').length || 0;
  const totalAssignments = selectedCourse?.assignments.length || 0;
  const progress = totalAssignments ? (completedAssignments / totalAssignments) * 100 : 0;

  const tabs = [
    { name: 'Support de cours', icon: <FaFilePdf /> },
    { name: 'Vue d\'ensemble', icon: <FaBook /> },
    { name: 'Annonce', icon: <FaBullhorn /> },
    { name: 'Devoirs', icon: <FaClipboardList /> },
    { name: 'Progression', icon: <FaChartPie /> },
    { name: 'Notes', icon: <FaStickyNote /> },
    { name: 'Retour à Mes Cours', icon: <FaArrowLeft />, action: () => setSelectedCourse(null) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-8">
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#2CB3C2] flex justify-center items-center">
          <FaBook className="mr-2" /> {t('Mes Cours')} - Génie Informatique
        </h1>
        <div className="mt-2 h-1 w-24 bg-[#2CB3C2] mx-auto rounded-full"></div>
      </motion.header>

      {selectedCourse ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="bg-white p-4 sm:p-8 rounded-2xl shadow-xl border border-gray-200 max-w-5xl mx-auto">
          <div className="relative">
            <img src={selectedCourse.image} alt={selectedCourse.title} className="w-full h-48 sm:h-64 object-cover rounded-xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
            <h2 className="absolute bottom-4 left-4 text-xl sm:text-2xl font-bold text-white">{selectedCourse.title}</h2>
          </div>

          {/* Barre de navigation avec "Retour à Mes Cours" */}
          <div className="mt-6">
            {/* Mobile : Menu Hamburger */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center p-2 bg-[#2CB3C2] text-white rounded-lg shadow-md hover:bg-[#218a91] transition-colors w-full justify-between"
              >
                <span className="flex items-center">
                  <FaBars className="mr-2" /> Menu
                </span>
                <span className="text-sm">{activeTab}</span>
              </button>
              {isMenuOpen && (
                <motion.div
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '-100%', opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed top-0 left-0 w-3/4 sm:w-64 h-full bg-white shadow-xl z-50 p-4"
                >
                  <button onClick={() => setIsMenuOpen(false)} className="absolute top-4 right-4 text-gray-600 hover:text-[#2CB3C2]">
                    ✕
                  </button>
                  <div className="mt-12 space-y-2">
                    {tabs.map(tab => (
                      <button
                        key={tab.name}
                        onClick={() => {
                          if (tab.action) tab.action();
                          else setActiveTab(tab.name);
                          setIsMenuOpen(false);
                        }}
                        className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          activeTab === tab.name && !tab.action ? 'bg-[#2CB3C2] text-white shadow-[0_0_10px_rgba(44,179,194,0.5)]' : 'text-gray-700 hover:bg-[#2CB3C2]/10 hover:text-[#2CB3C2]'
                        }`}
                      >
                        <span className="mr-2 text-base">{tab.icon}</span>
                        {tab.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              {isMenuOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setIsMenuOpen(false)} />}
            </div>

            {/* Desktop : Onglets horizontaux */}
            <div className="hidden sm:flex bg-gray-50 p-2 rounded-xl shadow-sm border border-gray-200 flex-wrap gap-2 justify-center">
              {tabs.map(tab => (
                <motion.button
                  key={tab.name}
                  onClick={() => {
                    if (tab.action) tab.action();
                    else setActiveTab(tab.name);
                  }}
                  className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 shadow-sm ${
                    activeTab === tab.name && !tab.action
                      ? 'bg-[#2CB3C2] text-white shadow-[0_0_10px_rgba(44,179,194,0.5)]'
                      : 'bg-white text-gray-700 hover:bg-[#2CB3C2]/80 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(44, 179, 194, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-1 text-base">{tab.icon}</span>
                  {tab.name}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {activeTab === 'Support de cours' && (
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center"><FaFilePdf className="mr-2 text-[#2CB3C2]" /> {t('Supports De Cours')}</h3>
                {selectedCourse.materials.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {selectedCourse.materials.map((material, index) => (
                      <a key={index} href={material} onClick={() => handleMaterialClick()} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors">
                        <FaFilePdf className="mr-3 text-[#2CB3C2]" />
                        <span className="text-[#2CB3C2] hover:underline">{t('telechargerSupport')} {index + 1}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 mt-2">{t('Aucun Support')}</p>
                )}
              </div>
            )}

            {activeTab === 'Vue d\'ensemble' && (
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">{t('Vue d\'ensemble')}</h3>
                <p className="text-gray-700 mt-4 leading-relaxed">{selectedCourse.description}</p>
                {selectedCourse.schedule.length > 0 && (
                  <p className="text-gray-600 mt-2">Prochain cours : {selectedCourse.schedule[0].date} à {selectedCourse.schedule[0].time || '---'}</p>
                )}
              </div>
            )}

            {activeTab === 'Annonce' && (
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">{t('Annonces')}</h3>
                <p className="text-gray-600 mt-4">Aucune annonce pour le moment.</p>
                <div className="mt-4">
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('envoyerMessage')} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" rows={3}></textarea>
                  <button onClick={sendMessage} className="mt-2 flex items-center px-4 py-2 bg-[#2CB3C2] text-white rounded-lg hover:bg-[#218a91] transition-colors">
                    <FaPaperPlane className="mr-2" /> {t('envoyer')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Devoirs' && (
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center"><FaClipboardList className="mr-2 text-[#2CB3C2]" /> {t('Devoirs')}</h3>
                {selectedCourse.assignments.length > 0 ? (
                  <table className="w-full mt-4 border-collapse">
                    <thead>
                      <tr className="bg-[#2CB3C2] text-white">
                        <th className="p-3 text-left rounded-tl-lg">{t('Devoirs')}</th>
                        <th className="p-3 text-left">{t('dateLimite')}</th>
                        <th className="p-3 text-left rounded-tr-lg">{t('Statut')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCourse.assignments.map((assignment, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="p-3">{assignment.title}</td>
                          <td className="p-3">{assignment.dueDate || '---'}</td>
                          <td className="p-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getStatusColor(assignment.status)}`}>{assignment.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-600 mt-2">{t('Aucun Devoir')}</p>
                )}
              </div>
            )}

            {activeTab === 'Progression' && (
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">{t('Progression')}</h3>
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-[#2CB3C2]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${progress}, 100`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-[#2CB3C2]">{Math.round(progress)}%</span>
                    </div>
                  </div>
                  <p className="text-gray-600">{completedAssignments} / {totalAssignments} devoirs rendus</p>
                </div>
              </div>
            )}

            {activeTab === 'Notes' && (
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center"><FaStickyNote className="mr-2 text-[#2CB3C2]" /> {t('Notes')}</h3>
                <div className="mt-4 space-y-2">
                  {notes.map(note => (
                    <div key={note.id} className="p-2 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-700">{note.content}</p>
                      <span className="text-xs text-gray-400">{note.createdAt}</span>
                    </div>
                  ))}
                  <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder={t('ajouterNote')} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]" rows={2}></textarea>
                  <button onClick={addNote} className="mt-2 flex items-center px-4 py-2 bg-[#2CB3C2] text-white rounded-lg hover:bg-[#218a91] transition-colors">
                    {t('ajouter')}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            {selectedCourse.liveLink && (
              <a href={selectedCourse.liveLink} className="inline-flex items-center px-4 py-2 bg-[#2CB3C2] text-white rounded-lg hover:bg-[#218a91] transition-colors shadow-md w-full sm:w-auto text-center text-sm">
                <FaVideo className="mr-2" /> {t('RejoindreCoursDirect')}
              </a>
            )}
            <button
              onClick={() => setSelectedCourse(null)}
              className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md w-full sm:w-auto text-center text-sm"
            >
              {t('retour')}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder={t('rechercherCours')} value={searchTerm} onChange={handleSearch} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2CB3C2] transition-all" />
            </div>
            <select value={filter} onChange={handleFilterChange} className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2CB3C2] transition-all">
              <option value="Tout">{t('Tout')}</option>
              <option value="En cours">{t('En cours')}</option>
              <option value="À venir">{t('À venir')}</option>
              <option value="Passés">{t('Passés')}</option>
              <option value="Retirés de l’affichage">{t('Retirés de l’affichage')}</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => <Skeleton key={index} height={300} className="rounded-xl" />)}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <motion.div key={course.id} className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden" whileHover={{ scale: 1.03 }} onClick={() => setSelectedCourse(course)}>
                  <div className="relative">
                    <img src={course.image} alt={course.title} className="w-full h-40 object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg"></div>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mt-4">{course.title}</h2>
                  <p className="text-gray-600 mt-2 line-clamp-2">{course.description}</p>
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <span className="flex items-center text-gray-500"><FaClipboardList className="mr-1 text-[#2CB3C2]" /> {course.assignments.length} {t('devoirs')}</span>
                    <span className="flex items-center text-gray-500"><FaCalendarAlt className="mr-1 text-[#2CB3C2]" /> {course.schedule.length} {t('seances')}</span>
                  </div>
                  <div className="absolute inset-0 border-2 border-[#2CB3C2] rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-lg">{t('aucunCoursTrouve')}</p>
          )}
        </motion.section>
      )}
      <ToastContainer />
    </div>
  );
};

export default CoursesPage;
