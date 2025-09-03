import React, { useEffect, useState } from "react";
import HeaderView from "../components/ui/HeaderView.jsx";
import { Link, useParams } from "react-router";
import MainMatchEventsTimeline from "../components/ui/MainMatchEventsTimeline.jsx";
import Breadcrumb from "../components/ui/Breadcrumb.jsx";

export default function MatchEventsTimeline() {
  const [filter, setFilter] = useState("all");
  const { match_id, folder_id } = useParams();

  const [events, setEvents] = useState([])
  const [path, setPath] = useState([
    'Inicio',
    { title: 'Carpetas', path: '/folders' }
  ])

  // Tipos únicos de evento para filtro rápido
  const eventTypes = [
    {
      label: "Canasta",
      value: "point"
    },
    {
      label: "Falta",
      value: "foul"
    },
    {
      label: "Tiempo Fuera",
      value: "timeout"
    }
  ];

  const filteredEvents =
    filter === "all"
      ? events
      : events.filter(e => e.event_type === filter);
  
  const fetchMatchEvents = async () => {
    try {
      const result = await window.electron.getMatchEventsByMatchId(match_id);
      console.log('Eventos del partido:', result);
      setEvents(result);
      // Aquí puedes procesar los eventos obtenidos
    } catch (error) {
      console.error('Error al obtener los eventos del partido:', error);
    }
  }

  const fetchMatch = async (match_id) => {
    try {
      const match = await window.electron.getMatchById(match_id);
      console.log(match)
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

  useEffect(() => {
    getData();
    fetchMatchEvents();
  }, [match_id, folder_id]);

  return (
    <div className="h-screen overflow-x-auto">
      {/* Header */}
      <HeaderView title="Estadísticas del Partido">
        <Link
          to={`/match-stats-table/${match_id}/${folder_id}`}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Ver tabla de estadísticas
        </Link>
      </HeaderView>

      {/* Breadcrumb */}
      <Breadcrumb path={path} />
      
      {/* Main */}
      <MainMatchEventsTimeline
        filteredEvents={filteredEvents}
        eventTypes={eventTypes}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  );
}