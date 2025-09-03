
import React from "react";
import { FiFile, FiFolder, FiMoreVertical, FiStar } from "react-icons/fi";

const TableViewMode = ({ sortedItems, selectedItems, toggleStar, toggleSelectItem, open, type }) => {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Nombre
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Modificado
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {sortedItems.map((item, index) => (
            <tr 
              key={index} 
              className={`${selectedItems.includes(item.id) ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
              onClick={() => toggleSelectItem(item.id)}
              onDoubleClick={() => open(item.id)}
            >
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                <div className="flex items-center">
                  {type === 'folder' ? (
                    <FiFolder className="flex-shrink-0 h-5 w-5 text-indigo-500 mr-2" />
                  ) : (
                    <FiFile className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                  )}
                  <span>{item.name}</span>
                  {item.starred && (
                    <FiStar className="ml-2 flex-shrink-0 h-4 w-4 text-yellow-400 fill-current" />
                  )}
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {new Date(item.updated_at).toLocaleDateString()}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Aquí iría la lógica para el menú de acciones
                  }}
                >
                  <FiMoreVertical className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableViewMode;