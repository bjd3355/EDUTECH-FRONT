"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Calendar, ChevronLeft, ChevronRight, Clock, Edit, MapPin, Plus, Search, Trash2, Users, X } from "lucide-react"

// Types pour les données des événements
interface Participant {
  id: number
  nom: string
  role: "Professeur" | "Étudiant" | "Administrateur" | "Invité"
}

interface Event {
  id: number
  titre: string
  description: string
  dateDebut: string
  dateFin: string
  type: "Cours" | "Atelier" | "Examen" | "Réunion" | "Autre"
  filieres: string[]
  statut: "Planifié" | "En cours" | "Terminé" | "Annulé"
  participants: Participant[]
  lieu: string
  estRecurrent: boolean
  couleur: string
  creePar: string
  dateCreation: string
}

// Données fictives avec noms sénégalais
const participants: Participant[] = [
  { id: 1, nom: "Prof. Diop", role: "Professeur" },
  { id: 2, nom: "Prof. Ndiaye", role: "Professeur" },
  { id: 3, nom: "Étudiants GI", role: "Étudiant" },
  { id: 4, nom: "Étudiants CG", role: "Étudiant" },
  { id: 5, nom: "Dr. Fall", role: "Administrateur" },
]

const filieres = [
  "Génie Informatique",
  "Comptabilité & Gestion",
  "Marketing Digital",
  "Commerce International",
  "Ressources Humaines",
  "Génie Civil",
  "Toutes les filières",
]

const initialEvents: Event[] = [
  {
    id: 1,
    titre: "Cours d'Algorithmique",
    description: "Introduction aux algorithmes de tri et structures de données",
    dateDebut: "2025-03-27T10:00:00",
    dateFin: "2025-03-27T12:00:00",
    type: "Cours",
    filieres: ["Génie Informatique"],
    statut: "En cours",
    participants: [participants[0], participants[2]],
    lieu: "Classe virtuelle",
    estRecurrent: true,
    couleur: "#2CB3C2",
    creePar: "M. Sow",
    dateCreation: "2025-03-20T08:30:00",
  },
  {
    id: 2,
    titre: "Examen de Gestion",
    description: "Examen final du module de gestion financière",
    dateDebut: "2025-03-28T14:00:00",
    dateFin: "2025-03-28T16:00:00",
    type: "Examen",
    filieres: ["Comptabilité & Gestion"],
    statut: "Planifié",
    participants: [participants[1], participants[3]],
    lieu: "Salle 101",
    estRecurrent: false,
    couleur: "#2CB3C2",
    creePar: "Mme. Ba",
    dateCreation: "2025-03-15T10:15:00",
  },
  {
    id: 3,
    titre: "Atelier Design Thinking",
    description: "Atelier pratique sur les méthodes de design thinking",
    dateDebut: "2025-03-29T09:00:00",
    dateFin: "2025-03-29T17:00:00",
    type: "Atelier",
    filieres: ["Marketing Digital", "Génie Informatique"],
    statut: "Planifié",
    participants: [participants[0], participants[2], participants[3]],
    lieu: "Laboratoire d'innovation",
    estRecurrent: false,
    couleur: "#2CB3C2",
    creePar: "M. Gueye",
    dateCreation: "2025-03-18T14:20:00",
  },
  {
    id: 4,
    titre: "Réunion Conseil Pédagogique",
    description: "Réunion trimestrielle du conseil pédagogique",
    dateDebut: "2025-03-30T11:00:00",
    dateFin: "2025-03-30T12:30:00",
    type: "Réunion",
    filieres: ["Toutes les filières"],
    statut: "Planifié",
    participants: [participants[0], participants[1], participants[4]],
    lieu: "Salle de conférence",
    estRecurrent: true,
    couleur: "#2CB3C2",
    creePar: "Mme. Diallo",
    dateCreation: "2025-03-10T09:45:00",
  },
]

// Composant principal
const GestionEvenements: React.FC = () => {
  // États
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(initialEvents)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    titre: "",
    description: "",
    dateDebut: "",
    dateFin: "",
    type: "Cours",
    filieres: [],
    statut: "Planifié",
    participants: [],
    lieu: "",
    estRecurrent: false,
    couleur: "#2CB3C2",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("Tous")
  const [filterFiliere, setFilterFiliere] = useState<string>("Toutes")
  const [filterStatut, setFilterStatut] = useState<string>("Tous")
  const [viewMode, setViewMode] = useState<"liste" | "calendrier">("liste")

  // Effet pour filtrer les événements
  useEffect(() => {
    let result = [...events]

    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(
        (event) =>
          event.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.lieu.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtre par type
    if (filterType !== "Tous") {
      result = result.filter((event) => event.type === filterType)
    }

    // Filtre par filière
    if (filterFiliere !== "Toutes") {
      result = result.filter(
        (event) => event.filieres.includes(filterFiliere) || event.filieres.includes("Toutes les filières"),
      )
    }

    // Filtre par statut
    if (filterStatut !== "Tous") {
      result = result.filter((event) => event.statut === filterStatut)
    }

    setFilteredEvents(result)
  }, [events, searchTerm, filterType, filterFiliere, filterStatut])

  // Statistiques
  const stats = useMemo(() => {
    return {
      total: events.length,
      planifies: events.filter((e) => e.statut === "Planifié").length,
      enCours: events.filter((e) => e.statut === "En cours").length,
      termines: events.filter((e) => e.statut === "Terminé").length,
      annules: events.filter((e) => e.statut === "Annulé").length,
      parType: {
        cours: events.filter((e) => e.type === "Cours").length,
        ateliers: events.filter((e) => e.type === "Atelier").length,
        examens: events.filter((e) => e.type === "Examen").length,
        reunions: events.filter((e) => e.type === "Réunion").length,
        autres: events.filter((e) => e.type === "Autre").length,
      },
      parFiliere: filieres.reduce(
        (acc, filiere) => {
          acc[filiere] = events.filter(
            (e) => e.filieres.includes(filiere) || e.filieres.includes("Toutes les filières"),
          ).length
          return acc
        },
        {} as Record<string, number>,
      ),
    }
  }, [events])

  // Prochains événements (triés par date)
  const prochainEvents = useMemo(() => {
    const now = new Date()
    return [...events]
      .filter((e) => new Date(e.dateDebut) > now)
      .sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime())
      .slice(0, 5)
  }, [events])

  // Gestion de la création d'un nouvel événement
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation des champs obligatoires
    if (!newEvent.titre || !newEvent.dateDebut || !newEvent.dateFin || !newEvent.type) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    const eventToAdd: Event = {
      id: Math.max(0, ...events.map((e) => e.id)) + 1,
      titre: newEvent.titre || "",
      description: newEvent.description || "",
      dateDebut: newEvent.dateDebut || new Date().toISOString(),
      dateFin: newEvent.dateFin || new Date().toISOString(),
      type: (newEvent.type as Event["type"]) || "Cours",
      filieres: newEvent.filieres || [],
      statut: (newEvent.statut as Event["statut"]) || "Planifié",
      participants: newEvent.participants || [],
      lieu: newEvent.lieu || "",
      estRecurrent: newEvent.estRecurrent || false,
      couleur: newEvent.couleur || "#2CB3C2",
      creePar: "Administrateur",
      dateCreation: new Date().toISOString(),
    }

    setEvents([...events, eventToAdd])
    setShowCreateModal(false)
    resetEventForm()
  }

  // Gestion de la modification d'un événement
  const handleEditEvent = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentEvent) return

    const updatedEvents = events.map((event) => (event.id === currentEvent.id ? { ...currentEvent } : event))

    setEvents(updatedEvents)
    setShowEditModal(false)
    setCurrentEvent(null)
  }

  // Gestion de la suppression d'un événement
  const handleDeleteEvent = () => {
    if (!currentEvent) return

    const updatedEvents = events.filter((event) => event.id !== currentEvent.id)
    setEvents(updatedEvents)
    setShowDeleteModal(false)
    setCurrentEvent(null)
  }

  // Réinitialiser le formulaire d'événement
  const resetEventForm = () => {
    setNewEvent({
      titre: "",
      description: "",
      dateDebut: "",
      dateFin: "",
      type: "Cours",
      filieres: [],
      statut: "Planifié",
      participants: [],
      lieu: "",
      estRecurrent: false,
      couleur: "#2CB3C2",
    })
  }

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("fr-FR", options)
  }

  // Formater la durée pour l'affichage
  const formatDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffMs = endDate.getTime() - startDate.getTime()
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${diffHrs}h${diffMins > 0 ? ` ${diffMins}min` : ""}`
  }

  // Obtenir la classe de couleur pour le statut
  const getStatusClass = (status: Event["statut"]) => {
    switch (status) {
      case "En cours":
        return "bg-green-100 text-green-800"
      case "Planifié":
        return "bg-2CB3C2-100 text-2CB3C2-800"
      case "Terminé":
        return "bg-gray-100 text-gray-800"
      case "Annulé":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Obtenir la classe de couleur pour le type
  const getTypeClass = (type: Event["type"]) => {
    switch (type) {
      case "Cours":
        return "bg-cyan-100 text-cyan-800"
      case "Atelier":
        return "bg-green-100 text-green-800"
      case "Examen":
        return "bg-red-100 text-red-800"
      case "Réunion":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Événements</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("liste")}
                className={`px-3 py-1.5 rounded-md ${
                  viewMode === "liste" ? "bg-cyan-100 text-cyan-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode("calendrier")}
                className={`px-3 py-1.5 rounded-md ${
                  viewMode === "calendrier" ? "bg-cyan-100 text-cyan-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                Calendrier
              </button>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-colors"
            >
              <Plus size={18} />
              <span>Créer un événement</span>
            </button>
          </div>
        </div>
      </header>

      {/* Filtres et recherche */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 flex-grow max-w-md">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un événement..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <X size={18} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center">
              <label htmlFor="filter-type" className="mr-2 text-sm font-medium text-gray-700">
                Type:
              </label>
              <select
                id="filter-type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="Tous">Tous</option>
                <option value="Cours">Cours</option>
                <option value="Atelier">Atelier</option>
                <option value="Examen">Examen</option>
                <option value="Réunion">Réunion</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div className="flex items-center">
              <label htmlFor="filter-filiere" className="mr-2 text-sm font-medium text-gray-700">
                Filière:
              </label>
              <select
                id="filter-filiere"
                value={filterFiliere}
                onChange={(e) => setFilterFiliere(e.target.value)}
                className="border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="Toutes">Toutes</option>
                {filieres.map((filiere) => (
                  <option key={filiere} value={filiere}>
                    {filiere}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label htmlFor="filter-statut" className="mr-2 text-sm font-medium text-gray-700">
                Statut:
              </label>
              <select
                id="filter-statut"
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="Tous">Tous</option>
                <option value="Planifié">Planifié</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="Annulé">Annulé</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchTerm("")
                setFilterType("Tous")
                setFilterFiliere("Toutes")
                setFilterStatut("Tous")
              }}
              className="flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-800"
            >
              <X size={16} />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="p-6">
        {viewMode === "liste" ? (
          /* Vue Liste */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Titre
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date & Heure
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
                        Filière(s)
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Lieu
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Statut
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: event.couleur }}></div>
                            <div className="text-sm font-medium text-gray-900">{event.titre}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(event.dateDebut)}</div>
                          <div className="text-xs text-gray-500">
                            Durée: {formatDuration(event.dateDebut, event.dateFin)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeClass(event.type)}`}
                          >
                            {event.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{event.filieres.join(", ")}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{event.lieu}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(event.statut)}`}
                          >
                            {event.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setCurrentEvent(event)
                                setShowDetailsModal(true)
                              }}
                              className="text-cyan-600 hover:text-cyan-900"
                              title="Voir les détails"
                            >
                              Détails
                            </button>
                            <button
                              onClick={() => {
                                setCurrentEvent(event)
                                setShowEditModal(true)
                              }}
                              className="text-amber-600 hover:text-amber-900"
                              title="Modifier"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setCurrentEvent(event)
                                setShowDeleteModal(true)
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500">Aucun événement ne correspond à vos critères de recherche.</p>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setFilterType("Tous")
                    setFilterFiliere("Toutes")
                    setFilterStatut("Tous")
                  }}
                  className="mt-2 text-cyan-600 hover:text-cyan-800"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Vue Calendrier (simplifiée pour cet exemple) */
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Mars 2025</h2>
              <div className="flex space-x-2">
                <button className="p-1 rounded-md hover:bg-gray-100">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-1 rounded-md hover:bg-gray-100">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const dayEvents = filteredEvents.filter((event) => {
                  const eventDate = new Date(event.dateDebut)
                  return eventDate.getDate() === day && eventDate.getMonth() === 2
                })

                return (
                  <div
                    key={day}
                    className={`min-h-24 border rounded-md p-1 ${
                      day === 27 ? "bg-cyan-50 border-cyan-200" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-right text-sm font-medium mb-1">{day}</div>
                    <div className="space-y-1">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded truncate cursor-pointer"
                          style={{ backgroundColor: event.couleur, color: "white" }}
                          onClick={() => {
                            setCurrentEvent(event)
                            setShowDetailsModal(true)
                          }}
                        >
                          {event.titre}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Statistiques et Prochains Événements */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Statistiques */}
          <div className="col-span-2 rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques des Événements</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-cyan-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-cyan-600">{stats.total}</p>
              </div>
              <div className="bg-2CB3C2-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Planifiés</p>
                <p className="text-2xl font-bold text-2CB3C2-600">{stats.planifies}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">En cours</p>
                <p className="text-2xl font-bold text-green-600">{stats.enCours}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Annulés</p>
                <p className="text-2xl font-bold text-red-600">{stats.annules}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Répartition par type</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-cyan-600 h-2.5 rounded-full"
                        style={{ width: `${(stats.parType.cours / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">Cours ({stats.parType.cours})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${(stats.parType.ateliers / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">Ateliers ({stats.parType.ateliers})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-red-600 h-2.5 rounded-full"
                        style={{ width: `${(stats.parType.examens / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">Examens ({stats.parType.examens})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-amber-600 h-2.5 rounded-full"
                        style={{ width: `${(stats.parType.reunions / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">Réunions ({stats.parType.reunions})</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Répartition par filière</h4>
                <div className="space-y-2">
                  {Object.entries(stats.parFiliere).map(([filiere, count]) => (
                    <div key={filiere} className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-cyan-600 h-2.5 rounded-full"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600 truncate">
                        {filiere.length > 15 ? filiere.substring(0, 15) + "..." : filiere} ({count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Prochains Événements */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Prochains Événements</h3>
            {prochainEvents.length > 0 ? (
              <ul className="space-y-3">
                {prochainEvents.map((event) => (
                  <li key={event.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md">
                    <div className="h-3 w-3 rounded-full mt-1.5" style={{ backgroundColor: event.couleur }}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.titre}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Calendar size={12} className="mr-1" />
                        {formatDate(event.dateDebut)}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center mt-0.5">
                        <MapPin size={12} className="mr-1" />
                        {event.lieu}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Aucun événement à venir.</p>
            )}
          </div>
        </div>
      </main>

      {/* Modal de création d'événement */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              ​
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Créer un Événement</h3>
                    <form onSubmit={handleCreateEvent}>
                      <div className="mb-4">
                        <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-1">
                          Titre *
                        </label>
                        <input
                          type="text"
                          id="event-title"
                          value={newEvent.titre || ""}
                          onChange={(e) => setNewEvent({ ...newEvent, titre: e.target.value })}
                          placeholder="Entrez le titre de l'événement"
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-cyan-500"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="event-description"
                          value={newEvent.description || ""}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                          placeholder="Description de l'événement"
                          rows={3}
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-cyan-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="event-start-date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date et heure de début *
                          </label>
                          <input
                            type="datetime-local"
                            id="event-start-date"
                            value={newEvent.dateDebut || ""}
                            onChange={(e) => setNewEvent({ ...newEvent, dateDebut: e.target.value })}
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-cyan-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="event-end-date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date et heure de fin *
                          </label>
                          <input
                            type="datetime-local"
                            id="event-end-date"
                            value={newEvent.dateFin || ""}
                            onChange={(e) => setNewEvent({ ...newEvent, dateFin: e.target.value })}
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-cyan-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="event-type" className="block text-sm font-medium text-gray-700 mb-1">
                            Type *
                          </label>
                          <select
                            id="event-type"
                            value={newEvent.type || "Cours"}
                            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as Event["type"] })}
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-cyan-500"
                            required
                          >
                            <option value="Cours">Cours</option>
                            <option value="Atelier">Atelier</option>
                            <option value="Examen">Examen</option>
                            <option value="Réunion">Réunion</option>
                            <option value="Autre">Autre</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="event-status" className="block text-sm font-medium text-gray-700 mb-1">
                            Statut
                          </label>
                          <select
                            id="event-status"
                            value={newEvent.statut || "Planifié"}
                            onChange={(e) => setNewEvent({ ...newEvent, statut: e.target.value as Event["statut"] })}
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-cyan-500"
                          >
                            <option value="Planifié">Planifié</option>
                            <option value="En cours">En cours</option>
                            <option value="Terminé">Terminé</option>
                            <option value="Annulé">Annulé</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 mb-1">
                          Lieu
                        </label>
                        <input
                          type="text"
                          id="event-location"
                          value={newEvent.lieu || ""}
                          onChange={(e) => setNewEvent({ ...newEvent, lieu: e.target.value })}
                          placeholder="Lieu de l'événement"
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-cyan-500"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="event-filieres" className="block text-sm font-medium text-gray-700 mb-1">
                          Filières concernées
                        </label>
                        <select
                          id="event-filieres"
                          multiple
                          value={newEvent.filieres || []}
                          onChange={(e) => {
                            const options = Array.from(e.target.selectedOptions, (option) => option.value)
                            setNewEvent({ ...newEvent, filieres: options })
                          }}
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-cyan-500"
                          size={4}
                        >
                          {filieres.map((filiere) => (
                            <option key={filiere} value={filiere}>
                              {filiere}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Maintenez Ctrl (ou Cmd) pour sélectionner plusieurs filières
                        </p>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="event-color" className="block text-sm font-medium text-gray-700 mb-1">
                          Couleur
                        </label>
                        <div className="flex items-center">
                          <input
                            type="color"
                            id="event-color"
                            value={newEvent.couleur || "#2CB3C2"}
                            onChange={(e) => setNewEvent({ ...newEvent, couleur: e.target.value })}
                            className="h-8 w-8 rounded-md border border-gray-300 p-0"
                          />
                          <span className="ml-2 text-sm text-gray-600">{newEvent.couleur || "#2CB3C2"}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="event-recurring"
                            checked={newEvent.estRecurrent || false}
                            onChange={(e) => setNewEvent({ ...newEvent, estRecurrent: e.target.checked })}
                            className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                          />
                          <label htmlFor="event-recurring" className="ml-2 block text-sm text-gray-700">
                            Événement récurrent
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          type="button"
                          onClick={() => {
                            setShowCreateModal(false)
                            resetEventForm()
                          }}
                          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                        >
                          Créer
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification d'événement */}
      {showEditModal && currentEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              ​
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Modifier l'Événement</h3>
                    <form onSubmit={handleEditEvent}>
                      <div className="mb-4">
                        <label htmlFor="edit-event-title" className="block text-sm font-medium text-gray-700 mb-1">
                          Titre *
                        </label>
                        <input
                          type="text"
                          id="edit-event-title"
                          value={currentEvent.titre}
                          onChange={(e) => setCurrentEvent({ ...currentEvent, titre: e.target.value })}
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-cyan-500"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="edit-event-description"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Description
                        </label>
                        <textarea
                          id="edit-event-description"
                          value={currentEvent.description}
                          onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                          rows={3}
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-cyan-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label
                            htmlFor="edit-event-start-date"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Date et heure de début *
                          </label>
                          <input
                            type="datetime-local"
                            id="edit-event-start-date"
                            value={currentEvent.dateDebut}
                            onChange={(e) => setCurrentEvent({ ...currentEvent, dateDebut: e.target.value })}
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-cyan-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="edit-event-end-date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date et heure de fin *
                          </label>
                          <input
                            type="datetime-local"
                            id="edit-event-end-date"
                            value={currentEvent.dateFin}
                            onChange={(e) => setCurrentEvent({ ...currentEvent, dateFin: e.target.value })}
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-cyan-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="edit-event-type" className="block text-sm font-medium text-gray-700 mb-1">
                            Type *
                          </label>
                          <select
                            id="edit-event-type"
                            value={currentEvent.type}
                            onChange={(e) =>
                              setCurrentEvent({ ...currentEvent, type: e.target.value as Event["type"] })
                            }
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-cyan-500"
                            required
                          >
                            <option value="Cours">Cours</option>
                            <option value="Atelier">Atelier</option>
                            <option value="Examen">Examen</option>
                            <option value="Réunion">Réunion</option>
                            <option value="Autre">Autre</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="edit-event-status" className="block text-sm font-medium text-gray-700 mb-1">
                            Statut
                          </label>
                          <select
                            id="edit-event-status"
                            value={currentEvent.statut}
                            onChange={(e) =>
                              setCurrentEvent({ ...currentEvent, statut: e.target.value as Event["statut"] })
                            }
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-cyan-500"
                          >
                            <option value="Planifié">Planifié</option>
                            <option value="En cours">En cours</option>
                            <option value="Terminé">Terminé</option>
                            <option value="Annulé">Annulé</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="edit-event-location" className="block text-sm font-medium text-gray-700 mb-1">
                          Lieu
                        </label>
                        <input
                          type="text"
                          id="edit-event-location"
                          value={currentEvent.lieu}
                          onChange={(e) => setCurrentEvent({ ...currentEvent, lieu: e.target.value })}
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-cyan-500 focus:ring-cyan-500"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="edit-event-color" className="block text-sm font-medium text-gray-700 mb-1">
                          Couleur
                        </label>
                        <div className="flex items-center">
                          <input
                            type="color"
                            id="edit-event-color"
                            value={currentEvent.couleur}
                            onChange={(e) => setCurrentEvent({ ...currentEvent, couleur: e.target.value })}
                            className="h-8 w-8 rounded-md border border-gray-300 p-0"
                          />
                          <span className="ml-2 text-sm text-gray-600">{currentEvent.couleur}</span>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          type="button"
                          onClick={() => {
                            setShowEditModal(false)
                            setCurrentEvent(null)
                          }}
                          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression d'événement */}
      {showDeleteModal && currentEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              ​
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Supprimer l'événement</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir supprimer l'événement "{currentEvent.titre}" ? Cette action ne peut pas
                        être annulée.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteEvent}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Supprimer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setCurrentEvent(null)
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails d'événement */}
      {showDetailsModal && currentEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              ​
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Détails de l'événement</h3>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false)
                      setCurrentEvent(null)
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="border-l-4 pl-4 mb-6" style={{ borderColor: currentEvent.couleur }}>
                  <h2 className="text-xl font-bold text-gray-800">{currentEvent.titre}</h2>
                  <p className="text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeClass(currentEvent.type)}`}
                    >
                      {currentEvent.type}
                    </span>
                    <span
                      className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(currentEvent.statut)}`}
                    >
                      {currentEvent.statut}
                    </span>
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Description</h4>
                    <p className="mt-1 text-sm text-gray-600">{currentEvent.description || "Aucune description"}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Date et heure</h4>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="mr-1 text-gray-400" />
                        <span>Début: {formatDate(currentEvent.dateDebut)}</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="mr-1 text-gray-400" />
                        <span>Fin: {formatDate(currentEvent.dateFin)}</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-1 text-gray-400" />
                        <span>Durée: {formatDuration(currentEvent.dateDebut, currentEvent.dateFin)}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Lieu</h4>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="mr-1 text-gray-400" />
                        <span>{currentEvent.lieu || "Non spécifié"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Filières concernées</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {currentEvent.filieres.map((filiere) => (
                        <span
                          key={filiere}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800"
                        >
                          {filiere}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Participants</h4>
                    <div className="mt-1 flex items-center text-sm text-gray-600">
                      <Users size={16} className="mr-1 text-gray-400" />
                      <span>
                        {currentEvent.participants.length > 0
                          ? currentEvent.participants.map((p) => p.nom).join(", ")
                          : "Aucun participant"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Créé par</h4>
                      <p className="mt-1 text-sm text-gray-600">{currentEvent.creePar}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Date de création</h4>
                      <p className="mt-1 text-sm text-gray-600">{formatDate(currentEvent.dateCreation)}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="view-event-recurring"
                        checked={currentEvent.estRecurrent}
                        readOnly
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                      />
                      <label htmlFor="view-event-recurring" className="ml-2 block text-sm text-gray-700">
                        Événement récurrent
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setShowDetailsModal(false)
                    setCurrentEvent(currentEvent)
                    setShowEditModal(true)
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDetailsModal(false)
                    setCurrentEvent(null)
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GestionEvenements