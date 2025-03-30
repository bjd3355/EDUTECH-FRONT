import React from 'react';

const Modules: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gestion des Cours</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <button className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 mb-4">Créer un cours</button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded">
            <h3 className="text-lg font-medium text-gray-700">Algorithmique</h3>
            <p className="text-gray-600">Prof. Dupont</p>
            <button className="mt-2 text-blue-600 hover:underline">Éditer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modules;