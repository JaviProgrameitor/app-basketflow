
import React from 'react';
import { FiSearch } from 'react-icons/fi';

const ToolBarTeams = ({searchQuery, setSearchQuery, teams}) => {
  return (
    <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
      <div className="relative w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={`Buscar equipos...`}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="text-sm text-gray-500">
        {teams.length} equipos registrados
      </div>
    </div>
  )
}

export default ToolBarTeams;