
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import ToolbarPlayers from '../components/ui/ToolbarPlayers.jsx';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import Table from '../components/ui/Table.jsx';
import Modal from '../components/ui/Modal.jsx';
import HeaderView from '../components/ui/HeaderView.jsx';
import { useModal } from '../hooks';
import Form from '../components/form/Form.jsx';

const Players = () => {
  // Estados para controlar la vista activa
  const [searchQuery, setSearchQuery] = useState('');
  const { modalState, openModal, closeModal } = useModal({
    create: false,
    edit: false,
    delete: false,
    currentData: null
  });

  const [path, setPath] = useState([
    'Inicio',
    { title: 'Carpetas', path: '/folders' },
  ])

  // ID de la carpeta desde la URL
  const { folder_id, team_id } = useParams();

  const [players, setPlayers] = useState([]);

  // Filtrar jugadores según búsqueda
  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.number.toString().includes(searchQuery.toLowerCase())
  );

  const handleAddPlayer = async (data) => {
    try {
      const newPlayer = await window.electron.addPlayer(team_id, folder_id, data);
      fetchPlayers();
    } catch (error) {
      console.error('Error al agregar el jugador:', error);
    } finally {
      closeModal('create');
    }
  };

  const handleEditPlayer = async (data) => {
    try {
      const updatedPlayer = await window.electron.updatePlayer({
        ...modalState.currentData,
        ...data
      });
      fetchPlayers();
    } catch (error) {
      console.error('Error al editar el jugador:', error);
    } finally {
      closeModal('edit');
    }
  };

  const handleDeletePlayer = async (player) => {
    try {
      const deletedPlayer = await window.electron.softDeletePlayer(modalState.currentData.id);
      fetchPlayers();
    } catch (error) {
      console.error('Error al eliminar el jugador:', error);
    } finally {
      closeModal('delete');
    }
  };

  // Función para obtener los jugadores
  const fetchPlayers = async () => {
    try {
      const result = await window.electron.getPlayersByTeamIdAndFolderId(team_id, folder_id);
      console.log('Jugadores:', result);
      setPlayers(result);
    } catch (error) {
      console.error('Error al obtener los jugadores:', error);
    }
  };

  const fetchTeam = async () => {
    try {
      console.log(folder_id, team_id)
      const result = await window.electron.getFoldersTeamsByFolderIdAndTeamId({folderId: folder_id, teamId: team_id});
      console.log('Equipo:', result);
      setPath([
        ...path,
        { title: result.folder_name, path: `/teams/${folder_id}` },
        !result.custom_name ? result.team_name : result.custom_name
      ])
    } catch (error) {
      console.error('Error al obtener el equipo:', error);
    }
  }

  const columns = [
      {
        header: "Nombre",
        accessor: "name",
      },
      {
        header: "Número de camiseta",
        accessor: "number",
      },
      {
        header: "Posición",
        accessor: "position",
        render: (row) => row.position || 'No especificada',
      }
    ];

  const fieldsForm = [
    { 
      name: "name", 
      label: "Nombre del jugador", 
      type: "text", 
      props: {
        placeholder: "Ej: Juan Pérez",
        required: true
      }
    },
    {
      name: 'position',
      label: 'Posición',
      type: 'text',
      props: {
        placeholder: 'Ej: Base',
      }
    },
    {
      name: 'number',
      label: 'Número de camiseta',
      type: 'number',
      props: {
        placeholder: 'Ej: 23',
        required: true
      }
    }
  ];

  useEffect(() => {
    fetchTeam();
    fetchPlayers();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Headers */}
      <HeaderView title="Jugadores">
        <button
          onClick={() => openModal('create')}
          className="flex items-center button font-medium text-white bg-green-600 hover:bg-green-700"
        >
          Nuevo Jugador
        </button>
      </HeaderView>

      {/* Toolbar */}
      <ToolbarPlayers searchQuery={searchQuery} setSearchQuery={setSearchQuery} players={players} />

      {/* Breadcrumb */}
      <Breadcrumb path={path} />

      {/* Main Context */}
      <main className="flex-1 overflow-auto p-6">
        <Table 
          data={filteredPlayers}
          columns={columns}
          actionsRender={(item) => (
            <div className="flex items-center">
              <button
                className="text-blue-600 hover:text-blue-900"
                onClick={() => openModal('edit', item)}
              >
                Editar
              </button>
              <button
                className="text-red-600 hover:text-red-900 ml-4"
                onClick={() => openModal('delete', item)}
              >
                Eliminar
              </button>
            </div>
          )}
        />
      </main>

      {/* Modal agregar jugadores */}
      <Modal
        isOpen={modalState.create}
        onClose={() => closeModal('create')}
        title="Agregar Jugador"
      >
        <Form 
          fields={fieldsForm}
          onSubmit={(values) => handleAddPlayer(values)}
          submitLabel="Agregar Jugador"
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

      {/* Modal editar jugadores */}
      <Modal
        isOpen={modalState.edit}
        onClose={() => closeModal('edit')}
        title="Editar Jugador"
      >
        <Form 
          fields={fieldsForm}
          onSubmit={(values) => handleEditPlayer(values)}
          submitLabel="Guardar Cambios"
          initialValues={modalState.currentData}
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

      {/* Modal eliminar jugadores */}
      <Modal
        isOpen={modalState.delete}
        onClose={() => closeModal('delete')}
        title="Eliminar Jugador"
      >
        <div>
          <p>¿Estás seguro de que deseas eliminar este jugador?</p>
        </div>
        <div className="bg-gray-50 px-6 py-3 flex justify-end rounded-b-lg gap-2">
          <button
            type="button"
            className="inline-flex justify-center button border-gray-300 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500"
            onClick={() => closeModal('delete')}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="inline-flex justify-center button font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-red-500"
            onClick={handleDeletePlayer}
          >
            Eliminar Jugador
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Players;