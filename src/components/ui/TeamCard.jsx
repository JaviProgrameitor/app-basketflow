
import React, { Fragment, useMemo } from 'react';
import Table from './Table.jsx';
import { colorQuarter } from '../../data/match.js';

import { GiWhistle } from "react-icons/gi";
import { FaBasketball } from "react-icons/fa6";
import { AiOutlineUserDelete } from "react-icons/ai";
import { IoIosWarning } from "react-icons/io";

const TeamCard = ({
  teamData = {},
  players = [],
  foulsByQuarter = [],
  timeoutsByQuarter = [],
  points,
  isHome = false,
  allowedTimeouts,
  columnsTable,
  openModal,
  playerSelected,
  togglePlayerSelected,
  lastFourMinutes,
  currentQuarter
}) => {

  const totalPoints = useMemo(() => {
    return points.reduce((acc, point) => acc + point.point_value, 0);
  }, [points, teamData.id]);
  const teamClass = isHome ? "col-span-4" : "col-span-4 col-start-6";

  const handleManageTimeout = (timeout) => {
    //timeout exists and is in the last four minutes => do nothing
    if (timeout && lastFourMinutes && currentQuarter === 4) {
      return;
    }

    //timeout exists and is not in the last four minutes => open modal to validate password
    if (timeout) {
      openModal('validatePassword', { ...teamData, ...timeout, modalTitle: 'Eliminar Tiempo Fuera' });
      return;
    }

    openModal('addTimeout', teamData);
  };

  return (
    <div className={`p-4 space-y-4 ${teamClass}`}>
      <div className='flex flex-col w-max'>
        <h2 className="sm:text-sm lg:text-xl font-bold text-gray-800 uppercase">{teamData.name}</h2>
        <div className='h-[2px]' style={{ backgroundColor: teamData.primary_color }}></div>
      </div>

      <p className='sm:text-xs md:text-sm lg:text-base'>Puntos Totales: <span className='font-medium'>{totalPoints}</span></p>

      <div className='flex space-x-8'>
        <div>
          <p className='sm:text-xs md:text-sm lg:text-base'>Tiempos Fuera</p>
          <div className='flex items-center space-x-2'>
            {
              Array.from({ length: allowedTimeouts }).map((_, i) => (
                <div onClick={() => handleManageTimeout(timeoutsByQuarter[i])} key={i} className='size-6 border border-black cursor-pointer hover:bg-gray-200'>
                  {
                    timeoutsByQuarter[i] && (
                      <span className={`flex justify-center items-center text-sm ${colorQuarter[timeoutsByQuarter[i].period].text}`}>X</span>
                    )
                  }
                </div>
              ))
            }
          </div>
        </div>
        <div>
          <p className='sm:text-xs md:text-sm lg:text-base'>
            Faltas de Equipo
            <span className='font-medium'> Q{currentQuarter}</span>
          </p>
          <div className='flex items-center gap-2'>
            <div className='inline-flex items-center space-x-2'>
              {
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className='size-6 border border-black'>
                    {
                      foulsByQuarter[i] && (
                        <span className={`flex justify-center items-center text-sm ${colorQuarter[foulsByQuarter[i].period].text}`}>X</span>
                      )
                    }
                  </div>
                ))
              }
            </div>
            <div className='inline'>
              {
                foulsByQuarter.length === 4 && (
                  <Fragment>
                    {/* <span className="text-red-600 text-xl animate-blink">Completas</span> */}
                    <IoIosWarning className="text-red-600 text-2xl animate-blink" />
                  </Fragment>
                )
              }
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className='flex items-center justify-between flex-wrap gap-2 mb-2'>
          <div className='flex items-center space-x-2'>
            {
              playerSelected.length > 0 && players.some(player => player.player_id === playerSelected[0]?.player_id) && (
                <>
                  <button
                    onClick={() => openModal('addFoul', teamData)}
                    className="button flex items-center button text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <span className='hidden lg:block'>Falta</span>
                    <GiWhistle className='lg:hidden size-4 lg:size-5' />
                  </button>
                  <button
                    onClick={() => openModal('addPoint', teamData)}
                    className="button flex items-center button text-white bg-green-600 hover:bg-green-700"
                  >
                    <span className='hidden lg:block'>Canasta</span>
                    <FaBasketball className='lg:hidden size-4 lg:size-5' />
                  </button>
                  <button
                    onClick={() => openModal('deletePlayer', teamData)}
                    className='button flex items-center button text-white bg-yellow-600 hover:bg-yellow-700'
                  >
                    <span className='hidden lg:block'>Eliminar Jugador</span>
                    <AiOutlineUserDelete className='lg:hidden size-4 lg:size-5' />
                  </button>
                </>
              )
            }
          </div>
          <button
            onClick={() => players.length < 12 && openModal('addPlayer', teamData)}
            className="button flex items-center button font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
          >
            Agregar Jugador
          </button>
        </div>
        <div className='h-[calc(100vh/3)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
          <Table
            teamId={teamData.id}
            isHome={isHome}
            columns={columnsTable}
            data={players}
            selectedItems={playerSelected}
            onRowClick={togglePlayerSelected}
            rowKey='player_id'
            stickedHeader={true}
            border={true}
          />
        </div>
      </div>
    </div>
  )
}

export default TeamCard;