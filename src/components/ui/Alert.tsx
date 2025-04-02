import React from "react";

const Alertes: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Alertes et Notifications</h2>
      <div className="bg-white rounded-lg shadow">
        <ul className="divide-y">
          <li className="p-4 flex justify-between items-center">
            <span className="text-gray-700">Conflit d'emploi du temps détecté</span>
            <button className="text-blue-600 hover:underline">Résoudre</button>
          </li>
          <li className="p-4 flex justify-between items-center">
            <span className="text-gray-700">Demande de validation en attente</span>
            <button className="text-blue-600 hover:underline">Valider</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Alertes;