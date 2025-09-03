
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import HeaderView from '../components/ui/HeaderView.jsx';
import MainLeagueRanking from '../components/ui/MainLeagueRanking.jsx';

const LeagueRanking = () => {

  const { folder_id } = useParams();

  const [folder, setFolder] = useState({});
  const [standings, setStandings] = useState([]);

  const columns = [
    {
      header: "Equipo",
      accessor: "team_name"
    },
    {
      header: "Ganados",
      accessor: "wins"
    },
    {
      header: "Perdidos",
      accessor: "losses",
    },
    {
      header: "Diferencia de Puntos",
      accessor: "point_difference",
    }
  ];

  const fetchFolder = async () => {
    try {
      const folderData = await window.electron.getFolderById(folder_id);
      console.log('Carpeta obtenida:', folderData);
      setFolder(folderData);
    } catch (error) {
      console.error('Error al obtener la carpeta:', error);
    }
  };

  const fetchLeagueRanking = async () => {
    try {
      const ranking = await window.electron.getStatsByFolder(folder_id);
      setStandings(ranking);
      console.log('Ranking de la liga:', ranking);
    } catch (error) {
      console.error('Error al obtener el ranking de la liga:', error);
    }
  }

  useEffect(() => {
    Promise.all([
      fetchFolder(),
      fetchLeagueRanking()
    ]);
  }, [folder_id]);

  return (
    <div>
      {/* Header */}
      <HeaderView title="Tabla de Clasificación de la Liga" back={`/matches/${folder_id}`}>
        <Link
          to={`/playoffs/${folder_id}`}
          className={`bg-blue-600 text-white button flex items-center hover:bg-blue-700`}
        >
          Eliminatorias
        </Link>
      </HeaderView>

      {/* Main Content */}
      <MainLeagueRanking 
        columns={columns} 
        data={standings}
      />
    </div>
  )
}

export default LeagueRanking;