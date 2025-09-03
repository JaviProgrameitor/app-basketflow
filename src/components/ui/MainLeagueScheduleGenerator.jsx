
import React from 'react';
import { FiCalendar, FiClock, FiEdit2, FiHome, FiTrash2, FiSave } from 'react-icons/fi';
import dayjs from 'dayjs';

const MainLeagueScheduleGenerator = ({openModal, generatedSchedule = [], generated}) => {
  return (
    <div className={"flex-1 p-6 h-[calc(100vh-64px)] overflow-y-auto"}>
      <div className='flex justify-end gap-1'>
        {
          !generated && generatedSchedule.length > 0 && (
            <button onClick={() => openModal('saveAllMatches')} className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors'>Guardar Partidos</button>
          )
        }
        {
          generated && (
            <button onClick={() => openModal('addMatch')} className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors'>
              Agregar Partido
            </button>
          )
        }
        {
          generated && (
            <button className='bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors'>
              Publicar Calendario
            </button>
          )
        }
        {
          generated && (
            <button onClick={() => openModal('deleteAllMatches')} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors'>
              Eliminar Todos Los Partidos
            </button>
          )
        }
        {
          !generated && (
            <button onClick={() => openModal('generateSchedule')} className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors'>
              Generar Calendario
            </button>
          )
        }
      </div>
      <div className='max-w-3xl mx-auto mt-8'>
        {
          generatedSchedule.length > 0 && (
            generatedSchedule.map((round, index) => (
              <div key={index}>
                <h2 className='text-lg font-medium mb-4'>Jornada {index + 1}</h2>
                <div className='grid grid-cols-2 gap-4'>
                  {
                    round.map((match, matchIndex) => (
                      <div key={`${index}-${matchIndex}`} className={`flex flex-wrap p-4 mb-4 bg-gray-100 rounded shadow hover:bg-gray-200 transition-colors ${match.published ? 'outline-2 outline-offset-0 outline-indigo-500 outline' : ''}`}>
                        <div className='w-3/5 border-r-2 border-gray-300 flex flex-col justify-around'>
                          <p className='text-sm'>{match.home_team_name}</p>
                          <p className='text-sm'>{match.away_team_name}</p>
                        </div>
                        <div className='flex-1 space-y-1'>
                          <div className='mx-auto w-max'>
                            <p className='text-sm text-gray-600'>
                              <FiCalendar className='inline mr-1' />
                              {match.date ? dayjs(match.date).format('DD/MM/YY') : 'Sin Fecha'}
                            </p>
                            <p className='text-sm text-gray-600'>
                              <FiClock className='inline mr-1' />
                              {match.time_start || 'Sin Hora'}
                            </p>
                            <p className='text-sm text-gray-600 truncate'>
                              <FiHome className='inline mr-1' />
                              {match.location || 'Sin Lugar'}
                            </p>
                          </div>
                        </div>
                        {
                          generated && (
                            <div className='w-full flex items-center space-x-2 mt-2'>
                              {
                                match.home_team_id && match.away_team_id && match.date && match.time_start && match.location && match.round && (
                                  <FiSave onClick={() => openModal('publishMatch', match)} className='inline text-green-600 hover:text-green-900 cursor-pointer' />
                                )
                              }
                              <FiEdit2 
                                onClick={() => openModal('editMatch', match)} 
                                className='inline text-indigo-600 hover:text-indigo-900 cursor-pointer' 
                              />
                              <FiTrash2 
                                onClick={() => openModal('deleteMatch', match)}
                                className='inline text-red-600 hover:text-red-900 cursor-pointer' 
                              />
                            </div>
                          )
                        }
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          )
        }
      </div>
    </div>
  );
}

export default MainLeagueScheduleGenerator;