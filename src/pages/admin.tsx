"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  FaChartBar,
  FaCog,
  FaUsers,
  FaCalendarAlt,
  FaBell,
  FaFolder,
  FaClipboardList,
  FaGraduationCap,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaUserCircle,
  FaRegBell,
  FaSignOutAlt,
  FaVideo,
  FaSchool,
} from "react-icons/fa"

interface MenuItem {
  name: string
  icon: React.ReactNode
  subItems?: SubMenuItem[]
}

interface SubMenuItem {
  name: string
  icon: React.ReactNode
}

interface Notification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
}

// Mise à jour des icônes pour Classes virtuelles et Déconnexion
const menuItems: MenuItem[] = [
  { name: "Tableau de bords", icon: <FaChartBar /> },
  {
    name: "Gestion",
    icon: <FaCog />,
    subItems: [
      { name: "Utilisateurs", icon: <FaUsers /> },
      { name: "Filières", icon: <FaGraduationCap /> },
    ],
  },
  { name: "Emploi du temps", icon: <FaCalendarAlt /> },
  { name: "Evènements", icon: <FaClipboardList /> },
  { name: "Classes virtuelles", icon: <FaVideo /> }, // Meilleure icône pour Classes virtuelles
  { name: "Ressources", icon: <FaFolder /> },
  { name: "Alertes", icon: <FaBell /> },
  { name: "Paramètres avancés", icon: <FaCog /> },
]

const logoutItem: MenuItem = {
  name: "Déconnexion",
  icon: <FaSignOutAlt />, // Meilleure icône pour Déconnexion
}

const Admin: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("Tableau de bords")
  const [isGestionOpen, setIsGestionOpen] = useState<boolean>(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
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

  const handleItemClick = (name: string) => {
    setActiveItem(name)
    if (name === "Gestion") {
      setIsGestionOpen(!isGestionOpen)
    }
  }

  const handleSubItemClick = (name: string) => {
    setActiveItem(name)
  }

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

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-montserrat">
      <header className="bg-blue-100 shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FaSchool className="text-blue-600 text-2xl mr-2" /> {/* Icône pour EduTech */}
            <span className="font-bold text-blue-600">EduTech</span>
          </div>
          <FaBars className="text-gray-500 text-lg cursor-pointer hover:text-gray-700" onClick={toggleSidebar} />
        </div>
        <div className="flex items-center space-x-4 relative">
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

      <div className="flex flex-1 overflow-hidden">
        {/* Barre latérale avec défilement */}
        <div
          ref={sidebarRef}
          className={`bg-blue-100 shadow-lg flex flex-col transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
          }`}
        >
          {/* Logo en haut au lieu de l'icône Home */}
          <div className="p-4 border-b border-gray-200 flex justify-center items-center">
            <div className="h-8"></div> {/* Espace vide pour maintenir la mise en page */}
          </div>

          {/* Menu avec défilement */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleItemClick(item.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition duration-200 ${
                      activeItem === item.name ? "bg-cyan-100 text-cyan-700" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{item.icon}</span>
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    {item.subItems && (
                      <span className="text-lg">
                        {isGestionOpen && item.name === "Gestion" ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    )}
                  </button>
                  {item.subItems && item.name === "Gestion" && isGestionOpen && (
                    <ul className="ml-6 mt-2 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.name}>
                          <button
                            onClick={() => handleSubItemClick(subItem.name)}
                            className={`w-full flex items-center p-2 rounded-lg text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition duration-200 ${
                              activeItem === subItem.name ? "bg-cyan-50 text-cyan-600" : ""
                            }`}
                          >
                            <span className="mr-3 text-base">{subItem.icon}</span>
                            <span className="text-sm">{subItem.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => handleItemClick(logoutItem.name)}
              className={`w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition duration-200 ${
                activeItem === logoutItem.name ? "bg-cyan-100 text-cyan-700" : ""
              }`}
            >
              <span className="mr-3 text-lg">{logoutItem.icon}</span>
              <span className="text-sm font-medium">{logoutItem.name}</span>
            </button>
          </div>
        </div>

        <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? "" : "w-full"}`}>
          <h2 className="text-xl font-semibold text-gray-800">Tableau de bords</h2>
          <p className="mt-2 text-gray-600">Bienvenue sur le tableau de bord de l'administrateur.</p>
        </div>
      </div>
    </div>
  )
}

export default Admin

