"use client"

import type React from "react"
import { useState } from "react"
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
} from "react-icons/fa"

// Types pour les modules et classes
interface Module {
  id: string
  name: string
  description: string
  imageUrl: string
  classId: string
  professor: string
  filiereId: string
  createdBy: string
  createdAt: string
}

interface Class {
  id: string
  name: string
  description: string
  imageUrl: string
}

interface Filiere {
  id: string
  name: string
}

// Type pour le tri
type SortDirection = "asc" | "desc" | null
type ModuleSortableColumn = "name" | "description" | "professor" | "class" | "filiere" | "createdAt"
type ClassSortableColumn = "name" | "description" | "courseCount"

// Données d'exemple
const initialClasses: Class[] = [
  {
    id: "c1",
    name: "Informatique L1",
    description: "Première année de licence en informatique",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "c2",
    name: "Informatique L2",
    description: "Deuxième année de licence en informatique",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "c3",
    name: "Informatique L3",
    description: "Troisième année de licence en informatique",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
]

const initialFilieres: Filiere[] = [
  { id: "f1", name: "Génie Civil" },
  { id: "f2", name: "Génie Informatique" },
  { id: "f3", name: "Ressources Humaines" },
  { id: "f4", name: "Transport et Logistique" },
  { id: "f5", name: "Commerce International" },
  { id: "f6", name: "Marketing et Stratégie" },
  { id: "f7", name: "Hygiène Qualité Sécurité & Environnement" },
  { id: "f8", name: "Banque, Finances, Assurances" },
  { id: "f9", name: "Comptabilité & Gestion" },
  { id: "f10", name: "Communication" },
  { id: "f11", name: "Entreprise & Gestion des PME" },
  { id: "f12", name: "Management des Affaires" },
]

const initialModules: Module[] = [
  {
    id: "m1",
    name: "Algorithmique",
    description: "Fondamentaux de l'algorithmique",
    imageUrl: "/placeholder.svg?height=100&width=100",
    classId: "c1",
    professor: "Prof. Ndione",
    filiereId: "f2",
    createdBy: "Admin",
    createdAt: "2023-09-15",
  },
  {
    id: "m2",
    name: "Programmation C",
    description: "Introduction à la programmation en C",
    imageUrl: "/placeholder.svg?height=100&width=100",
    classId: "c1",
    professor: "Prof. Ndione",
    filiereId: "f2",
    createdBy: "Admin",
    createdAt: "2023-09-20",
  },
  {
    id: "m3",
    name: "Bases de données",
    description: "Conception et utilisation des bases de données",
    imageUrl: "/placeholder.svg?height=100&width=100",
    classId: "c2",
    professor: "Prof. Ndiaye",
    filiereId: "f2",
    createdBy: "Admin",
    createdAt: "2023-10-05",
  },
]

const ModulesClassesManagement: React.FC = () => {
  const [modules, setModules] = useState<Module[]>(initialModules)
  const [classes, setClasses] = useState<Class[]>(initialClasses)
  const [filieres, setFilieres] = useState<Filiere[]>(initialFilieres)
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState<boolean>(false)
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState<boolean>(false)
  const [currentModule, setCurrentModule] = useState<Module | null>(null)
  const [currentClass, setCurrentClass] = useState<Class | null>(null)
  const [activeTab, setActiveTab] = useState<"modules" | "classes">("modules")

  // États pour le tri
  const [moduleSortColumn, setModuleSortColumn] = useState<ModuleSortableColumn | null>(null)
  const [moduleSortDirection, setModuleSortDirection] = useState<SortDirection>(null)
  const [classSortColumn, setClassSortColumn] = useState<ClassSortableColumn | null>(null)
  const [classSortDirection, setClassSortDirection] = useState<SortDirection>(null)

  // États pour la pagination
  const [moduleCurrentPage, setModuleCurrentPage] = useState(1)
  const [classCurrentPage, setClassCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filtrer les modules en fonction de la classe sélectionnée et du terme de recherche
  const filteredModules = modules.filter(
    (module) =>
      (selectedClass === "all" || module.classId === selectedClass) &&
      module.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filtrer les classes en fonction du terme de recherche
  const filteredClasses = classes.filter((cls) => cls.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Trier les modules
  const sortedModules = [...filteredModules].sort((a, b) => {
    if (!moduleSortColumn || !moduleSortDirection) return 0

    let valueA, valueB

    if (moduleSortColumn === "class") {
      valueA = classes.find((c) => c.id === a.classId)?.name || ""
      valueB = classes.find((c) => c.id === b.classId)?.name || ""
    } else if (moduleSortColumn === "filiere") {
      valueA = filieres.find((f) => f.id === a.filiereId)?.name || ""
      valueB = filieres.find((f) => f.id === b.filiereId)?.name || ""
    } else {
      valueA = a[moduleSortColumn]
      valueB = b[moduleSortColumn]
    }

    if (valueA < valueB) return moduleSortDirection === "asc" ? -1 : 1
    if (valueA > valueB) return moduleSortDirection === "asc" ? 1 : -1
    return 0
  })

  // Trier les classes
  const sortedClasses = [...filteredClasses].sort((a, b) => {
    if (!classSortColumn || !classSortDirection) return 0

    let valueA, valueB

    if (classSortColumn === "courseCount") {
      valueA = modules.filter((m) => m.classId === a.id).length
      valueB = modules.filter((m) => m.classId === b.id).length
    } else {
      valueA = a[classSortColumn]
      valueB = b[classSortColumn]
    }

    if (valueA < valueB) return classSortDirection === "asc" ? -1 : 1
    if (valueA > valueB) return classSortDirection === "asc" ? 1 : -1
    return 0
  })

  // Pagination pour les modules
  const moduleIndexOfLastItem = moduleCurrentPage * itemsPerPage
  const moduleIndexOfFirstItem = moduleIndexOfLastItem - itemsPerPage
  const currentModules = sortedModules.slice(moduleIndexOfFirstItem, moduleIndexOfLastItem)
  const moduleTotalPages = Math.ceil(sortedModules.length / itemsPerPage)

  // Pagination pour les classes
  const classIndexOfLastItem = classCurrentPage * itemsPerPage
  const classIndexOfFirstItem = classIndexOfLastItem - itemsPerPage
  const currentClasses = sortedClasses.slice(classIndexOfFirstItem, classIndexOfLastItem)
  const classTotalPages = Math.ceil(sortedClasses.length / itemsPerPage)

  // Fonction pour gérer le tri des modules
  const handleModuleSort = (column: ModuleSortableColumn) => {
    if (moduleSortColumn === column) {
      if (moduleSortDirection === "asc") {
        setModuleSortDirection("desc")
      } else if (moduleSortDirection === "desc") {
        setModuleSortDirection(null)
        setModuleSortColumn(null)
      } else {
        setModuleSortDirection("asc")
      }
    } else {
      setModuleSortColumn(column)
      setModuleSortDirection("asc")
    }
  }

  // Fonction pour gérer le tri des classes
  const handleClassSort = (column: ClassSortableColumn) => {
    if (classSortColumn === column) {
      if (classSortDirection === "asc") {
        setClassSortDirection("desc")
      } else if (classSortDirection === "desc") {
        setClassSortDirection(null)
        setClassSortColumn(null)
      } else {
        setClassSortDirection("asc")
      }
    } else {
      setClassSortColumn(column)
      setClassSortDirection("asc")
    }
  }

  // Fonction pour obtenir l'icône de tri
  const getSortIcon = (column: string, currentColumn: string | null, direction: SortDirection) => {
    if (currentColumn !== column) return <FaSort className="ml-1 text-gray-400" />
    if (direction === "asc") return <FaSortUp className="ml-1 text-gray-700" />
    if (direction === "desc") return <FaSortDown className="ml-1 text-gray-700" />
    return <FaSort className="ml-1 text-gray-400" />
  }

  // Gestionnaires pour les modules
  const handleAddModule = (newModule: Omit<Module, "id">) => {
    const id = `m${modules.length + 1}`
    setModules([...modules, { ...newModule, id }])
    setIsAddModuleModalOpen(false)
    setCurrentModule(null)
  }

  const handleEditModule = (module: Module) => {
    setCurrentModule(module)
    setIsAddModuleModalOpen(true)
  }

  const handleUpdateModule = (updatedModule: Module) => {
    setModules(modules.map((m) => (m.id === updatedModule.id ? updatedModule : m)))
    setIsAddModuleModalOpen(false)
    setCurrentModule(null)
  }

  const handleDeleteModule = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      setModules(modules.filter((m) => m.id !== id))
    }
  }

  // Gestionnaires pour les classes
  const handleAddClass = (newClass: Omit<Class, "id">) => {
    const id = `c${classes.length + 1}`
    setClasses([...classes, { ...newClass, id }])
    setIsAddClassModalOpen(false)
    setCurrentClass(null)
  }

  const handleEditClass = (cls: Class) => {
    setCurrentClass(cls)
    setIsAddClassModalOpen(true)
  }

  const handleUpdateClass = (updatedClass: Class) => {
    setClasses(classes.map((c) => (c.id === updatedClass.id ? updatedClass : c)))
    setIsAddClassModalOpen(false)
    setCurrentClass(null)
  }

  const handleDeleteClass = (id: string) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette classe ? Tous les modules associés seront également supprimés.",
      )
    ) {
      setModules(modules.filter((m) => m.classId !== id))
      setClasses(classes.filter((c) => c.id !== id))
    }
  }

  // Composant pour le modal d'ajout/modification de module
  const ModuleFormModal = () => {
    const [formData, setFormData] = useState<Omit<Module, "id" | "createdBy" | "createdAt">>({
      name: currentModule?.name || "",
      description: currentModule?.description || "",
      imageUrl: currentModule?.imageUrl || "/placeholder.svg?height=100&width=100",
      classId: currentModule?.classId || (selectedClass !== "all" ? selectedClass : classes[0]?.id || ""),
      professor: currentModule?.professor || "",
      filiereId: currentModule?.filiereId || filieres[0]?.id || "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (currentModule) {
        handleUpdateModule({
          ...formData,
          id: currentModule.id,
          createdBy: currentModule.createdBy,
          createdAt: currentModule.createdAt,
        })
      } else {
        const now = new Date().toISOString().split("T")[0]
        handleAddModule({
          ...formData,
          createdBy: "Admin",
          createdAt: now,
        })
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">{currentModule ? "Modifier le cours" : "Créer un cours"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du cours</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Professeur</label>
              <input
                type="text"
                name="professor"
                value={formData.professor}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
              <select
                name="filiereId"
                value={formData.filiereId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                {filieres.map((filiere) => (
                  <option key={filiere.id} value={filiere.id}>
                    {filiere.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
              <select
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddModuleModalOpen(false)
                  setCurrentModule(null)
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
              <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
                {currentModule ? "Mettre à jour" : "Créer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Composant pour le modal d'ajout/modification de classe
  const ClassFormModal = () => {
    const [formData, setFormData] = useState<Omit<Class, "id">>({
      name: currentClass?.name || "",
      description: currentClass?.description || "",
      imageUrl: currentClass?.imageUrl || "/placeholder.svg?height=100&width=100",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (currentClass) {
        handleUpdateClass({ ...formData, id: currentClass.id })
      } else {
        handleAddClass(formData)
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">
            {currentClass ? "Modifier la classe" : "Ajouter une nouvelle classe"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddClassModalOpen(false)
                  setCurrentClass(null)
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
              <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
                {currentClass ? "Mettre à jour" : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {activeTab === "modules" ? "Gestion des Cours" : "Gestion des Classes"}
      </h2>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("modules")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "modules" ? "bg-cyan-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Cours
          </button>
          <button
            onClick={() => setActiveTab("classes")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "classes" ? "bg-cyan-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Classes
          </button>
        </div>

        <div className="relative w-64">
          <input
            type="text"
            placeholder={`Rechercher un ${activeTab === "modules" ? "cours" : "classe"}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {activeTab === "modules" ? (
          <>
            <div className="flex justify-between items-center p-4 border-b">
              <button
                onClick={() => setIsAddModuleModalOpen(true)}
                className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
              >
                <FaPlus size={14} /> Créer un cours
              </button>

              {classes.length > 0 && (
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Toutes les classes</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleModuleSort("name")}
                    >
                      <div className="flex items-center">
                        Nom {getSortIcon("name", moduleSortColumn, moduleSortDirection)}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleModuleSort("description")}
                    >
                      <div className="flex items-center">
                        Description {getSortIcon("description", moduleSortColumn, moduleSortDirection)}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleModuleSort("professor")}
                    >
                      <div className="flex items-center">
                        Professeur {getSortIcon("professor", moduleSortColumn, moduleSortDirection)}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleModuleSort("class")}
                    >
                      <div className="flex items-center">
                        Classe {getSortIcon("class", moduleSortColumn, moduleSortDirection)}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleModuleSort("filiere")}
                    >
                      <div className="flex items-center">
                        Filière {getSortIcon("filiere", moduleSortColumn, moduleSortDirection)}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleModuleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        Date de création {getSortIcon("createdAt", moduleSortColumn, moduleSortDirection)}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentModules.length > 0 ? (
                    currentModules.map((module, index) => (
                      <tr key={module.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{module.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 line-clamp-2">{module.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{module.professor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {classes.find((c) => c.id === module.classId)?.name || "Non assigné"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {filieres.find((f) => f.id === module.filiereId)?.name || "Non assigné"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(module.createdAt).toLocaleDateString()} par {module.createdBy}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEditModule(module)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Éditer"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteModule(module.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        Aucun cours trouvé. Veuillez ajuster vos filtres ou créer un nouveau cours.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination pour les modules */}
            {sortedModules.length > 0 && (
              <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Affichage de {moduleIndexOfFirstItem + 1} à {Math.min(moduleIndexOfLastItem, sortedModules.length)}{" "}
                  sur {sortedModules.length} résultats
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => setModuleCurrentPage(moduleCurrentPage > 1 ? moduleCurrentPage - 1 : 1)}
                    disabled={moduleCurrentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      moduleCurrentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FaChevronLeft size={14} />
                  </button>
                  {Array.from({ length: moduleTotalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => setModuleCurrentPage(number)}
                      className={`px-3 py-1 mx-1 rounded-md ${
                        moduleCurrentPage === number ? "bg-cyan-600 text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setModuleCurrentPage(
                        moduleCurrentPage < moduleTotalPages ? moduleCurrentPage + 1 : moduleTotalPages,
                      )
                    }
                    disabled={moduleCurrentPage === moduleTotalPages}
                    className={`px-3 py-1 rounded-md ${
                      moduleCurrentPage === moduleTotalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FaChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between items-center p-4 border-b">
              <button
                onClick={() => setIsAddClassModalOpen(true)}
                className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
              >
                <FaPlus size={14} /> Ajouter une classe
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleClassSort("name")}
                    >
                      <div className="flex items-center">
                        Nom {getSortIcon("name", classSortColumn, classSortDirection)}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleClassSort("description")}
                    >
                      <div className="flex items-center">
                        Description {getSortIcon("description", classSortColumn, classSortDirection)}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleClassSort("courseCount")}
                    >
                      <div className="flex items-center">
                        Nombre de cours {getSortIcon("courseCount", classSortColumn, classSortDirection)}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentClasses.length > 0 ? (
                    currentClasses.map((cls, index) => (
                      <tr key={cls.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{cls.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 line-clamp-2">{cls.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {modules.filter((m) => m.classId === cls.id).length}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEditClass(cls)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Éditer"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteClass(cls.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        Aucune classe trouvée. Veuillez ajuster vos filtres ou ajouter une nouvelle classe.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination pour les classes */}
            {sortedClasses.length > 0 && (
              <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Affichage de {classIndexOfFirstItem + 1} à {Math.min(classIndexOfLastItem, sortedClasses.length)} sur{" "}
                  {sortedClasses.length} résultats
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => setClassCurrentPage(classCurrentPage > 1 ? classCurrentPage - 1 : 1)}
                    disabled={classCurrentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      classCurrentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FaChevronLeft size={14} />
                  </button>
                  {Array.from({ length: classTotalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => setClassCurrentPage(number)}
                      className={`px-3 py-1 mx-1 rounded-md ${
                        classCurrentPage === number ? "bg-cyan-600 text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setClassCurrentPage(classCurrentPage < classTotalPages ? classCurrentPage + 1 : classTotalPages)
                    }
                    disabled={classCurrentPage === classTotalPages}
                    className={`px-3 py-1 rounded-md ${
                      classCurrentPage === classTotalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FaChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isAddModuleModalOpen && <ModuleFormModal />}
      {isAddClassModalOpen && <ClassFormModal />}
    </div>
  )
}

export default ModulesClassesManagement

