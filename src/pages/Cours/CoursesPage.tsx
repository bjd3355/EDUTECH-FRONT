import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaFilePdf, FaVideo, FaTasks, FaCalendarAlt, FaSearch } from 'react-icons/fa';
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
}

const mockCourses: Course[] = [
  {
    id: 1,
    title: "Introduction à l'Algorithmique",
    description: "Apprenez les bases de la programmation avec des algorithmes simples.",
    image: course1Image,
    materials: ["https://example.com/pdf1.pdf", "https://example.com/pdf2.pdf"],
    liveLink: "https://zoom.us/j/123456789",
    assignments: [
      { title: "Devoir cours 1", dueDate: "20/01/2025", status: "À rendre" },
    ],
    schedule: [
      { date: "01/04/2025", time: "17h30", status: "En ligne" },
    ],
  },
  {
    id: 2,
    title: "Mathématiques Avancées",
    description: "Cours sur les équations différentielles et l'algèbre linéaire.",
    image: course2Image,
    materials: ["https://example.com/math1.pdf"],
    assignments: [
      { title: "Devoir cours 2", dueDate: "", status: "Note" },
    ],
    schedule: [
      { date: "01/04/2025", time: "09h00", status: "En direct" },
    ],
  },
  {
    id: 3,
    title: "Développement Web",
    description: "Création de sites web avec HTML, CSS et JavaScript.",
    image: course3Image,
    materials: ["https://example.com/web1.pdf", "https://example.com/web2.pdf"],
    liveLink: "https://zoom.us/j/987654321",
    assignments: [
      { title: "Projet cours 3", dueDate: "26/03/2025", status: "Rendu" },
    ],
    schedule: [
      { date: "02/04/2025", time: "", status: "À venir" },
    ],
  },
  {
    id: 4,
    title: "Bases de Données",
    description: "Introduction aux bases de données relationnelles.",
    image: course4Image,
    materials: ["https://example.com/db1.pdf"],
    assignments: [
      { title: "QCM cours 4", dueDate: "27/04/2025", status: "À rendre" },
    ],
    schedule: [
      { date: "02/04/2025", time: "", status: "À venir" },
    ],
  },
  {
    id: 5,
    title: "Programmation Orientée Objet",
    description: "Concepts avancés de programmation orientée objet.",
    image: course5Image,
    materials: ["https://example.com/oop1.pdf"],
    assignments: [],
    schedule: [
      { date: "27/03/2025", time: "09h00", status: "Annuler" },
    ],
  },
  {
    id: 6,
    title: "Intelligence Artificielle",
    description: "Introduction à l'intelligence artificielle.",
    image: course6Image,
    materials: ["https://example.com/ai1.pdf"],
    assignments: [],
    schedule: [
      { date: "29/03/2025", time: "09h00", status: "En direct" },
    ],
  },
  {
    id: 7,
    title: "Cybersécurité",
    description: "Fondements de la cybersécurité.",
    image: course7Image,
    materials: ["https://example.com/cyber1.pdf"],
    assignments: [],
    schedule: [
      { date: "30/03/2025", time: "11h30", status: "En ligne" },
    ],
  },
];

const CoursesPage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<string>('Tout'); // État pour le filtre

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
      case "En direct":
        return "bg-blue-500";
      case "À venir":
        return "bg-purple-500";
      case "Annuler":
        return "bg-red-500";
      case "À rendre":
        return "bg-orange-500";
      case "Rendu":
        return "bg-purple-500";
      case "Note":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  // Filtrage des cours en fonction de la recherche et du filtre
  const filteredCourses = courses.filter(course => {
    // Filtrage par recherche
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtrage par statut
    if (filter === 'Tout') return matchesSearch;

    const today = new Date('2025-03-27'); // Date actuelle (27 mars 2025)
    const courseDateStr = course.schedule[0]?.date; // Date du cours
    let courseDate: Date | null = null;

    if (courseDateStr) {
      const [day, month, year] = courseDateStr.split('/').map(Number);
      courseDate = new Date(year, month - 1, day);
    }

    const status = course.schedule[0]?.status;

    switch (filter) {
      case 'En cours':
        return matchesSearch && (status === 'En ligne' || status === 'En direct');
      case 'À venir':
        return matchesSearch && courseDate && courseDate > today;
      case 'Passés':
        return matchesSearch && courseDate && courseDate < today;
      case 'Favoris':
        return matchesSearch; // À implémenter si vous avez une propriété "favori"
      case 'Retirés de l’affichage':
        return matchesSearch && status === 'Annuler';
      default:
        return matchesSearch;
    }
  });

  const handleMaterialClick = (material: string) => {
    toast.info(t('telechargementEnCours'), {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
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
          <FaBook className="mr-3 text-[#2CB3C2]" /> {t('Mes Cours')} - Filière Génie Informatique
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
          {/* Course Image with Overlay */}
          <div className="relative">
            <img
              src={selectedCourse.image}
              alt={selectedCourse.title}
              className="w-full h-64 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
            <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
              {selectedCourse.title}
            </h2>
          </div>

          {/* Course Description */}
          <p className="text-gray-700 mt-6 leading-relaxed">{selectedCourse.description}</p>

          {/* Materials Section */}
          <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
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
                      {t('telechargerSupport')} {index + 1}
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mt-2">{t('Aucun Support')}</p>
            )}
          </div>

          {/* Assignments Section */}
          <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaTasks className="mr-2 text-[#2CB3C2]" /> {t('Devoirs')}
            </h3>
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

          {/* Schedule Section */}
          <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaCalendarAlt className="mr-2 text-[#2CB3C2]" /> {t('Prochains Cours')}
            </h3>
            {selectedCourse.schedule.length > 0 ? (
              <table className="w-full mt-4 border-collapse">
                <thead>
                  <tr className="bg-[#2CB3C2] text-white">
                    <th className="p-3 text-left rounded-tl-lg">{t('Modules')}</th>
                    <th className="p-3 text-left">{t('jour')}</th>
                    <th className="p-3 text-left">{t('horaire')}</th>
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

          {/* Action Buttons */}
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
                <FaVideo className="mr-2" /> {t('RejoindreCoursDirect')}
              </a>
            )}
            <button
              onClick={() => setSelectedCourse(null)}
              className="inline-flex items-center px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
            >
              {t('retour')}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Search Bar and Filter */}
          <div className="mb-8 max-w-3xl mx-auto flex items-center space-x-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('rechercherCours')}
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2CB3C2] transition-all"
              />
            </div>
            <select
              value={filter}
              onChange={handleFilterChange}
              className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2CB3C2] transition-all"
            >
              <option value="Tout">Tout</option>
              <option value="En cours">En cours</option>
              <option value="À venir">À venir</option>
              <option value="Passés">Passés</option>
              <option value="Favoris">Favoris</option>
              <option value="Retirés de l’affichage">Retirés de l’affichage</option>
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
                  {/* Course Image with Overlay */}
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg"></div>
                  </div>

                  {/* Course Info */}
                  <h2 className="text-xl font-semibold text-gray-800 mt-4">{course.title}</h2>
                  <p className="text-gray-600 mt-2 line-clamp-2">{course.description}</p>

                  {/* Stats */}
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <span className="flex items-center text-gray-500">
                      <FaTasks className="mr-1 text-[#2CB3C2]" />
                      {course.assignments.length} {t('devoirs')}
                    </span>
                    <span className="flex items-center text-gray-500">
                      <FaCalendarAlt className="mr-1 text-[#2CB3C2]" />
                      {course.schedule.length} {t('seances')}
                    </span>
                  </div>

                  {/* Hover Effect */}
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