
import React from 'react';

const StatusBar = ({ selectedItems, allItems }) => {
  return (
    <footer className="bg-white border-t px-6 py-3 flex justify-between items-center text-sm text-gray-500">
      <div>
        {selectedItems.length > 0 ? (
          <span>{selectedItems.length} items seleccionados</span>
        ) : (
          <span>{allItems.length} items</span>
        )}
      </div>
    </footer>
  )
}

export default StatusBar;