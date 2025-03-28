import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTasks, FaBook } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Données mock (à importer depuis votre fichier existant si elles sont dans un autre fichier)
interface Assignment {
  title: string;
  dueDate: string;
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
  schedule: { date: string; time: string; status: string }[];
}

const mockCourses: Course[] = [
  {
    id: 1,
    title: "Introduction à l'Algorithmique",
    description: "Apprenez les bases de la programmation avec des algorithmes simples.",
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
    materials: ["https://example.com/cyber1.pdf"],
    assignments: [],
    schedule: [
      { date: "30/03/2025", time: "11h30", status: "En ligne" },
    ],
  },
];

const AssignmentsPage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [assignments, setAssignments] = useState<{ course: string; assignment: Assignment }[]>([]);

  useEffect(() => {
    setTimeout(() => {
      // Récupérer tous les devoirs de tous les cours
      const allAssignments = mockCourses
        .filter(course => course.assignments.length > 0)
        .flatMap(course =>
          course.assignments.map(assignment => ({
            course: course.title,
            assignment,
          }))
        );
      setAssignments(allAssignments);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
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
          <FaTasks className="mr-3 text-[#2CB3C2]" /> {t('Devoirs Et Evaluations')}
        </h1>
        <div className="mt-2 h-1 w-32 bg-[#2CB3C2] mx-auto rounded-full"></div>
      </motion.header>

      {/* Liste des devoirs */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          <div className="max-w-4xl mx-auto">
            <Skeleton height={60} count={3} className="mb-4 rounded-lg" />
          </div>
        ) : assignments.length > 0 ? (
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#2CB3C2] text-white">
                  <th className="p-4 text-left rounded-tl-lg">{t('cours')}</th>
                  <th className="p-4 text-left">{t('devoir')}</th>
                  <th className="p-4 text-left">{t('dateLimite')}</th>
                  <th className="p-4 text-left rounded-tr-lg">{t('statut')}</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(({ course, assignment }, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">{course}</td>
                    <td className="p-4">{assignment.title}</td>
                    <td className="p-4">{assignment.dueDate || '---'}</td>
                    <td className="p-4">
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
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">{t('aucunDevoir')}</p>
        )}
      </motion.section>
    </div>
  );
};

export default AssignmentsPage;