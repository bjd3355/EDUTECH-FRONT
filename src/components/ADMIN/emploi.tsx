import React from 'react';

const Emploi: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gestion des Emplois du Temps</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Calendrier</h3>
        <div className="h-64 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Intégration Google Agenda ici</p>
        </div>
        <div className="mt-4">
          <button className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700">Valider</button>
          <button className="ml-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Supprimer</button>
        </div>
      </div>
    </div>
  );
};

export default Emploi;