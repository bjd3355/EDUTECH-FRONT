
"use client"; // Requis pour Next.js (supprimez si vous n'utilisez pas Next.js)

import React, { useState } from "react"; // Importation de React et useState pour gérer l'état
import { 
  FaHome, FaChartBar, FaCog, FaUsers, FaBook, FaCalendarAlt, 
  FaBell, FaUser, FaFolder, FaClipboardList, FaGraduationCap,
  FaChevronDown, FaChevronUp, FaBars // Icônes pour le menu, sous-menu, et en-tête
} from "react-icons/fa"; // Importation des icônes de react-icons
import edutechLogo from '../assets/logoedutech.jpg'; // Importation du logo EDUTECH (ajustez le chemin)

// Définition du type pour les éléments du menu principal
interface MenuItem {
  name: string; // Nom de l'élément du menu
  icon: React.ReactNode; // Icône de l'élément du menu
  subItems?: SubMenuItem[]; // Sous-menus (optionnel)
}

// Définition du type pour les sous-menus
interface SubMenuItem {
  name: string; // Nom du sous-menu
  icon: React.ReactNode; // Icône du sous-menu
}

// Définition des éléments du menu avec sous-menus pour "Gestion"
const menuItems: MenuItem[] = [
  { name: "Tableau de bords", icon: <FaChartBar /> }, // Tableau de bords avec icône de graphique
  { 
    name: "Gestion", 
    icon: <FaCog />, 
    subItems: [ // Sous-menus pour Gestion
      { name: "Utilisteurs", icon: <FaUsers /> }, // Utilisteurs avec icône d'utilisateurs
      { name: "Filières", icon: <FaGraduationCap /> }, // Filières avec icône de chapeau de diplômé
    ]
  },
  { name: "Emploi du temps", icon: <FaCalendarAlt /> }, // Emploi du temps avec icône de calendrier
  { name: "Evènements", icon: <FaClipboardList /> }, // Evènements avec icône de liste
  { name: "Modules et Classes", icon: <FaBook /> }, // Modules et Classes avec icône de livre
  { name: "Ressources", icon: <FaFolder /> }, // Ressources avec icône de dossier
  { name: "Alertes", icon: <FaBell /> }, // Alertes avec icône de cloche
  { name: "Paramètres avancés", icon: <FaCog /> }, // Paramètres avancés avec icône d'engrenage
];

// Élément "Déconnexion" séparé pour être placé en bas
const logoutItem: MenuItem = {
  name: "Déconnexion",
  icon: <FaUser /> // Utilisation de FaUser pour représenter l'utilisateur connecté
};

// Définition du composant Admin
const Admin: React.FC = () => {
  // État pour suivre l'élément actif du menu (par défaut "Tableau de bords")
  const [activeItem, setActiveItem] = useState<string>("Tableau de bords");
  // État pour gérer l'ouverture/fermeture du sous-menu "Gestion"
  const [isGestionOpen, setIsGestionOpen] = useState<boolean>(false);
  // État pour gérer l'ouverture/fermeture de la barre latérale
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Gestionnaire pour le clic sur un élément du menu principal
  const handleItemClick = (name: string) => {
    setActiveItem(name); // Mise à jour de l'état de l'élément actif
    // Si l'élément cliqué est "Gestion", bascule l'état du sous-menu
    if (name === "Gestion") {
      setIsGestionOpen(!isGestionOpen);
    }
  };

  // Gestionnaire pour le clic sur un sous-menu
  const handleSubItemClick = (name: string) => {
    setActiveItem(name); // Mise à jour de l'état de l'élément actif pour le sous-menu
  };

  // Gestionnaire pour ouvrir/fermer la barre latérale
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-montserrat"> {/* Conteneur principal avec disposition flex verticale */}
      {/* En-tête */}
      <header className="bg-blue-100 shadow-md p-4 flex items-center justify-between"> {/* En-tête avec fond bleu clair et ombre */}
        <div className="flex items-center space-x-4"> {/* Conteneur pour le logo et l'icône de menu */}
          <img src={edutechLogo} alt="EduTech Logo" className="h-8" /> {/* Logo EDUTECH */}
          <FaBars 
            className="text-gray-500 text-lg cursor-pointer hover:text-gray-700" 
            onClick={toggleSidebar} // Gestion du clic pour ouvrir/fermer la barre latérale
          /> {/* Icône pour ouvrir/fermer la barre latérale */}
        </div>
        <div className="flex items-center space-x-4"> {/* Conteneur pour le fil d'Ariane et les icônes */}
          <div className="text-sm text-gray-500"> {/* Fil d'Ariane */}
            
          </div>
          <FaBell className="text-gray-500 text-lg cursor-pointer hover:text-gray-700" /> {/* Icône de cloche */}
          <FaUser className="text-gray-500 text-lg cursor-pointer hover:text-gray-700" /> {/* Icône de connexion (utilisateur connecté) */}
        </div>
      </header>

      {/* Conteneur principal pour le menu latéral et le contenu */}
      <div className="flex flex-1 overflow-hidden"> {/* Conteneur flex pour le menu et le contenu */}
        {/* Menu latéral */}
        <div className={`bg-blue-100 shadow-lg flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}> {/* Menu latéral avec fond bleu clair et transition */}
          {/* Icône "Home" */}
          <div className="p-4 border-b border-gray-200"> {/* Section pour l'icône Home avec bordure inférieure */}
            <button
              onClick={() => handleItemClick("Home")} // Gestion du clic pour "Home"
              className={`w-full flex items-center justify-center p-3 rounded-lg text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition duration-200 ${
                activeItem === "Home" ? "bg-cyan-100 text-cyan-700" : "" // Mise en surbrillance si actif
              }`} // Style du bouton, centré
            >
              <span className="text-2xl"> {/* Icône Home plus grande */}
                <FaHome />
              </span>
            </button>
          </div>

          {/* Éléments du menu (sauf Déconnexion) */}
          <nav className="flex-1 p-4"> {/* Section de navigation avec padding, prend l'espace restant sauf le bas */}
            <ul className="space-y-2"> {/* Liste non ordonnée avec espacement vertical entre les éléments */}
              {menuItems.map((item) => ( // Parcours des éléments du menu pour les afficher
                <li key={item.name}> {/* Élément de liste avec une clé unique */}
                  <button
                    onClick={() => handleItemClick(item.name)} // Gestion du clic pour définir l'élément actif
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition duration-200 ${
                      activeItem === item.name ? "bg-cyan-100 text-cyan-700" : "" // Mise en surbrillance de l'élément actif
                    }`} // Style du bouton avec disposition flex, effets de survol et état actif
                  >
                    <div className="flex items-center"> {/* Conteneur pour l'icône et le texte */}
                      <span className="mr-3 text-lg"> {/* Icône avec marge à droite */}
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium"> {/* Texte de l'élément du menu */}
                        {item.name}
                      </span>
                    </div>
                    {item.subItems && ( // Si l'élément a des sous-menus, affiche une flèche
                      <span className="text-lg"> {/* Flèche pour indiquer l'état du sous-menu */}
                        {isGestionOpen && item.name === "Gestion" ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    )}
                  </button>

                  {/* Sous-menu pour "Gestion" */}
                  {item.subItems && item.name === "Gestion" && isGestionOpen && ( // Affiche les sous-menus si "Gestion" est ouvert
                    <ul className="ml-6 mt-2 space-y-1"> {/* Liste des sous-menus avec indentation */}
                      {item.subItems.map((subItem) => ( // Parcours des sous-menus
                        <li key={subItem.name}> {/* Élément de sous-menu avec une clé unique */}
                          <button
                            onClick={() => handleSubItemClick(subItem.name)} // Gestion du clic sur un sous-menu
                            className={`w-full flex items-center p-2 rounded-lg text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition duration-200 ${
                              activeItem === subItem.name ? "bg-cyan-50 text-cyan-600" : "" // Mise en surbrillance du sous-menu actif
                            }`} // Style du sous-menu
                          >
                            <span className="mr-3 text-base"> {/* Icône du sous-menu */}
                              {subItem.icon}
                            </span>
                            <span className="text-sm"> {/* Texte du sous-menu */}
                              {subItem.name}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Élément "Déconnexion" en bas */}
          <div className="p-4 border-t border-gray-200"> {/* Section pour Déconnexion avec bordure supérieure */}
            <button
              onClick={() => handleItemClick(logoutItem.name)} // Gestion du clic pour "Déconnexion"
              className={`w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition duration-200 ${
                activeItem === logoutItem.name ? "bg-cyan-100 text-cyan-700" : "" // Mise en surbrillance si actif
              }`} // Style du bouton
            >
              <span className="mr-3 text-lg"> {/* Icône de Déconnexion */}
                {logoutItem.icon}
              </span>
              <span className="text-sm font-medium"> {/* Texte "Déconnexion" */}
                {logoutItem.name}
              </span>
            </button>
          </div>
        </div>

        {/* Zone de contenu principal */}
        <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? '' : 'w-full'}`}> {/* Zone de contenu principal avec transition */}
          <h2 className="text-xl font-semibold text-gray-800"> {/* Titre de la page */}
            Tableau de bords
          </h2>
          <p className="mt-2 text-gray-600"> {/* Contenu de la page (espace réservé) */}
            Bienvenue sur le tableau de bord de l'administrateur.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin; // Exportation du composant Admin comme exportation par défaut