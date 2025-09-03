
import React from 'react';
import BlackScreen from "./BlackScreen.jsx";
import { FiX } from 'react-icons/fi';

const Modal = ({isOpen, onClose, title, children}) => {
  if (!isOpen) return null;

  return (
    <BlackScreen>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full pb-6">
        <div className="px-6 pt-6 flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className='px-6 pt-4'>
          {children}
        </div>
      </div>
    </BlackScreen>
  )
}

export default Modal;