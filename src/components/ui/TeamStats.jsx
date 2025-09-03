
import React, { useEffect, useState } from 'react';
import Table from './Table.jsx';

function TeamStats({ folderId }) {

  const [topScorersTeams, setTopScorersTeams] = useState([]);
  const [fewerPointsAllowedTeams, setFewerPointsAllowedTeams] = useState([]);
  const [fewerFoulsMadeTeams, setFewerFoulsMadeTeams] = useState([]);

  const columnsTST = [
    {
      header: 'Equipo',
      accessor: 'team_name',
      headerClassName: 'w-[200px]',
      cellClassName: 'w-[200px]',
    },
    {
      header: 'Puntos Totales',
      accessor: 'total_points_scored',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
    },
  ]

  const columnsFPAT = [
    {
      header: 'Equipo',
      accessor: 'team_name',
      headerClassName: 'w-[200px]',
      cellClassName: 'w-[200px]',
    },
    {
      header: 'Puntos Permitidos',
      accessor: 'total_points_against',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
    },
  ]

  const columnsFFMT = [
    {
      header: 'Equipo',
      accessor: 'team_name',
      headerClassName: 'w-[200px]',
      cellClassName: 'w-[200px]',
    },
    {
      header: 'Faltas Cometidas',
      accessor: 'total_fouls',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
    },
  ]

  const getTopScorersTeams = async () => {
    try {
      const response = await window.electron.getTopScorersTeamsByFolder(folderId);
      setTopScorersTeams(response);
    } catch (error) {
      console.error('Error fetching top scorers:', error);
    }
  }

  const getFewerPointsAllowedTeams = async () => {
    try {
      const response = await window.electron.getFewerPointsAllowedTeamsByFolder(folderId);
      setFewerPointsAllowedTeams(response);
    } catch (error) {
      console.error('Error fetching fewer points allowed:', error);
    }
  };

  const getFewerFoulsMadeTeams = async () => {
    try {
      const response = await window.electron.getFewerFoulsMadeTeamsByFolder(folderId);
      setFewerFoulsMadeTeams(response);
    } catch (error) {
      console.error('Error fetching fewer fouls made:', error);
    }
  }

  useEffect(() => {
    getTopScorersTeams();
    getFewerPointsAllowedTeams();
    getFewerFoulsMadeTeams();
  }, []);

  return (
    <div>
      <div className='mt-8'>
        <h2 className='mb-4 font-medium'>Mas Anotadores</h2>
        <Table columns={columnsTST} data={topScorersTeams} indexColumn={true} />
      </div>
      <div className='mt-8'>
        <h2 className='mb-4 font-medium'>Menos Puntos Permitidos</h2>
        <Table columns={columnsFPAT} data={fewerPointsAllowedTeams} indexColumn={true} />
      </div>
      <div className='mt-8'>
        <h2 className='mb-4 font-medium'>Menos Faltas Cometidas</h2>
        <Table columns={columnsFFMT} data={fewerFoulsMadeTeams} indexColumn={true} />
      </div>
    </div>
  );
}

export default TeamStats;