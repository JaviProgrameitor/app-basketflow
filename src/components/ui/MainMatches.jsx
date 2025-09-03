
import React from 'react';
import { FiCalendar, FiEdit2, FiHome, FiTrash2 } from 'react-icons/fi';
import { FaBasketballBall } from "react-icons/fa";
import { Link } from 'react-router';
import dayjs from 'dayjs';
import { matchStates } from '../../data/match.js';

const MainMatches = ({filteredMatches = [], openModal, folder_id}) => {
  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {filteredMatches.map((match) => (
          <div key={match.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FiCalendar className="inline mr-2" />
                {dayjs(match.date).format('DD/MM/YYYY')} - {match.time_start}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${matchStates[match.status]?.bg} ${matchStates[match.status]?.color}`}>
                {matchStates[match.status]?.label}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 text-center">
                <div className="text-xl font-bold">{match.home_team_name}</div>
                {match.status === 'completed' && (
                  <div className="text-3xl font-bold mt-2" style={{color: match.home_team_primary_color}}>
                    {match.home_score}
                  </div>
                )}
              </div>

              <div className="mx-4 text-gray-500 font-bold">VS</div>

              <div className="flex-1 text-center">
                <div className="text-xl font-bold">{match.away_team_name}</div>
                {match.status === 'completed' && (
                  <div className="text-3xl font-bold mt-2" style={{ color: match.away_team_primary_color }}>
                    {match.away_score}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <FiHome /> {match.location}
              </div>
              <div className="flex flex-row gap-2 space-x-2">
                {
                  match.status === 'scheduled' && (
                    <Link to={`/start-match/${match.id}/${folder_id}`} className="text-green-600 hover:text-green-900 flex items-center gap-1">
                      <FaBasketballBall /> Comenzar Juego
                    </Link>
                  )
                }
                {
                  match.status === 'playing' && (
                    <Link to={`/game-tracker/${match.id}`} className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                      <FaBasketballBall /> Seguir Juego
                    </Link>
                  )
                }
                {
                  match.status === 'finalizing' && (
                    <Link to={`/finish-game/${match.id}`} className="text-orange-600 hover:text-orange-900 flex items-center gap-1">
                      <FaBasketballBall /> Finalizar Juego
                    </Link>
                  )
                }
                {
                  match.status === 'completed' && (
                    <Link to={`/match-stats-table/${match.id}/${folder_id}`} className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                      <FaBasketballBall /> Ver Juego
                    </Link>
                  )
                }
                <button onClick={() => openModal('edit', match)} className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                  <FiEdit2 /> Editar
                </button>
                <button onClick={() => openModal('delete', match)} className="text-red-600 hover:text-red-900 flex items-center gap-1">
                  <FiTrash2 /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
        
    </main>
  )
}

export default MainMatches;