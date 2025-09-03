
import React, { useEffect, useState } from 'react';
import Table from './Table.jsx';

function PlayerStats({ folderId }) {

  const [pointsPerGame, setPointsPerGame] = useState([]);
  const [threePointersMade, setThreePointersMade] = useState([]);

  const columnsPPG = [
    {
      header: 'Jugador',
      accessor: 'player_name',
      headerClassName: 'w-[200px]',
      cellClassName: 'w-[200px]',
    },
    {
      header: 'Equipo',
      accessor: 'team_name'
    },
    {
      header: 'Puntos por Partido',
      accessor: 'avg_points_per_game',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
    },
  ]

  const columnsTPM = [
    {
      header: 'Jugador',
      accessor: 'player_name',
      headerClassName: 'w-[200px]',
      cellClassName: 'w-[200px]',
    },
    {
      header: 'Equipo',
      accessor: 'team_name'
    },
    {
      header: 'Triples Anotados',
      accessor: 'triples_made',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
    },
  ]

  const getPointsPerGame = async () => {
    try {
      const response = await window.electron.getPointsPerGameByFolder(folderId);
      setPointsPerGame(response)
    } catch (error) {
      console.error('Error fetching points per game:', error);
    }
  };

  const getThreePointersMadeByFolder = async () => {
    try {
      const response = await window.electron.getThreePointersMadeByFolder(folderId);
      setThreePointersMade(response);
      // Process the response as needed
    } catch (error) {
      console.error('Error fetching three pointers made:', error);
    }
  }

  useEffect(() => {
    getPointsPerGame();
    getThreePointersMadeByFolder();
  }, []);

  return (
    <div>
      <div className='mt-8'>
        <h2 className='mb-4 font-medium'>Puntos por Partido</h2>
        <Table columns={columnsPPG} data={pointsPerGame} indexColumn={true} />
      </div>
      <div className='mt-8'>
        <h2 className='mb-4 font-medium'>Triples Anotados</h2>
        <Table columns={columnsTPM} data={threePointersMade} indexColumn={true} />
      </div>
    </div>
  );
}

export default PlayerStats;