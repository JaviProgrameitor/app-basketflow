
import React from 'react';
import { FiEdit2, FiStar, FiTrash2 } from 'react-icons/fi';

const MainTeams = ({filteredTeams, openModal, seePlayers}) => {
  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team, index) => (
          <div key={index} onDoubleClick={() => seePlayers(team)} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <div 
              className="h-3 w-full"
              style={{ backgroundColor: team.primary_color }}
            ></div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">
                  {team.name}
                </h3>
                <button className="text-gray-400 hover:text-yellow-400">
                  <FiStar />
                </button>
              </div>
              <div className="mt-4 space-y-2">
                <div className="text-gray-600">Entrenador: {team.coach}</div>
                <div className="text-gray-600">Asistente: {team.assistant_coach ? team.assistant_coach : 'Sin entrenador asistente'}</div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                <button onClick={() => openModal('edit', team)} className="text-indigo-600 hover:text-indigo-900">
                  <FiEdit2 className="inline mr-1" /> Editar
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <FiTrash2 className="inline mr-1" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default MainTeams;