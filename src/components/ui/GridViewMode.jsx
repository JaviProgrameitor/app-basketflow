
import React from 'react';
import { FiFile, FiFolder, FiStar } from 'react-icons/fi';

const GridViewMode = ({sortedItems, selectedItems, toggleStar, toggleSelectItem,  open, type}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {sortedItems.map((item, index) => (
        <div
          key={index}
          className={`relative truncate cursor-pointer p-4 rounded-lg border ${selectedItems.some(selectedItem => selectedItem.id === item.id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'} hover:shadow-md transition-shadow duration-200`}
          onClick={() => toggleSelectItem(item)}
          onDoubleClick={() => open(item.id)}
        >
          <div className="flex flex-col items-center text-center">
            {type === 'folder' ? (
              <FiFolder className="w-12 h-12 text-indigo-500 mb-2" />
            ) : (
              <FiFile className="w-12 h-12 text-gray-400 mb-2" />
            )}
            <h3 className="text-sm font-medium text-gray-900 truncate w-full">{item.name}</h3>
            <p className="text-xs text-gray-500">{item.name_tournament}</p>
          </div>
          <button
            className={`absolute top-2 right-2 p-1 rounded-full ${item.starred ? 'text-yellow-400' : 'text-gray-300 hover:text-gray-400'}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleStar(item.id);
            }}
          >
            <FiStar className={`w-4 h-4 ${item.starred ? 'fill-current' : ''}`} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default GridViewMode;