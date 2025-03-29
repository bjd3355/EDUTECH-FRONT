import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaFilePdf, FaVideo, FaTasks, FaCalendarAlt, FaSearch, FaPaperPlane, FaBell } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Interfaces pour typage
interface Assignment {
  title: string;
  dueDate: string;
  status: string;
}

interface Schedule {
  date: string;
  time: string;
  status: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  materials: string[];
  liveLink?: string;
  assignments: Assignment[];
  schedule: Schedule[];
  field: string;
  class: string;
}

interface Announcement {
  id: number;
  author: string;
  date: string;
  content: React.ReactNode;
  isNew?: boolean;
}

const mockCourses: Course[] = [
  // Filière : Informatique
  {
    id: 1,
    title: "Introduction à l'Algorithmique",
    description: "Apprenez les bases de la programmation avec des algorithmes simples.",
    image: "/assets/algo.jpg",
    materials: ["https://example.com/pdf1.pdf", "https://example.com/pdf2.pdf"],
    liveLink: "https://zoom.us/j/123456789",
    assignments: [
      { title: "Devoir cours 1", dueDate: "20/01/2025", status: "À corriger" },
    ],
    schedule: [
      { date: "01/04/2025", time: "17h30", status: "En ligne" },
    ],
    field: "Informatique",
    class: "L1A",
  },
  {
    id: 2,
    title: "Développement Web",
    description: "Création de sites web avec HTML, CSS et JavaScript.",
    image: "/assets/DeveloppementWeb.jpg",
    materials: ["https://example.com/web1.pdf", "https://example.com/web2.pdf"],
    liveLink: "https://zoom.us/j/987654321",
    assignments: [
      { title: "Projet cours 3", dueDate: "26/03/2025", status: "À corriger" },
    ],
    schedule: [
      { date: "02/04/2025", time: "10h30", status: "À venir" },
    ],
    field: "Informatique",
    class: "L2B",
  },
  {
    id: 3,
    title: "Bases de Données",
    description: "Introduction aux bases de données relationnelles.",
    image: "/assets/BasesDeDonnees.jpg",
    materials: ["https://example.com/db1.pdf"],
    assignments: [
      { title: "QCM cours 4", dueDate: "27/04/2025", status: "À corriger" },
    ],
    schedule: [
      { date: "02/04/2025", time: "14h00", status: "À venir" },
    ],
    field: "Informatique",
    class: "M1A",
  },
  {
    id: 4,
    title: "Programmation Orientée Objet",
    description: "Concepts avancés de programmation orientée objet.",
    image: "/assets/ProgrammationOrienteeObjet.jpg",
    materials: ["https://example.com/oop1.pdf"],
    assignments: [],
    schedule: [
      { date: "27/03/2025", time: "09h00", status: "Annulé" },
    ],
    field: "Informatique",
    class: "L3C",
  },
  {
    id: 5,
    title: "Intelligence Artificielle",
    description: "Introduction à l'intelligence artificielle.",
    image: "/assets/IntelligenceArtificielle.jpg",
    materials: ["https://example.com/ai1.pdf"],
    assignments: [],
    schedule: [
      { date: "29/03/2025", time: "09h00", status: "Présentiel" },
    ],
    field: "Informatique",
    class: "M2A",
  },
  {
    id: 6,
    title: "Cybersécurité",
    description: "Fondements de la cybersécurité.",
    image: "/assets/Cybersecurite.jpg",
    materials: ["https://example.com/cyber1.pdf"],
    assignments: [],
    schedule: [
      { date: "30/03/2025", time: "11h30", status: "En ligne" },
    ],
    field: "Informatique",
    class: "M2B",
  },
  // Filière : Mathématiques
  {
    id: 7,
    title: "Mathématiques Avancées",
    description: "Cours sur les équations différentielles et l'algèbre linéaire.",
    image: "/assets/MathematiquesAvancees.jpg",
    materials: ["https://example.com/math1.pdf"],
    assignments: [
      { title: "Devoir cours 2", dueDate: "15/03/2025", status: "Corrigé" },
    ],
    schedule: [
      { date: "01/04/2025", time: "09h00", status: "Présentiel" },
    ],
    field: "Mathématiques",
    class: "L1B",
  },
  {
    id: 8,
    title: "Calcul Différentiel",
    description: "Étude approfondie des dérivées et intégrales.",
    image: "/assets/calculdifferentiel.jpg", // Placeholder temporaire (image manquante)
    materials: ["https://example.com/math2.pdf"],
    assignments: [
      { title: "Exercice calcul 1", dueDate: "20/03/2025", status: "À corriger" },
    ],
    schedule: [
      { date: "03/04/2025", time: "14h00", status: "À venir" },
    ],
    field: "Mathématiques",
    class: "L2A",
  },
  // Filière : Physique
  {
    id: 9,
    title: "Mécanique Classique",
    description: "Introduction aux lois de Newton et à la dynamique.",
    image: "/assets/mecaniqueclassique.jpg", // Placeholder temporaire (image manquante)
    materials: ["https://example.com/phys1.pdf"],
    assignments: [
      { title: "TD Mécanique", dueDate: "25/03/2025", status: "À corriger" },
    ],
    schedule: [
      { date: "01/04/2025", time: "11h00", status: "Présentiel" },
    ],
    field: "Physique",
    class: "L2C",
  },
  // Filière : Chimie
  {
    id: 10,
    title: "Chimie Organique",
    description: "Étude des composés organiques et de leurs réactions.",
    image: "/assets/chimieorganique.jpg", // Placeholder temporaire (image manquante)
    materials: ["https://example.com/chem1.pdf"],
    assignments: [],
    schedule: [
      { date: "02/04/2025", time: "15h00", status: "À venir" },
    ],
    field: "Chimie",
    class: "L3A",
  },
  // Filière : Littérature
  {
    id: 11,
    title: "Littérature Française",
    description: "Analyse des œuvres classiques françaises.",
    image: "/assets/literature.jpg", // Placeholder temporaire (image manquante)
    materials: ["https://example.com/lit1.pdf"],
    assignments: [
      { title: "Analyse de texte", dueDate: "30/03/2025", status: "À corriger" },
    ],
    schedule: [
      { date: "31/03/2025", time: "10h00", status: "En ligne" },
    ],
    field: "Littérature",
    class: "L1C",
  },
];

const ProfessorCoursesPage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('Tout');
  const [filterField, setFilterField] = useState<string>('Tout');
  const [filterClass, setFilterClass] = useState<string>('Tout');
  const [newAnnouncement, setNewAnnouncement] = useState<string>('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      author: 'Professeur Youssou NDIONE',
      date: '14 févr.',
      content: (
        <>
          <p>
            <strong>INFOs:</strong> La présentation des projets est prévue ce samedi 15 Février à partir de 19 heures sur le lien suivant{' '}
            <a href="https://meet.google.com/rwa-vtru-sut" className="text-blue-500 hover:underline">
              https://meet.google.com/rwa-vtru-sut
            </a>
          </p>
          <p className="mt-2">
            <strong>NB:</strong> Seuls les étudiants ayant transmis leur travail seront autorisés à présenter
          </p>
        </>
      ),
      isNew: false,
    },
  ]);
  const [activeTab, setActiveTab] = useState<string>('Vue d’ensemble');

  useEffect(() => {
    setTimeout(() => {
      setCourses(mockCourses);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En ligne":
        return "bg-orange-500";
      case "Présentiel":
        return "bg-blue-500";
      case "À venir":
        return "bg-purple-500";
      case "Annulé":
        return "bg-red-500";
      case "À corriger":
        return "bg-orange-500";
      case "Corrigé":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  const handleFilterFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterField(e.target.value);
  };

  const handleFilterClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterClass(e.target.value);
  };

  const handleAddAnnouncement = () => {
    if (newAnnouncement.trim()) {
      setAnnouncements([
        ...announcements,
        {
          id: announcements.length + 1,
          author: 'Professeur Youssou NDIONE',
          date: new Date().toLocaleDateString(),
          content: <p>{newAnnouncement}</p>,
          isNew: true,
        },
      ]);
      setNewAnnouncement('');
      toast.success(t('Annonce publiée avec succès'), {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const uniqueFields = Array.from(new Set(courses.map(course => course.field)));
  const uniqueClasses = Array.from(new Set(courses.map(course => course.class)));

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (filterStatus !== 'Tout') {
      const today = new Date('2025-03-27');
      const courseDateStr = course.schedule[0]?.date;
      let courseDate: Date | null = null;

      if (courseDateStr) {
        const [day, month, year] = courseDateStr.split('/').map(Number);
        courseDate = new Date(year, month - 1, day);
      }

      const status = course.schedule[0]?.status;

      switch (filterStatus) {
        case 'En cours':
          matchesStatus = status === 'En ligne' || status === 'Présentiel';
          break;
        case 'À venir':
          matchesStatus = courseDate && courseDate > today;
          break;
        case 'Passés':
          matchesStatus = courseDate && courseDate < today;
          break;
        case 'Annulés':
          matchesStatus = status === 'Annulé';
          break;
        default:
          matchesStatus = true;
      }
    }

    const matchesField = filterField === 'Tout' || course.field === filterField;
    const matchesClass = filterClass === 'Tout' || course.class === filterClass;

    return matchesSearch && matchesStatus && matchesField && matchesClass;
  });

  const handleMaterialClick = (material: string) => {
    toast.info(t('Téléchargement en cours'), {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold text-[#2CB3C2] flex justify-center items-center">
          <FaBook className="mr-3 text-[#2CB3C2]" /> {t('Mes Cours')} - Professeur
        </h1>
        <div className="mt-2 h-1 w-32 bg-[#2CB3C2] mx-auto rounded-full"></div>
      </motion.header>

      {selectedCourse ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-4xl mx-auto"
        >
          <div className="relative">
            <img
              src={selectedCourse.image}
              alt={selectedCourse.title}
              className="w-full h-64 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
            <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
              {selectedCourse.title} ({selectedCourse.field} - {selectedCourse.class})
            </h2>
          </div>

          <div className="flex border-b border-gray-200 mb-8 mt-6">
            {['Vue d’ensemble', 'Annonces', 'Devoirs', 'Supports de cours'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-3 font-semibold text-lg transition-all duration-300 ${
                  activeTab === tab
                    ? 'text-[#2CB3C2] border-b-4 border-[#2CB3C2]'
                    : 'text-gray-500 hover:text-[#2CB3C2] hover:bg-gray-100 rounded-t-lg'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Vue d’ensemble' && (
            <div>
              <p className="text-gray-700 leading-relaxed">{selectedCourse.description}</p>
              <div className="mt-4 text-gray-600">
                <p><strong>Filière :</strong> {selectedCourse.field}</p>
                <p><strong>Classe :</strong> {selectedCourse.class}</p>
              </div>
              <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaCalendarAlt className="mr-2 text-[#2CB3C2]" /> {t('Prochains Cours')}
                </h3>
                {selectedCourse.schedule.length > 0 ? (
                  <table className="w-full mt-4 border-collapse">
                    <thead>
                      <tr className="bg-[#2CB3C2] text-white">
                        <th className="p-3 text-left rounded-tl-lg">{t('Modules')}</th>
                        <th className="p-3 text-left">{t('Jour')}</th>
                        <th className="p-3 text-left">{t('Horaire')}</th>
                        <th className="p-3 text-left rounded-tr-lg">{t('Statut')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCourse.schedule.map((session, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="p-3">{selectedCourse.title}</td>
                          <td className="p-3">{session.date}</td>
                          <td className="p-3">{session.time || '---'}</td>
                          <td className="p-3">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
                                session.status
                              )}`}
                            >
                              {session.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-600 mt-2">{t('Aucun Cours')}</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Annonces' && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaBell className="mr-2 text-[#2CB3C2]" /> Annonces
              </h3>
              <div className="mb-6">
                <textarea
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  placeholder="Annoncez quelque chose à votre classe (devoir, examen, classe virtuelle...)"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2CB3C2] transition-all duration-300 shadow-sm hover:shadow-md"
                  rows={3}
                />
                <button
                  onClick={handleAddAnnouncement}
                  className="mt-3 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:from-[#1A8A97] hover:to-[#2CB3C2] transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  <FaPaperPlane /> Publier
                </button>
              </div>

              {announcements.length > 0 ? (
                announcements.map((announcement, index) => (
                  <div
                    key={announcement.id}
                    className="flex items-start mb-6 border-b pb-6 animate-slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-[#2CB3C2] to-[#1A8A97] rounded-full flex items-center justify-center text-xl font-bold text-white mr-4 shadow-md">
                      {announcement.author[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg text-gray-800">{announcement.author}</h3>
                        <div className="flex items-center gap-3">
                          {announcement.isNew && (
                            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full animate-pulse">
                              Nouveau
                            </span>
                          )}
                          <span className="text-gray-500 text-sm">{announcement.date}</span>
                        </div>
                      </div>
                      <div className="text-gray-700 mt-2">{announcement.content}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">Aucune annonce pour le moment.</p>
              )}
            </div>
          )}

          {activeTab === 'Devoirs' && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaTasks className="mr-2 text-[#2CB3C2]" /> {t('Devoirs')}
              </h3>
              {selectedCourse.assignments.length > 0 ? (
                <table className="w-full mt-4 border-collapse">
                  <thead>
                    <tr className="bg-[#2CB3C2] text-white">
                      <th className="p-3 text-left rounded-tl-lg">{t('Devoirs')}</th>
                      <th className="p-3 text-left">{t('Date limite')}</th>
                      <th className="p-3 text-left rounded-tr-lg">{t('Statut')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCourse.assignments.map((assignment, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="p-3">{assignment.title}</td>
                        <td className="p-3">{assignment.dueDate || '---'}</td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
                              assignment.status
                            )}`}
                          >
                            {assignment.status}
                          </span>
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

          {activeTab === 'Supports de cours' && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaFilePdf className="mr-2 text-[#2CB3C2]" /> {t('Supports De Cours')}
              </h3>
              {selectedCourse.materials.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {selectedCourse.materials.map((material, index) => (
                    <a
                      key={index}
                      href={material}
                      onClick={() => handleMaterialClick(material)}
                      className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                    >
                      <FaFilePdf className="mr-3 text-[#2CB3C2]" />
                      <span className="text-[#2CB3C2] hover:underline">
                        {t('Télécharger Support')} {index + 1}
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 mt-2">{t('Aucun Support')}</p>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            {selectedCourse.liveLink && (
              <a
                href={selectedCourse.liveLink}
                className="inline-flex items-center px-5 py-2 bg-[#2CB3C2] text-white rounded-lg hover:bg-[#218a91] transition-colors shadow-md"
                onClick={() =>
                  toast.success(t('Rejoindre Cours Message'), {
                    position: "top-right",
                    autoClose: 3000,
                  })
                }
              >
                <FaVideo className="mr-2" /> {t('Démarrer Cours')}
              </a>
            )}
            <button
              onClick={() => setSelectedCourse(null)}
              className="inline-flex items-center px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
            >
              {t('Retour')}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 max-w-5xl mx-auto flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('Rechercher un cours')}
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2CB3C2] transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={handleFilterStatusChange}
              className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2CB3C2] transition-all"
            >
              <option value="Tout">Statut : Tout</option>
              <option value="En cours">En cours</option>
              <option value="À venir">À venir</option>
              <option value="Passés">Passés</option>
              <option value="Annulés">Annulés</option>
            </select>
            <select
              value={filterField}
              onChange={handleFilterFieldChange}
              className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2CB3C2] transition-all"
            >
              <option value="Tout">Filière : Tout</option>
              {uniqueFields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
            <select
              value={filterClass}
              onChange={handleFilterClassChange}
              className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2CB3C2] transition-all"
            >
              <option value="Tout">Classe : Tout</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} height={300} className="rounded-xl" />
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <motion.div
                  key={course.id}
                  className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg"></div>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800 mt-4">{course.title}</h2>
                  <p className="text-gray-600 mt-2 line-clamp-2">{course.description}</p>
                  <div className="mt-2 text-gray-600">
                    <p><strong>Filière :</strong> {course.field}</p>
                    <p><strong>Classe :</strong> {course.class}</p>
                  </div>

                  <div className="mt-4 flex justify-between items-center text-sm">
                    <span className="flex items-center text-gray-500">
                      <FaTasks className="mr-1 text-[#2CB3C2]" />
                      {course.assignments.length} {t('Devoirs')}
                    </span>
                    <span className="flex items-center text-gray-500">
                      <FaCalendarAlt className="mr-1 text-[#2CB3C2]" />
                      {course.schedule.length} {t('Séances')}
                    </span>
                  </div>

                  <div className="absolute inset-0 border-2 border-[#2CB3C2] rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-lg">{t('Aucun cours trouvé')}</p>
          )}
        </motion.section>
      )}
      <ToastContainer />
    </div>
  );
};

export default ProfessorCoursesPage;