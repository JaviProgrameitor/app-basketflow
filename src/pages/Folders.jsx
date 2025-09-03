import React, { useEffect, useMemo, useState } from 'react';
import { useLocalStorage, useModal } from '../hooks';
import { Link, useNavigate } from 'react-router';
import { FiFolder, FiStar, FiGrid, FiList, FiPlus } from "react-icons/fi";
import { Toaster, toast } from 'sonner'

import dayjs from 'dayjs';
import 'dayjs/locale/es';

import HeaderView from '../components/ui/HeaderView.jsx';
import Toolbar from '../components/ui/Toolbar.jsx';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import GridViewMode from '../components/ui/GridViewMode.jsx';
import StatusBar from '../components/ui/StatusBar.jsx';
import Modal from '../components/ui/Modal.jsx';
import Table from '../components/ui/Table.jsx';
import Form from '../components/form/Form.jsx';

const Folders = () => {
  const [viewMode, setViewMode] = useLocalStorage('viewMode', 'grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useLocalStorage('sortBy', 'folder_name'); // 'folder_name', 'name_tournament', 'modified'
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState('');

  const [folders, setFolders] = useState([]);

  const path = ['Carpetas'];
  const navigate = useNavigate()

  const { modalState, openModal, closeModal } = useModal({
    create: false,
    edit: false,
    delete: false,
    currentData: null,
  });

  const initials = useMemo(() => {
      if (!username) return '';
      const parts = String(username).trim().split(/\s+/);
      return parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join('');
    }, [username]);

  const fields = [
    {
      name: "name",
      label: "Nombre de la carpeta",
      type: "text",
      props: {
        placeholder: "Ej: Proyecto Nuevo",
        required: true
      }
    },
    {
      name: 'name_tournament',
      label: 'Nombre de la liga/torneo',
      type: 'text',
      props: {
        placeholder: 'Ej: Liga Nacional de Baloncesto',
        required: true
      }
    }
  ];

  const filteredItems = folders.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'folder_name') return a.name.localeCompare(b.name);
    if (sortBy === 'name_tournament') return a.name_tournament.localeCompare(b.name_tournament);
    if (sortBy === 'modified') return new Date(b.updated_at) - new Date(a.updated_at);
    return 0;
  });

  const toggleSelectItem = (item) => {
    setSelectedItems(prev =>
      prev.find(selectedItem => selectedItem.id === item.id) ? prev.filter(selectedItem => selectedItem.id !== item.id) : [...prev, item]
    );
  };

  const toggleStar = (id) => {
    // Aquí iría la lógica para actualizar el estado starred
    console.log(`Toggle star for item ${id}`);
  };

  const handleCreateFolder = (values) => {
    // Aquí iría la lógica para agregar la carpeta a la base de datos
    try {
      console.log('Creating folder with values:', values);
      const result = window.electron.addFolder(values);
      toast.success('Carpeta creada exitosamente', {
        duration: 3000
      });
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      fetchFolders();
      closeModal('create');
    }
  };

  const handleUpdateFolder = (values) => {

    try {
      const result = window.electron.updateFolder({ id: modalState.currentData.id, ...values });
      toast.success('Carpeta actualizada exitosamente', {
        duration: 3000
      });
    } catch (error) {
      console.error('Error updating folder:', error);
    } finally {
      fetchFolders();
      closeModal('edit');
      setSelectedItems([]);
    }
  }

  const handleDeleteFolder = () => {
    // Aquí iría la lógica para eliminar la carpeta de la base de datos
    try {
      const result = window.electron.softDeleteFolder(modalState.currentData?.id);
      toast.success('Carpeta eliminada exitosamente', {
        duration: 3000
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
    } finally {
      fetchFolders();
      closeModal('delete');
      setSelectedItems([]);
    }
  }

  const openFolder = (id) => {
    // Aquí iría la lógica para abrir la carpeta
    navigate(`/matches/${id}`);
  };

  const fetchFolders = async () => {
    try {
      const allFolders = await window.electron.getFolders();
      console.log('Fetched folders:', allFolders);
      setFolders(allFolders);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchUsername = async () => {
    try {
      const user = await window.electron.getActiveSession();
      setUsername(user.username || '');
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const columns = [
    {
      header: "Nombre Carpeta",
      accessor: "name",
      render: (item) => (
        <div className="flex items-center">
          <FiFolder className="flex-shrink-0 h-5 w-5 text-indigo-500 mr-2" />
          <span>{item.name}</span>
          {item.starred && (
            <FiStar className="ml-2 flex-shrink-0 h-4 w-4 text-yellow-400 fill-current" />
          )}
        </div>
      ),
      headerClassName: "",
      cellClassName: "",
    },
    {
      header: "Liga/Torneo",
      accessor: "name_tournament",
    },
    {
      header: "Modificado",
      accessor: "updated_at",
      render: (item) => dayjs(item.updated_at).locale('es').format('DD/MM/YYYY HH:mm'),
    },
  ];

  useEffect(() => {
    Promise.all([fetchFolders(), fetchUsername()]);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <HeaderView title="Mis Carpetas">
        <button
          onClick={() => openModal('create')}
          className="flex items-center button font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
        >
          <FiPlus className="mr-2 h-5 w-5" />
          Nueva carpeta
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          <FiGrid className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          <FiList className="w-5 h-5" />
        </button>
        <Link 
          className='rounded-full size-9 flex items-center justify-center bg-indigo-100 font-bold'
          to="/profile-user"
        >
          <span className="text-indigo-700 font-bold text-sm">{initials || 'US'}</span>
        </Link>
      </HeaderView>

      {/* Toolbar */}
      <Toolbar
        searchQuery={searchQuery}
        selectedItems={selectedItems}
        setSearchQuery={setSearchQuery}
        setSortBy={setSortBy}
        sortBy={sortBy}
        openModal={openModal}
      />

      {/* Breadcrumb */}
      <Breadcrumb path={path} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {viewMode === 'grid' ? (
          <GridViewMode
            selectedItems={selectedItems}
            sortedItems={sortedItems}
            toggleStar={toggleStar}
            toggleSelectItem={toggleSelectItem}
            open={openFolder}
            type="folder"
          />
        ) : (
          <Table
            columns={columns}
            data={sortedItems}
            rowKey="id"
            selectedItems={selectedItems}
            onRowClick={toggleSelectItem}
            onRowDoubleClick={openFolder}
          />
        )}

      </main>

      {/* Status Bar */}
      <StatusBar
        allItems={folders}
        selectedItems={selectedItems}
      />

      {/* Modal para crear nueva carpeta */}
      <Modal
        isOpen={modalState.create}
        onClose={() => closeModal('create')}
        title="Editar carpeta"
      >
        <Form
          fields={fields}
          onSubmit={(values) => handleCreateFolder(values)}
          submitLabel="Crear carpeta"
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

      {/* Modal para editar carpeta */}
      <Modal
        isOpen={modalState.edit}
        onClose={() => closeModal('edit')}
        title="Editar carpeta"
      >
        <Form
          fields={fields}
          onSubmit={(values) => handleUpdateFolder(values)}
          initialValues={modalState.currentData || {}}
          submitLabel="Actualizar carpeta"
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

      {/* Modal para eliminar carpeta */}
      <Modal
        isOpen={modalState.delete}
        onClose={() => closeModal('delete')}
        title="Eliminar carpeta"
      >
        <div>
          <p>¿Estás seguro de que deseas eliminar la carpeta "{modalState.currentData?.name}"?</p>
        </div>
        <div className="bg-gray-50 px-6 py-3 flex justify-end gap-3 rounded-b-lg">
          <button
            type="button"
            className="button border-gray-300 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500"
            onClick={() => closeModal('delete')}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="button border-transparent font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:opacity-50"
            onClick={handleDeleteFolder}
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Folders;