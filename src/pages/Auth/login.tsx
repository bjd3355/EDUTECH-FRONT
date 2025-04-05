"use client" // Requis pour Next.js

import type React from "react" // Importation de React et useState pour gérer l'état
import { useState, useRef, useEffect } from "react"
import {
  FaChartBar,
  FaCog,
  FaUsers,
  FaBook,
  FaCalendarAlt,
  FaFolder,
  FaClipboardList,
  FaGraduationCap,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaSignOutAlt,
  FaVideo,
  FaSchool,
  FaUserCircle,
  FaRegBell,
} from "react-icons/fa" // Importation des icônes de react-icons

// Importation des composants depuis src/components/ADMIN/
import Bord from "../../components/ADMIN/bord"
import Utilisateurs from "../../components/ADMIN/Utilisateurs"
import Filiers from "../../components/ADMIN/filiers"
import Emploi from "../../components/ADMIN/emploi"
import Evenement from "../../components/ADMIN/evenement"
import Modules from "../../components/ADMIN/modules"
import Ressources from "../../components/ADMIN/Ressources"
import ClasseVirtuel from "../../components/ADMIN/classeVirtuel" // Importation correcte du composant ClasseVirtuel
import Parametre from "../../components/ADMIN/Parametre"
import Deconnexion from "../../components/ADMIN/Deconnexion"

// Définition du type pour les notifications
interface Notification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
}

// Définition du type pour les éléments du menu principal
interface MenuItem {
  name: string // Nom de l'élément du menu
  icon: React.ReactNode // Icône de l'élément du menu
  subItems?: SubMenuItem[] // Sous-menus (optionnel)
}

// Définition du type pour les sous-menus
interface SubMenuItem {
  name: string // Nom du sous-menu
  icon: React.ReactNode // Icône du sous-menu
}

// Définition des éléments du menu avec sous-menus pour "Gestion"
const menuItems: MenuItem[] = [
  { name: "Tableau de bords", icon: <FaChartBar /> }, // Tableau de bords avec icône de graphique
  {
    name: "Gestion",
    icon: <FaCog />,
    subItems: [
      // Sous-menus pour Gestion
      { name: "Utilisateurs", icon: <FaUsers /> }, // Utilisateurs avec icône d'utilisateurs
      { name: "Filières", icon: <FaGraduationCap /> }, // Filières avec icône de chapeau de diplômé
    ],
  },
  { name: "Emploi du temps", icon: <FaCalendarAlt /> }, // Emploi du temps avec icône de calendrier
  { name: "Evènements", icon: <FaClipboardList /> }, // Evènements avec icône de liste
  { name: "Modules et Classes", icon: <FaBook /> }, // Modules et Classes avec icône de livre
  { name: "Ressources", icon: <FaFolder /> }, // Ressources avec icône de dossier
  { name: "Classes Virtuelles", icon: <FaVideo /> }, // Meilleure icône pour Classes Virtuelles
  { name: "Paramètres avancés", icon: <FaCog /> }, // Paramètres avancés avec icône d'engrenage
]

// Élément "Déconnexion" séparé pour être placé en bas
const logoutItem: MenuItem = {
  name: "Déconnexion",
  icon: <FaSignOutAlt />, // Meilleure icône pour Déconnexion
}

// Définition du composant Login
const Login: React.FC = () => {
  // État pour suivre l'élément actif du menu (par défaut "Tableau de bords")
  const [activeItem, setActiveItem] = useState<string>("Tableau de bords")
  // État pour gérer l'ouverture/fermeture du sous-menu "Gestion"
  const [isGestionOpen, setIsGestionOpen] = useState<boolean>(false)
  // État pour gérer l'ouverture/fermeture de la barre latérale
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
  // États pour les notifications et le profil
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false)
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false)

  // Références pour les menus déroulants
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Sample notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Nouvelle inscription",
      message: "Un nouvel étudiant s'est inscrit",
      time: "Il y a 5 min",
      read: false,
    },
    {
      id: 2,
      title: "Mise à jour système",
      message: "Une mise à jour est disponible",
      time: "Il y a 1 heure",
      read: false,
    },
    {
      id: 3,
      title: "Rappel",
      message: "Réunion des enseignants demain",
      time: "Il y a 3 heures",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  // Fermer les menus déroulants lorsqu'on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Gestionnaire pour le clic sur un élément du menu principal
  const handleItemClick = (name: string) => {
    setActiveItem(name) // Mise à jour de l'état de l'élément actif
    // Si l'élément cliqué est "Gestion", bascule l'état du sous-menu
    if (name === "Gestion") {
      setIsGestionOpen(!isGestionOpen)
    }
  }

  // Gestionnaire pour le clic sur un sous-menu
  const handleSubItemClick = (name: string) => {
    setActiveItem(name) // Mise à jour de l'état de l'élément actif pour le sous-menu
  }

  // Gestionnaire pour ouvrir/fermer la barre latérale
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation() // Empêcher la propagation de l'événement
    setIsNotificationOpen(!isNotificationOpen)
    setIsProfileOpen(false)
  }

  const toggleProfile = (e: React.MouseEvent) => {
    e.stopPropagation() // Empêcher la propagation de l'événement
    setIsProfileOpen(!isProfileOpen)
    setIsNotificationOpen(false)
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  // Fonction pour rendre le contenu en fonction de l'élément actif
  const renderContent = () => {
    switch (activeItem) {
      case "Tableau de bords":
        return <Bord />
      case "Utilisateurs":
        return <Utilisateurs />
      case "Filières":
        return <Filiers />
      case "Emploi du temps":
        return <Emploi />
      case "Evènements":
        return <Evenement />
      case "Modules et Classes":
        return <Modules />
      case "Ressources":
        return <Ressources />
      case "Classes Virtuelles":
        return <ClasseVirtuel /> // Affichage du composant ClasseVirtuel pour "Classes Virtuelles"
      case "Paramètres avancés":
        return <Parametre />
      case "Déconnexion":
        return <Deconnexion />
      default:
        return (
          <>
            <h2 className="text-xl font-semibold text-gray-800">Tableau de bords</h2>
            <p className="mt-2 text-gray-600">Bienvenue sur le tableau de bord de l'administrateur.</p>
          </>
        )
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-montserrat">
      {" "}
      {/* Conteneur principal avec disposition flex verticale */}
      {/* En-tête */}
      <header className="bg-blue-100 shadow-md p-4 flex items-center justify-between">
        {" "}
        {/* En-tête avec fond bleu clair et ombre */}
        <div className="flex items-center space-x-4">
          {" "}
          {/* Conteneur pour le logo et l'icône de menu */}
          <div className="flex items-center">
            <FaSchool className="text-blue-600 text-2xl mr-2" /> {/* Icône pour EduTech */}
            <span className="font-bold text-blue-600">EduTech</span>
          </div>
          <FaBars
            className="text-gray-500 text-lg cursor-pointer hover:text-gray-700"
            onClick={toggleSidebar} // Gestion du clic pour ouvrir/fermer la barre latérale
          />{" "}
          {/* Icône pour ouvrir/fermer la barre latérale */}
        </div>
        <div className="flex items-center space-x-4 relative">
          {" "}
          {/* Conteneur pour les icônes de notification et profil */}
          {/* Menu Notifications */}
          <div className="relative" ref={notificationRef}>
            <div className="relative">
              <FaRegBell
                className="text-gray-500 text-lg cursor-pointer hover:text-gray-700"
                onClick={toggleNotifications}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs text-blue-500 hover:text-blue-700">
                      Marquer tout comme lu
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex justify-between">
                          <p className="font-medium text-sm">{notification.title}</p>
                          {!notification.read && <span className="h-2 w-2 bg-blue-500 rounded-full"></span>}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-sm text-gray-700">Aucune notification</p>
                  )}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="text-xs text-blue-500 hover:text-blue-700 w-full text-center">
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Menu Profil */}
          <div className="relative" ref={profileRef}>
            <FaUserCircle
              className="text-gray-500 text-lg cursor-pointer hover:text-gray-700"
              onClick={toggleProfile}
            />
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <FaUserCircle className="text-gray-500 text-2xl" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">Admin User</p>
                      <p className="text-xs text-gray-500">admin@edutech.com</p>
                    </div>
                  </div>
                </div>
                {/* Simplifié pour n'inclure que Profil et Déconnexion */}
                <div className="py-1">
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsProfileOpen(false)
                      // Ici, vous pourriez naviguer vers la page de profil
                      alert("Redirection vers la page de profil")
                    }}
                  >
                    <FaUserCircle className="mr-3 text-gray-500" />
                    Profil
                  </button>
                </div>
                <div className="py-1 border-t border-gray-100">
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsProfileOpen(false)
                      // Ici, vous pourriez implémenter la déconnexion
                      alert("Déconnexion en cours...")
                      // Redirection vers la page de connexion après déconnexion
                      // window.location.href = "/login";
                    }}
                  >
                    <FaSignOutAlt className="mr-3 text-gray-500" />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Conteneur principal pour le menu latéral et le contenu */}
      <div className="flex flex-1 overflow-hidden">
        {" "}
        {/* Conteneur flex pour le menu et le contenu */}
        {/* Menu latéral avec défilement */}
        <div
          ref={sidebarRef}
          className={`bg-blue-100 shadow-lg flex flex-col transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
        >
          {/* Logo en haut au lieu de l'icône Home */}
          <div className="p-4 border-b border-gray-200 flex justify-center items-center">
            <div className="h-8"></div> {/* Espace vide pour maintenir la mise en page */}
          </div>

          {/* Menu avec défilement */}
          <nav className="flex-1 p-4 overflow-y-auto">
            {" "}
            {/* Ajout de overflow-y-auto pour permettre le défilement */}
            <ul className="space-y-2">
              {" "}
              {/* Liste non ordonnée avec espacement vertical entre les éléments */}
              {menuItems.map(
                (
                  item, // Parcours des éléments du menu pour les afficher
                ) => (
                  <li key={item.name}>
                    {" "}
                    {/* Élément de liste avec une clé unique */}
                    <button
                      onClick={() => handleItemClick(item.name)} // Gestion du clic pour définir l'élément actif
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition duration-200 ${
                        activeItem === item.name ? "bg-cyan-100 text-cyan-700" : "" // Mise en surbrillance de l'élément actif
                      }`} // Style du bouton avec disposition flex, effets de survol et état actif
                    >
                      <div className="flex items-center">
                        {" "}
                        {/* Conteneur pour l'icône et le texte */}
                        <span className="mr-3 text-lg">
                          {" "}
                          {/* Icône avec marge à droite */}
                          {item.icon}
                        </span>
                        <span className="text-sm font-medium">
                          {" "}
                          {/* Texte de l'élément du menu */}
                          {item.name}
                        </span>
                      </div>
                      {item.subItems && ( // Si l'élément a des sous-menus, affiche une flèche
                        <span className="text-lg">
                          {" "}
                          {/* Flèche pour indiquer l'état du sous-menu */}
                          {isGestionOpen && item.name === "Gestion" ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                      )}
                    </button>
                    {/* Sous-menu pour "Gestion" */}
                    {item.subItems &&
                      item.name === "Gestion" &&
                      isGestionOpen && ( // Affiche les sous-menus si "Gestion" est ouvert
                        <ul className="ml-6 mt-2 space-y-1">
                          {" "}
                          {/* Liste des sous-menus avec indentation */}
                          {item.subItems.map(
                            (
                              subItem, // Parcours des sous-menus
                            ) => (
                              <li key={subItem.name}>
                                {" "}
                                {/* Élément de sous-menu avec une clé unique */}
                                <button
                                  onClick={() => handleSubItemClick(subItem.name)} // Gestion du clic sur un sous-menu
                                  className={`w-full flex items-center p-2 rounded-lg text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition duration-200 ${
                                    activeItem === subItem.name ? "bg-cyan-50 text-cyan-600" : "" // Mise en surbrillance du sous-menu actif
                                  }`} // Style du sous-menu
                                >
                                  <span className="mr-3 text-base">
                                    {" "}
                                    {/* Icône du sous-menu */}
                                    {subItem.icon}
                                  </span>
                                  <span className="text-sm">
                                    {" "}
                                    {/* Texte du sous-menu */}
                                    {subItem.name}
                                  </span>
                                </button>
                              </li>
                            ),
                          )}
                        </ul>
                      )}
                  </li>
                ),
              )}
            </ul>
          </nav>

          {/* Élément "Déconnexion" en bas */}
          <div className="p-4 border-t border-gray-200">
            {" "}
            {/* Section pour Déconnexion avec bordure supérieure */}
            <button
              onClick={() => handleItemClick(logoutItem.name)} // Gestion du clic pour "Déconnexion"
              className={`w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition duration-200 ${
                activeItem === logoutItem.name ? "bg-cyan-100 text-cyan-700" : "" // Mise en surbrillance si actif
              }`} // Style du bouton
            >
              <span className="mr-3 text-lg">
                {" "}
                {/* Icône de Déconnexion */}
                {logoutItem.icon}
              </span>
              <span className="text-sm font-medium">
                {" "}
                {/* Texte "Déconnexion" */}
                {logoutItem.name}
              </span>
            </button>
          </div>
        </div>
        {/* Zone de contenu principal */}
        <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? "" : "w-full"}`}>
          {" "}
          {/* Zone de contenu principal avec transition */}
          {renderContent()} {/* Affiche le composant correspondant à l'élément actif */}
        </div>
      </div>
    </div>
  )
}

export default Login // Exportation du composant Login comme exportation par défaut

