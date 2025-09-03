import React, { useEffect, useState } from 'react';
import { FiPlus, FiUsers } from 'react-icons/fi';
import { Link, useParams } from 'react-router';
import { useModal } from '../hooks';

import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import Modal from '../components/ui/Modal.jsx';
import ToolbarMatches from '../components/ui/ToolbarMatches.jsx';
import MainMatches from '../components/ui/MainMatches.jsx';
import HeaderView from '../components/ui/HeaderView.jsx';
import Form from '../components/form/Form.jsx';

const Matches = () => {
  // Estados para controlar la vista activa
  const [searchQuery, setSearchQuery] = useState('');
  const { modalState, openModal, closeModal } = useModal({
    create: false,
    edit: false,
    delete: false,
    currentData: null,
  });

  // Conseguir el ID de la carpeta desde la URL
  const { folder_id } = useParams();

  const [path, setPath] = useState([
    'Inicio',
    { title: 'Carpetas', path: '/folders' },
  ])

  const [openMenu, setOpenMenu] = useState(false);

  // Datos de ejemplo - equipos
  const [teams, setTeams] = useState([]);

  // Datos de ejemplo - partidos
  const [matches, setMatches] = useState([]);

  const MatchesForm = [
    { 
      name: "date", 
      label: "Fecha del partido", 
      type: "date", 
      fieldContainerClassName: 'w-full',
      props: {
        required: true
      }
    },
    {
      name: 'time_start',
      label: 'Hora de inicio',
      type: 'time',
      fieldContainerClassName: 'w-full',
      props: {
        required: true
      }
    },
    {
      name: 'location',
      label: 'Ubicación',
      type: 'text',
      fieldContainerClassName: 'w-full',
      props: {
        placeholder: 'Gimnasio Municipal',
        required: true
      }
    },
    {
      name: 'home_team_id',
      label: 'Equipo local',
      type: 'select',
      options: teams.map(team => ({
        value: team.id,
        label: team.name
      })),
      fieldContainerClassName: 'w-[48%]',
      props: {
        required: true
      }
    },
    {
      name: 'away_team_id',
      label: 'Equipo visitante',
      type: 'select',
      options: teams.map(team => ({
        value: team.id,
        label: team.name
      })),
      fieldContainerClassName: 'w-[48%]',
      props: {
        required: true
      }
    },
  ];

  // Agregar nuevo partido
  const handleAddMatch = async (match) => {
    const matchToAdd = {
      ...match,
      folder_id,
    };

    try {
      const result = await window.electron.addMatch(matchToAdd)
      fetchMatches();
    } catch (error) {
      console.error('Error al agregar el partido:', error);
    } finally {
      closeModal('create');
    }
  };

  const handleEditMatch = async (match) => {
    const matchToEdit = {
      ...modalState.currentData,
      ...match
    };

    try {
      const result = await window.electron.updateMatch(matchToEdit);
      fetchMatches();
    } catch (error) {
      console.error('Error al editar el partido:', error);
    } finally {
      closeModal('edit');
    }
  }

  const handleDeleteMatch = async (matchId) => {
    try {
      const result = await window.electron.softDeleteMatch(matchId);
      fetchMatches();
    } catch (error) {
      console.error('Error al eliminar el partido:', error);
    } finally {
      closeModal('delete');
    }
  }

  const filteredMatches = matches.filter(match => {
    return (
      (match.home_team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.away_team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.location.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  });

  // Obtener equipos de la carpeta
  const fetchTeams = async () => {
    try {
      const allTeams = await window.electron.getFoldersTeamsByFolderId(folder_id);
      setTeams(allTeams);
    } catch (error) {
      console.error('Error al obtener los equipos:', error);
    }
  }

    const fetchMatches = async () => {
      try {
        const allMatches = await window.electron.getMatchesByFolderId(folder_id);
        console.log('Partidos obtenidos:', allMatches);
        setMatches(allMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    }

  const fetchFolder = async () => {
    try {
      const folder = await window.electron.getFolderById(folder_id);
      setPath([
        ...path,
        folder.name
      ]);
    } catch (error) {
      console.error('Error al obtener los equipos:', error);
    }
  }

  useEffect(() => {
    Promise.all([
      fetchFolder(),
      fetchMatches(),
      fetchTeams()
    ]);
  }, []);
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <HeaderView title="Partidos">
        <Link 
          to={`/teams/${folder_id}`}
          className="flex items-center gap-2 button font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <FiUsers className="size-4 lg:size-5" />
          Ver Equipos
        </Link>
        <button
          onClick={() => openModal('create')}
          className="flex items-center gap-2 button font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <FiPlus className="size-4 lg:size-5" />
          Nuevo Partido
        </button>
        <div
          className="relative"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <button
            className={`button bg-blue-600 ${openMenu && 'bg-blue-700'} text-white font-medium flex items-center gap-2 hover:bg-blue-700 transition`}
          >
            Más Opciones
            <span className="text-xs">&#9662;</span>
          </button>
          {openMenu && (
            <div className="absolute right-0 mt-2 min-w-[210px] bg-white shadow-lg rounded z-10 flex flex-col border border-gray-200">
              <Link
                to={`/league-stats/${folder_id}`}
                className="text-left px-5 py-2 hover:bg-blue-50 transition"
              >
                Estadísticas de Liga
              </Link>
              <Link
                to={`/league-ranking/${folder_id}`}
                className="text-left px-5 py-2 hover:bg-blue-50 transition"
              >
                Tabla de Posiciones
              </Link>
              <Link
                to={`/league-schedule-generator/${folder_id}`}
                className="text-left px-5 py-2 hover:bg-yellow-50 transition"
              >
                Generar Calendario
              </Link>
            </div>
          )}
        </div>
      </HeaderView>

      {/* Toolbar */}
      <ToolbarMatches matches={matches} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Breadcrumb */}
      <Breadcrumb path={path} />

      {/* Main Content */}
      <MainMatches 
        filteredMatches={filteredMatches} 
        teams={teams} 
        openModal={openModal}
        folder_id={folder_id} 
      />

      <Modal
        isOpen={modalState.create}
        onClose={() => closeModal('create')}
        title="Nuevo Partido"
      >
        <Form 
          fields={MatchesForm}
          onSubmit={(values) => handleAddMatch(values)}
          submitLabel="Crear partido"
          containerInputsClassName='flex justify-between flex-wrap'
          actionsRender={() => (
            <button
              type="button"
              className="button border-gray-300 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500"
              onClick={() => closeModal('create')}
            >
              Cancelar
            </button>
          )}
        />
      </Modal>

      <Modal
        isOpen={modalState.edit}
        onClose={() => closeModal('edit')}
        title="Editar Partido"
      >
        <Form 
          fields={MatchesForm}
          onSubmit={(values) => handleEditMatch(values)}
          submitLabel="Crear partido"
          initialValues={modalState.currentData}
          containerInputsClassName='flex justify-between flex-wrap'
          actionsRender={() => (
            <button
              type="button"
              className="button border-gray-300 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500"
              onClick={() => closeModal('edit')}
            >
              Cancelar
            </button>
          )}
        />
      </Modal>

      <Modal
        isOpen={modalState.delete}
        onClose={() => closeModal('delete')}
        title="Eliminar Partido"
      >
        <div className="flex flex-col items-center pb-4">
          <p className="text-lg">¿Estás seguro de que deseas eliminar este partido?</p>
          <div className="w-full flex justify-end gap-4 mt-4">
            <button
              className="bg-gray-300 text-gray-700 button"
              onClick={() => closeModal('delete')}
            >
              Cancelar
            </button>
            <button
              className="bg-red-500 text-white button"
              onClick={() => handleDeleteMatch(modalState.currentMatch.id)}
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Matches;