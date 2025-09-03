
import React from 'react';
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link } from 'react-router';

const HeaderGameTracker = ({folderId, currentQuarter = {}, openModal, lastFourMinutes}) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link
            to={`/matches/${folderId}`}
          >
            <FaArrowCircleLeft className='text-2xl' />
          </Link>
          <h3 className="text-base lg:text-2xl font-bold text-gray-800">{currentQuarter?.name}</h3>
        </div>
        <div className="flex space-x-4">
          {
            [1, 2, 3].includes(currentQuarter?.number) &&  (
              <button
                onClick={() => openModal('nextQuarter')}
                className="flex items-center button font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
              >
                Siguiente Cuarto
              </button>
            )
          }
          {
            currentQuarter?.number === 4 && !Boolean(lastFourMinutes) && (
              <button
                onClick={() => openModal('activateLastFourMinutes')}
                className="flex items-center button font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
              >
                Últimos 4 Minutos
              </button>
            )
          }
          {
            currentQuarter?.number === 4 && Boolean(lastFourMinutes) && (
              <button
                onClick={() => openModal('nextQuarter')}
                className="flex items-center button font-medium text-white bg-green-600 hover:bg-green-700 focus:ring-green-500"
              >
                Tiempo Extra
              </button>
            )
          }
          {
            [4, 5].includes(currentQuarter?.number) && Boolean(lastFourMinutes) && (
              <button
                onClick={() => openModal('finishMatch')}
                className="flex items-center button font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
              >
                Terminar Partido
              </button>
            )
          }
        </div>
      </div>
    </header>
  )
}

export default HeaderGameTracker;