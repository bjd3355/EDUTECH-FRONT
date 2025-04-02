// App.tsx
"use client"; // Requis pour Next.js (supprimez si vous n'utilisez pas Next.js)

import React from "react"; // Importation de React pour utiliser JSX et les composants React
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importation des composants de routage
import "./index.css"; // Importation des styles CSS globaux
import Login from './pages/Auth/login'; // Importation du composant Login
import Admin from './pages/admin'; // Importation du composant Admin

const App: React.FC = () => { // Définition du composant App comme un composant fonctionnel
  return (
    <Router> {/* Conteneur pour le routage côté client */}
      <Routes> {/* Définition des routes de l'application */}
        <Route path="/" element={<Login />} /> {/* Route pour la page de connexion à l'URL racine */}
        <Route path="/admin" element={<Admin />} /> {/* Route pour la page d'administration */}
      </Routes>
    </Router>
  );
};

export default App; // Exportation du composant App comme exportation par défaut