"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  FaPlus,
  FaTrash,
  FaDownload,
  FaSearch,
  FaFile,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFileArchive,
  FaFileAlt,
} from "react-icons/fa"

// Types pour les ressources
interface Resource {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  uploadedBy: string
  moduleId: string
  url: string
}

interface Module {
  id: string
  name: string
}

// Données d'exemple
const initialModules: Module[] = [
  { id: "m1", name: "Algorithmique" },
  { id: "m2", name: "Programmation C" },
  { id: "m3", name: "Bases de données" },
]

const initialResources: Resource[] = [
  {
    id: "r1",
    name: "Cours Algorithmique.pdf",
    type: "pdf",
    size: "2.5 MB",
    uploadDate: "2025-03-15",
    uploadedBy: "Prof. Ndione",
    moduleId: "m1",
    url: "#",
  },
  {
    id: "r2",
    name: "TD1 Algorithmique.docx",
    type: "docx",
    size: "1.2 MB",
    uploadDate: "2025-03-16",
    uploadedBy: "Prof. Ndione",
    moduleId: "m1",
    url: "#",
  },
  {
    id: "r3",
    name: "Introduction au C.pdf",
    type: "pdf",
    size: "3.7 MB",
    uploadDate: "2025-03-10",
    uploadedBy: "Prof. Ndiaye",
    moduleId: "m2",
    url: "#",
  },
  {
    id: "r4",
    name: "Modèle Relationnel.pptx",
    type: "pptx",
    size: "5.1 MB",
    uploadDate: "2025-03-05",
    uploadedBy: "Prof. Dieng",
    moduleId: "m3",
    url: "#",
  },
]

// Clés pour le localStorage
const STORAGE_KEYS = {
  RESOURCES: "resources_data",
  SELECTED_MODULE: "selected_module",
  SEARCH_TERM: "search_term",
}

const RessourcesGestion: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [modules] = useState<Module[]>(initialModules)
  const [selectedModule, setSelectedModule] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState<boolean>(false)

  // Charger les données depuis localStorage au chargement du composant
  useEffect(() => {
    const savedResources = localStorage.getItem(STORAGE_KEYS.RESOURCES)
    const savedSelectedModule = localStorage.getItem(STORAGE_KEYS.SELECTED_MODULE)
    const savedSearchTerm = localStorage.getItem(STORAGE_KEYS.SEARCH_TERM)

    if (savedResources) {
      setResources(JSON.parse(savedResources))
    }
    if (savedSelectedModule) {
      setSelectedModule(savedSelectedModule)
    }
    if (savedSearchTerm) {
      setSearchTerm(savedSearchTerm)
    }
  }, [])

  // Sauvegarder les données dans localStorage quand elles changent
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources))
  }, [resources])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_MODULE, selectedModule)
  }, [selectedModule])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SEARCH_TERM, searchTerm)
  }, [searchTerm])

  // Filtrer les ressources en fonction du module sélectionné et du terme de recherche
  const filteredResources = resources.filter(
    (resource) =>
      (selectedModule === "all" || resource.moduleId === selectedModule) &&
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Fonction pour obtenir l'icône en fonction du type de fichier
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FaFilePdf className="text-red-500" />
      case "docx":
      case "doc":
        return <FaFileWord className="text-blue-500" />
      case "xlsx":
      case "xls":
        return <FaFileExcel className="text-green-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FaFileImage className="text-purple-500" />
      case "mp4":
      case "avi":
      case "mov":
        return <FaFileVideo className="text-pink-500" />
      case "mp3":
      case "wav":
        return <FaFileAudio className="text-yellow-500" />
      case "zip":
      case "rar":
        return <FaFileArchive className="text-orange-500" />
      case "pptx":
      case "ppt":
        return <FaFileAlt className="text-orange-500" />
      default:
        return <FaFile className="text-gray-500" />
    }
  }

  // Gestionnaire pour ajouter une ressource
  const handleAddResource = (newResource: Omit<Resource, "id">) => {
    const id = `r${resources.length + 1}`
    setResources([...resources, { ...newResource, id }])
    setIsAddResourceModalOpen(false)
  }

  // Gestionnaire pour supprimer une ressource
  const handleDeleteResource = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette ressource ?")) {
      setResources(resources.filter((r) => r.id !== id))
    }
  }

  // Fonction pour télécharger un fichier
  const handleDownload = (resource: Resource) => {
    // Pour les fichiers locaux, créer un lien de téléchargement
    const link = document.createElement("a")
    link.href = resource.url
    link.download = resource.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Remplacer le return du composant principal par cette version plus responsive
  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gestion des Ressources</h1>
      </div>

      <div className="flex flex-col gap-3 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Rechercher une ressource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-md"
          >
            <option value="all">Tous les modules</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setIsAddResourceModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 w-full sm:w-auto"
        >
          <FaPlus /> Ajouter une ressource
        </button>
      </div>

      {/* Version mobile: Cartes pour les petits écrans */}
      <div className="block md:hidden">
        {filteredResources.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
            Aucune ressource trouvée. Veuillez ajuster vos filtres ou ajouter une nouvelle ressource.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                    {getFileIcon(resource.type)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{resource.name}</div>
                    <div className="text-sm text-gray-500">
                      {resource.type.toUpperCase()} • {resource.size}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-3">
                  <div>
                    <span className="font-medium">Date:</span> {resource.uploadDate}
                  </div>
                  <div>
                    <span className="font-medium">Par:</span> {resource.uploadedBy}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Module:</span>{" "}
                    {modules.find((m) => m.id === resource.moduleId)?.name || "Non assigné"}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => handleDownload(resource)}
                    className="flex items-center gap-1 text-cyan-600 hover:text-cyan-900"
                  >
                    <FaDownload /> <span className="text-sm">Télécharger</span>
                  </button>
                  <button
                    onClick={() => handleDeleteResource(resource.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-900"
                  >
                    <FaTrash /> <span className="text-sm">Supprimer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Version desktop: Tableau pour les écrans moyens et grands */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nom
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Taille
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date d'ajout
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ajouté par
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Module
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
              {filteredResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                        {getFileIcon(resource.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{resource.type.toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{resource.size}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{resource.uploadDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{resource.uploadedBy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {modules.find((m) => m.id === resource.moduleId)?.name || "Non assigné"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleDownload(resource)} className="text-cyan-600 hover:text-cyan-900">
                        <FaDownload />
                      </button>
                      <button
                        onClick={() => handleDeleteResource(resource.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredResources.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Aucune ressource trouvée. Veuillez ajuster vos filtres ou ajouter une nouvelle ressource.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddResourceModalOpen && (
        <AddResourceModal
          selectedModule={selectedModule}
          modules={modules}
          handleAddResource={handleAddResource}
          setIsAddResourceModalOpen={setIsAddResourceModalOpen}
        />
      )}
    </div>
  )

  // Remplacer le composant AddResourceModal par cette version plus responsive
}

const AddResourceModal = ({
  selectedModule,
  modules,
  handleAddResource,
  setIsAddResourceModalOpen,
}: {
  selectedModule: string
  modules: Module[]
  handleAddResource: (newResource: Omit<Resource, "id">) => void
  setIsAddResourceModalOpen: (open: boolean) => void
}) => {
  const [formData, setFormData] = useState<Omit<Resource, "id">>({
    name: "",
    type: "pdf",
    size: "0 KB",
    uploadDate: new Date().toISOString().split("T")[0],
    uploadedBy: "Admin",
    moduleId: selectedModule !== "all" ? selectedModule : modules[0]?.id || "",
    url: "#",
  })
  const [file, setFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop() || ""
      const fileSize = `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
      setFile(selectedFile)

      setFormData({
        ...formData,
        name: selectedFile.name,
        type: fileExtension,
        size: fileSize,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (file) {
      // Créer une URL pour le fichier local
      const fileURL = URL.createObjectURL(file)

      handleAddResource({
        ...formData,
        url: fileURL,
      })
    } else {
      handleAddResource(formData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b">
          <h2 className="text-lg sm:text-xl font-semibold">Ajouter une nouvelle ressource</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fichier</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du fichier</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
            <select
              name="moduleId"
              value={formData.moduleId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              required
            >
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setIsAddResourceModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 w-full sm:w-auto order-2 sm:order-1"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 w-full sm:w-auto order-1 sm:order-2"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RessourcesGestion

