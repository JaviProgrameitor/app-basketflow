import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { FiCalendar, FiPlus } from 'react-icons/fi';
import { useModal } from '../hooks';

import Modal from '../components/ui/Modal.jsx';
import ToolBarTeams from '../components/ui/ToolBarTeams.jsx';
import MainTeams from '../components/ui/MainTeams.jsx';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import HeaderView from '../components/ui/HeaderView.jsx';
import Form from '../components/form/Form.jsx';

const Teams = () => {
  // Navegación
  const navigate = useNavigate();

  // Estados para controlar la vista activa
  const [searchQuery, setSearchQuery] = useState('');
  const { modalState, openModal, closeModal } = useModal({
    create: false,
    edit: false,
    delete: false,
    currentData: null
  });

  // ID de la carpeta desde la URL
  const { folder_id } = useParams();

  // Datos de ejemplo - equipos
  const [teams, setTeams] = useState([]);

  const [path, setPath] = useState([
    'Inicio',
    { title: 'Carpetas', path: '/folders' },
  ])

  const fieldsForm = [
    { 
      name: "name", 
      label: "Nombre del equipo", 
      type: "text", 
      props: {
        placeholder: "Ej: Los campeones",
        required: true
      }
    },
    {
      name: 'coach',
      label: 'Entrenador',
      type: 'text',
      props: {
        placeholder: 'Ej: Juan Pérez',
        required: true
      }
    },
    {
      name: 'assistant_coach',
      label: 'Entrenador asistente',
      type: 'text',
      props: {
        placeholder: 'Ej: María López'
      }
    },
    {
      name: 'primary_color',
      label: 'Color primario',
      type: 'color',
      inputClassName: 'w-full h-10',
      defaultValue: '#3B82F6',
      props: {
        required: true
      }
    }
  ];

  // Agregar nuevo equipo
  const handleAddTeam = async (data) => {
    try {
      const newTeam = await window.electron.addTeam(data.name);
      const newFolderTeam = await window.electron.addFoldersTeams({
        folderId: folder_id,
        teamId: newTeam,
        custom_name: '',
        ...data
      });
      fetchTeams();
    } catch (error) {
      console.error('Error al agregar el equipo:', error);
    } finally {
      closeModal('create');
    }
  };

  // Editar equipo
  const handleEditTeam = async (data) => {
    try {
      const updateTeam = await window.electron.updateFoldersTeams({
        folderId: folder_id,
        teamId: modalState.currentData.team_id,
        custom_name: data.name,
        ...data
      });
      fetchTeams();
    } catch (error) {
      console.error('Error al editar el equipo:', error);
    } finally {
      closeModal('edit');
    }
  };

  // Filtrar equipos y partidos según búsqueda
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.coach.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.assistant_coach.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const seePlayers = (team) => {
    navigate(`/players/${folder_id}/${team.id}`)
  }

  const fetchTeams = async () => {
    try {
      const teams = await window.electron.getFoldersTeamsByFolderId(folder_id);
      console.log('Folder ID:', folder_id);
      console.log('Equipos obtenidos:', teams);
      setTeams(teams);
    } catch (error) {
      console.error('Error al obtener los equipos:', error);
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
      fetchFolder()
      fetchTeams();
    }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <HeaderView title="Equipos">
        <Link
          to={`/matches/${folder_id}`}
          className="flex items-center gap-2 button font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <FiCalendar className="size-4 lg:size-5" />
          Ver Partidos
        </Link>
        <button
          onClick={() => openModal('create')}
          className="flex items-center gap-2 button font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <FiPlus className="size-4 lg:size-5" />
          Nuevo Equipo
        </button>
      </HeaderView>

      {/* Toolbar */}
      <ToolBarTeams searchQuery={searchQuery} setSearchQuery={setSearchQuery} teams={teams} />

      <Breadcrumb path={path} />

      {/* Main Content */}
      <MainTeams filteredTeams={filteredTeams} openModal={openModal} seePlayers={seePlayers} />

      {/* Modal para nuevo equipo */}
      <Modal
        isOpen={modalState.create}
        onClose={() => closeModal('create')}
        title="Nuevo Equipo"
      >
        <Form 
          fields={fieldsForm}
          onSubmit={(values) => handleAddTeam(values)}
          submitLabel="Agregar Equipo"
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

      {/* Modal para editar equipo */}
      <Modal
        isOpen={modalState.edit}
        onClose={() => closeModal('edit')}
        title="Editar Equipo"
      >
        <Form 
          fields={fieldsForm}
          onSubmit={(values) => handleEditTeam(values)}
          initialValues={modalState.currentData}
          submitLabel="Guardar Cambios"
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
    </div>
  );
};

export default Teams;