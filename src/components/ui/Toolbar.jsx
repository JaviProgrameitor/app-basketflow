
import React from "react";
import { FiSearch, FiShare2, FiTrash2, FiEdit } from "react-icons/fi";

const Toolbar = ({searchQuery, setSearchQuery, selectedItems, sortBy, setSortBy, openModal}) => {
  return (
    <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
      <div className="relative w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar archivos..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    
      <div className="flex items-center space-x-4">
        <select
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="folder_name">Ordenar por nombre carpeta</option>
          <option value="name_tournament">Ordenar por nombre liga/torneo</option>
          <option value="modified">Ordenar por fecha</option>
        </select>
    
        {selectedItems.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={() => openModal('edit', selectedItems[0])}
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md" disabled={selectedItems.length > 1}
            >
              <FiEdit className="w-5 h-5" />
            </button>
            <button 
              onClick={() => openModal('delete', selectedItems[0])}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md"
              disabled={selectedItems.length > 1}
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Toolbar;