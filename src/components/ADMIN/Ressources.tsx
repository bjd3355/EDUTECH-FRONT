import React from 'react';

const Ressources: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gestion des Ressources</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <button className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 mb-4">Ajouter une ressource</button>
        <ul className="space-y-2">
          <li className="flex justify-between items-center p-2 border rounded">
            <span className="text-gray-700">Cours Algorithmique.pdf</span>
            <button className="text-red-600 hover:underline">Supprimer</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Ressources;