import React from 'react';

const Deconnexion: React.FC = () => {
  const handleLogout = () => {
    // Logique de déconnexion (ex. supprimer le token JWT, rediriger)
    console.log("Déconnexion effectuée");
  };

  return (
    <div className="p-6 flex items-center justify-center h-full">
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Déconnexion</h2>
        <p className="text-gray-600 mb-6">Voulez-vous vraiment vous déconnecter ?</p>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Oui, déconnecter
        </button>
      </div>
    </div>
  );
};

export default Deconnexion;