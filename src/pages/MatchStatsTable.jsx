
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { calculatePoints } from "../helpers/match.js";
import dayjs from "dayjs";
import 'dayjs/locale/es'; // Importar el locale español si es necesario

import HeaderView from "../components/ui/HeaderView.jsx";
import MainMatchStatsTable from "../components/ui/MainMatchStatsTable.jsx";
import Breadcrumb from "../components/ui/Breadcrumb.jsx";

function MatchStatsTable() {
  const { match_id, folder_id } = useParams();

  const [matchStats, setMatchStats] = useState([]);

  const [sortBy, setSortBy] = useState('points');

  const [path, setPath] = useState([
    'Inicio',
    { title: 'Carpetas', path: '/folders' },
  ])

  // Ordena jugadores por puntos o faltas descendente
  const sortedPlayers = useMemo(() => {
    const arr = [...matchStats];
    arr.sort((a, b) => (sortBy === "points"
      ? b.points - a.points || b.fouls - a.fouls
      : b.fouls - a.fouls || b.points - a.points
    ));
    return arr;
  }, [matchStats, sortBy]);

  const columns = [
    {
      header: "N°",
      accessor: "jersey_number",
      // cellClassName: "bg-red-100",
      render: (row) => row.jersey_number || row.player_number
    },
    {
      header: "Nombre del Jugador",
      accessor: "player_name"
    },
    {
      header: "Equipo",
      accessor: "team_name",
      render: (row) => <span style={{color: row.team_color}}>{row.team_custom_name || row.team_name}</span> 
    },
    {
      header: "Puntos",
      accessor: "points",
      // onClick: (row) => {
      //   if(row.quarter_1) {
      //     openModal('addPoint', { id: row.id, type: 'quarter_1' });
      //   }
      // }
    },
    {
      header: 'Puntos Simples',
      accessor: 'points_simple',
    },
    {
      header: 'Puntos Dobles',
      accessor: 'points_double',
    },
    {
      header: 'Puntos Triples',
      accessor: 'points_triple',
    },
    {
      header: "Faltas",
      accessor: "fouls",
    },
  ];

  const getStatsByMatch = async () => {
    try {
      const stats = await window.electron.getStatsByMatch(match_id);
      setMatchStats(stats);
    } catch (error) {
      console.error("Error fetching match stats:", error);
    }
  }

  const fetchMatch = async (match_id) => {
    try {
      const match = await window.electron.getMatchById(match_id);
      return match;
    }
    catch (error) {
      console.error('Error al obtener el partido:', error);
      return null;
    }
  }
  const fetchFolder = async (folder_id) => {
    try {
      const folder = await window.electron.getFolderById(folder_id);
      return folder;
    }
    catch (error) {
      console.error('Error al obtener la carpeta:', error);
      return null;
    }
  }

  const getData = async () => {
    const match = await fetchMatch(match_id);
    const folder = await fetchFolder(folder_id);
    
    if (match && folder) {
      setPath([
        ...path,
        { title: folder.name, path: `/matches/${folder_id}` },
        'Estadísticas del Partido'
      ]);
    } else {
      console.error('No se pudo obtener el partido o la carpeta');
    }
  }

  const generateOfficialGameReport = async () => {
    try {
      let [dataMatch, players, matchEvents, deletedMatchEvents] = await Promise.all([
        window.electron.getStatsMatchForReportByMatchId(match_id),
        window.electron.getMatchPlayers(match_id),
        window.electron.getMatchEventsByMatchId(match_id),
        window.electron.getDeletedMatchEventsByMatchId(match_id)
      ]);
      const pointsHome = calculatePoints(matchEvents.filter(event => event.team_id === dataMatch.home_team_id && event.event_type === 'point'));
      const foulsHome = matchEvents.filter(event => event.team_id === dataMatch.home_team_id && event.event_type === 'foul');
      const timeoutsHome = matchEvents.filter(event => event.team_id === dataMatch.home_team_id && event.event_type === 'timeout');
      const pointsAway = calculatePoints(matchEvents.filter(event => event.team_id === dataMatch.away_team_id && event.event_type === 'point'));
      const foulsAway = matchEvents.filter(event => event.team_id === dataMatch.away_team_id && event.event_type === 'foul');
      const timeoutsAway = matchEvents.filter(event => event.team_id === dataMatch.away_team_id && event.event_type === 'timeout');

      dataMatch.date = dayjs(dataMatch.date).format('DD/MM/YYYY')
      dataMatch.players = players;
      dataMatch.pointsHome = pointsHome;
      dataMatch.foulsHome = foulsHome;
      dataMatch.timeoutsHome = timeoutsHome;
      dataMatch.pointsAway = pointsAway;
      dataMatch.foulsAway = foulsAway;
      dataMatch.timeoutsAway = timeoutsAway;
      dataMatch.deletedMatchEvents = deletedMatchEvents;

      const playersMatch = dataMatch.players.filter((player) => player.team_id === dataMatch.home_team_id);
      console.log(playersMatch);
      const fouls = dataMatch.foulsHome.filter((foul) => foul.player_id === playersMatch[0].player_id);

      const pdf = await window.electron.generateOfficialGameReport(dataMatch);
      // console.log("PDF generado:", pdf);
    } catch (error) {
      console.error("Error generando el PDF:", error);
    }
  }

  useEffect(() => {
    getData();
    getStatsByMatch();
  }, []);

  return (
    <div className="h-screen overflow-x-hidden">
      {/* Header */}
      <HeaderView title="Estadísticas del Partido">
        <button
          onClick={generateOfficialGameReport}
          className="flex items-center button text-white bg-green-600 hover:bg-green-700 focus:ring-green-500"
        >
          Generar Reporte PDF
        </button>
        <Link
          to={`/match-events-timeline/${match_id}/${folder_id}`}
          className="flex items-center button text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
        >
          Ver Línea de Tiempo de Eventos
        </Link>
      </HeaderView>

      {/* Breadcrum */}
      <Breadcrumb path={path} />
      
      {/* Main */}
      <MainMatchStatsTable 
        setSortBy={setSortBy}
        sortBy={sortBy}
        columns={columns}
        sortedPlayers={sortedPlayers}
      />
    </div>
  );
}

export default MatchStatsTable;