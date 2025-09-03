
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { times, allowedTimeouts, typesPoints, typesFouls, quartersToHalfs, predefinedCauses, typesParticipation } from '../data/match.js';
import { useBcrypt, useModal } from '../hooks'
import { Toaster, toast } from 'sonner'
import { colorQuarter } from '../data/match.js';
import { calculatePoints } from '../helpers/match.js';

import HeaderGameTracker from '../components/ui/HeaderGameTracker.jsx';
import ProgressiveScore from '../components/ui/ProgressiveScore.jsx';
import TeamCard from '../components/ui/TeamCard.jsx';
import Modal from '../components/ui/Modal.jsx';
import ChoosePlayer from '../components/form/ChoosePlayer.jsx';
import Form from '../components/form/Form.jsx';
import ParticipationSymbol from '../components/ui/ParticipationSymbol.jsx';

const LiveGameTracker = () => {
  const { match_id } = useParams();
  const navigate = useNavigate();

  const { comparePassword } = useBcrypt();
  const { modalState, openModal, closeModal } = useModal({
    addFoul: false,
    addPoint: false,
    addPlayer: false,
    addTimeout: false,
    deleteEvent: false,
    deletePlayer: false,
    nextQuarter: false,
    finishMatch: false,
    activateLastFourMinutes: false,
    validatePassword: false,
    changeParticipationPlayer: false,
    currentData: null
  });

  // States for managing cause of deletion
  const [cause, setCause] = useState("");
  const [customCause, setCustomCause] = useState("");

  const isCustom = cause === "Otra";

  // States for managing players
  const [addPlayerMode, setAddPlayerMode] = useState('new'); // 'new' or 'select'

  const [playerSelected, setPlayerSelected] = useState([]);
  const [players, setPlayers] = useState([]);

  // States for managing match and teams
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [match, setMatch] = useState({});
  const [homeTeam, setHomeTeam] = useState({
    id: null,
    name: null,
    primary_color: null
  });
  const [awayTeam, setAwayTeam] = useState({
    id: null,
    name: null,
    primary_color: null
  });
  const [events, setEvents] = useState([]);

  const columns = [
    {
      header: "Jugador",
      accessor: "player_name"
    },
    {
      header: "N°",
      accessor: "jersey_number"
    },
    {
      header: "E",
      accessor: "participation",
      cellClassName: 'text-center flex items-center justify-center cursos-pointer',
      render: (row) => {
        return (
          <div className='h-4 w-4 lg:h-5 relative cursor-pointer'>
            <ParticipationSymbol participation={row.participation} />
          </div>
        )
      },
      onDoubleClickTd: (row) => {
        openModal('changeParticipationPlayer', row);
      }
    },
    {
      header: "1",
      render: (row) => {
        const fouls = events.filter(event => event.player_id === row.player_id && event.event_type === 'foul');
        return <span className={`font-medium ${colorQuarter[fouls[0]?.period]?.text}`}>{fouls[0]?.foul_type}</span>
      },
      onDoubleClickTd: (row) => {
        const fouls = events.filter(event => event.player_id === row.player_id && event.event_type === 'foul');
        if(fouls[0] && !match.last_four_minutes) {
          openModal('validatePassword', {...fouls[0], modalTitle: 'Eliminar Falta'});
        }
      }
    },
    {
      header: "2",
      render: (row) => {
        const fouls = events.filter(event => event.player_id === row.player_id && event.event_type === 'foul');
        return <span className={`font-medium ${colorQuarter[fouls[1]?.period]?.text}`}>{fouls[1]?.foul_type}</span>
      },
      onDoubleClickTd: (row) => {
        const fouls = events.filter(event => event.player_id === row.player_id && event.event_type === 'foul');
        if(fouls[1] && !match.last_four_minutes) {
          openModal('validatePassword', {...fouls[1], modalTitle: 'Eliminar Falta'});
        }
      }
    },
    {
      header: "3",
      render: (row) => {
        const fouls = events.filter(event => event.player_id === row.player_id && event.event_type === 'foul');
        return <span className={`font-medium ${colorQuarter[fouls[2]?.period]?.text}`}>{fouls[2]?.foul_type}</span>
      },
      onDoubleClickTd: (row) => {
        const fouls = events.filter(event => event.player_id === row.player_id && event.event_type === 'foul');
        if(fouls[2] && !match.last_four_minutes) {
          openModal('validatePassword', {...fouls[2], modalTitle: 'Eliminar Falta'});
        }
      }
    },
    {
      header: "4",
      render: (row) => {
        const fouls = events.filter(event => event.player_id === row.player_id && event.event_type === 'foul');
        return <span className={`font-medium ${colorQuarter[fouls[3]?.period]?.text}`}>{fouls[3]?.foul_type}</span>
      },
      onDoubleClickTd: (row) => {
        const fouls = events.filter(event => event.player_id === row.player_id && event.event_type === 'foul');
        if(fouls[3] && !match.last_four_minutes) {
          openModal('validatePassword', {...fouls[3], modalTitle: 'Eliminar Falta'});
        }
      }
    },
    {
      header: "5",
      render: (row) => {
        const fouls = events.filter(event => event.player_id === row.player_id && event.event_type === 'foul');
        return <span className={`font-medium ${colorQuarter[fouls[4]?.period]?.text}`}>{fouls[4]?.foul_type}</span>
      },
      onDoubleClickTd: (row) => {
        const fouls = events.filter(event => event.player_id === row.player_id && event.event_type === 'foul');
        if(fouls[4] && !match.last_four_minutes) {
          openModal('validatePassword', {...fouls[4], modalTitle: 'Eliminar Falta'});
        }
      }
    }
  ];

  const passwordForm = [
    { 
      name: "password_crew_chief", 
      label: "Contraseña Crew Chief", 
      type: "password", 
      props: {
        placeholder: "Ingrese la contraseña del Crew Chief",
        required: true,
        autoFocus: true,
      }
    },
  ];

  const playerForm = [
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

  const timeoutForm = [
    {
      name: 'minute',
      label: 'Minuto',
      type: 'number',
      props: {
        placeholder: 'Ej: 5',
        max: 10,
        required: true
      }
    }
  ]

  const validatePassword = async (password) => {
    try {
      const isValid = await comparePassword(password, match.password_crew_chief);
      if (isValid) {
        closeModal('validatePassword');
        openModal('deleteEvent', modalState.currentData);
      } else {
        toast.error('Contraseña incorrecta');
      }
    } catch (error) {
      console.error('Error al validar la contraseña:', error);
      closeModal('validatePassword');
      toast.error('Error al validar la contraseña');
    }
  }

  const togglePlayerSelected = (id_player) => {
    setPlayerSelected(prev =>
      prev.includes(id_player) ? [] : [id_player]
    );
  }

  const handleAddPlayer = async (data) => {
    if(addPlayerMode === 'new') {
      try {
        const newPlayer = await window.electron.addPlayer(modalState.currentData.id, match.folder_id, data);
        const playerToTeam = await window.electron.addMatchPlayer(match.id, newPlayer);
        fetchPlayersInMatch();
      } catch (error) {
        console.error('Error al agregar el jugador:', error);
      } finally {
        closeModal('addPlayer');
        setAddPlayerMode('new');
      }
    }

    else if(addPlayerMode === 'select') {
      try {
        const playerToTeam = await window.electron.addMatchPlayer(match.id, data.id, data.number);
        fetchPlayersInMatch();  
      } catch (error) {
        console.error('Error al agregar el jugador:', error);
      } finally {
        closeModal('addPlayer');
        setAddPlayerMode('new');
      }
    }
  }

  const handleDeletePlayer = async () => {
    try {
      await window.electron.removeMatchPlayer(match.id, playerSelected[0]?.player_id);
    } catch (error) {
      console.error('Error al eliminar el jugador:', error);
    } finally {
      closeModal('deletePlayer');
      setPlayerSelected([]);
      fetchPlayersInMatch();
    }
  }

  const handleAddPoint = async (point) => {
    try {
      const result = await window.electron.addPointsEvent({
        match_id: match.id,
        player_id: playerSelected[0]?.player_id,
        event_type: 'point',
        point_type: point.type,
        point_value: point.value,
        team_id: modalState.currentData?.id,
        period: currentQuarter
      });
      console.log('Evento de canasta agregado:', result);
    } catch (error) {
      console.error('Error al agregar el evento de canasta:', error);
    } finally {
      closeModal('addPoint');
      setPlayerSelected([]);
      fetchMatchEvents();
    }
  }

  const handleAddFoul = async (foul) => {
    try {
      const result = await window.electron.addFoulEvent({
        match_id: match.id,
        player_id: playerSelected[0]?.player_id,
        event_type: 'foul',
        foul_type: foul,
        team_id: modalState.currentData?.id,
        period: currentQuarter
      });
      console.log('Evento de falta agregado:', result);
    } catch (error) {
      console.error('Error al agregar el evento de falta:', error);
    } finally {
      closeModal('addFoul');
      setPlayerSelected([]);
      fetchMatchEvents();
    }
  }

  const handleAddTimeout = async (data) => {
    try {
      const result = await window.electron.addTimeoutEvent({
        match_id: match.id,
        team_id: modalState.currentData?.id,
        period: currentQuarter,
        minute: data.minute
      });
      console.log('Evento de tiempo fuera agregado:', result);
    } catch (error) {
      console.error('Error al agregar el evento de tiempo fuera:', error);
    } finally {
      closeModal('addTimeout');
      fetchMatchEvents();
    }
  }

  const handleDeleteEvent = async () => {
    try {
      const eventData = {
        id: modalState.currentData.id,
        cause: customCause || cause
      };
      const result = await window.electron.softDeleteMatchEvent(eventData);
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
    } finally {
      closeModal('deleteEvent');
      setCustomCause("");
      setCause("");
      fetchMatchEvents();
      setPlayerSelected([]);
    }
  }

  const nextPeriod = async () => {
    try {
      const result = await window.electron.nextPeriod(match.id);
      console.log('Cambio de cuarto exitoso:', result);
    } catch (error) {
      console.error('Error al cambiar de cuarto:', error);
    } finally {
      closeModal('nextQuarter');
      fetchMatch();
      setPlayerSelected([]);
    }
  }

  const handleActivateLastFourMinutes = async () => {
    try {
      const result = await window.electron.activateLastFourMinutes(match.id);
      console.log('Últimos 4 minutos activados:', result);
    } catch (error) {
      console.error('Error al activar los últimos 4 minutos:', error);
    } finally {
      closeModal('activateLastFourMinutes');
      fetchMatch();
    }
  }

  const handleFinishMatch = async () => {
    try {
      const { accumulated: home_score } = calculatePoints(events.filter(event => event.team_id === homeTeam.id && event.event_type === 'point'));
      const { accumulated: away_score } = calculatePoints(events.filter(event => event.team_id === awayTeam.id && event.event_type === 'point'));

      const result = await window.electron.updateMatch({
        ...match,
        home_score,
        away_score,
        winner_team_id: home_score > away_score ? homeTeam.id : awayTeam.id,
        status: 'finalizing'
      });
      navigate(`/finish-game/${match_id}`)
    } catch (error) {
      console.error('Error al finalizar el partido:', error);
    } finally {
      closeModal('finishMatch');
      fetchMatch();
    }
  }

  const handleChangeParticipation = async (newParticipation) => {
    try {
      const result = await window.electron.changeParticipationPlayer(
        match.id,
        modalState.currentData.player_id,
        newParticipation
      );
      console.log('Participación del jugador actualizada:', result);
    } catch (error) {
      console.error('Error al actualizar la participación del jugador:', error);
    } finally {
      closeModal('changeParticipationPlayer');
      fetchPlayersInMatch();
    }
  }

  const fetchMatch = async () => {
    try {
      const result = await window.electron.getMatchById(match_id);
      console.log('Partido:', result);
      setMatch(result);
      setCurrentQuarter(result.period);
      setHomeTeam({
        id: result.home_team_id,
        name: !result.home_team_custom_name ? result.home_team_name : result.home_team_custom_name,
        primary_color: result.home_team_primary_color
      });
      setAwayTeam({
        id: result.away_team_id,
        name: !result.away_team_custom_name ? result.away_team_name : result.away_team_custom_name,
        primary_color: result.away_team_primary_color
      });
    } catch (error) {
      console.error('Error al obtener el partido:', error);
    }
  }

  const fetchPlayersInMatch = async () => {
    try {
      const result = await window.electron.getMatchPlayers(match_id);
      console.log('Jugadores del partido:', result);
      setPlayers(result);
      // Aquí puedes procesar los jugadores obtenidos
    } catch (error) {
      console.error('Error al obtener los jugadores del partido:', error);
    }
  }

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

  useEffect(() => {
    Promise.all([
      fetchMatch(),
      fetchPlayersInMatch(),
      fetchMatchEvents()
    ]);
  }, []);
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Toaster position="top-center" richColors />
      {/* Header */}
      <HeaderGameTracker 
        folderId={match?.folder_id} 
        currentQuarter={{name: times[currentQuarter - 1],  number: currentQuarter}} 
        openModal={openModal}
        lastFourMinutes={match.last_four_minutes ?? 0}
      />

      {/* Main Content */}
      <main className='h-[calc(100vh-70px)] grid grid-cols-9 grid-rows-1 w-full overflow-x-hidden overflow-y-hidden'>
        <TeamCard 
          teamData={homeTeam} 
          isHome={true}
          allowedTimeouts={allowedTimeouts[currentQuarter - 1]}
          columnsTable={columns}
          openModal={openModal}
          players={players.filter(player => player.team_id === homeTeam.id)}
          foulsByQuarter={events.filter(event => event.team_id === homeTeam.id && event.event_type === 'foul' && event.period === currentQuarter)}
          timeoutsByQuarter={events.filter(event => event.team_id === homeTeam.id && event.event_type === 'timeout' && quartersToHalfs[currentQuarter].includes(event.period))}
          points={events.filter(event => event.team_id === homeTeam.id && event.event_type === 'point')}
          playerSelected={playerSelected}
          togglePlayerSelected={togglePlayerSelected}
          lastFourMinutes={match.last_four_minutes}
          currentQuarter={currentQuarter}
        />
        <ProgressiveScore
          pointsHome={events.filter(event => event.team_id === homeTeam.id && event.event_type === 'point')}
          pointsAway={events.filter(event => event.team_id === awayTeam.id && event.event_type === 'point')}
          openModal={openModal}
          lastFourMinutes={match.last_four_minutes}
          currentQuarter={currentQuarter}
        />
        <TeamCard 
          teamData={awayTeam}
          allowedTimeouts={allowedTimeouts[currentQuarter - 1]}
          columnsTable={columns}
          openModal={openModal}
          players={players.filter(player => player.team_id === awayTeam.id)}
          foulsByQuarter={events.filter(event => event.team_id === awayTeam.id && event.event_type === 'foul' && event.period === currentQuarter)}
          timeoutsByQuarter={events.filter(event => event.team_id === awayTeam.id && event.event_type === 'timeout' && quartersToHalfs[currentQuarter].includes(event.period))}
          points={events.filter(event => event.team_id === awayTeam.id && event.event_type === 'point')}
          playerSelected={playerSelected}
          togglePlayerSelected={togglePlayerSelected}
          lastFourMinutes={match.last_four_minutes}
          currentQuarter={currentQuarter}
        />
      </main>

      {/* Modal Agregar Jugador */}
      <Modal
        isOpen={modalState.addPlayer} // Cambiar a true para abrir el modal
        onClose={() => closeModal('addPlayer')} // Función para cerrar el modal
        title="Agregar Jugador"
      >
        <div>
          <div className='grid grid-cols-2 mb-2'>
            <div className={`flex items-center justify-center cursor-pointer border border-gray-300 py-1 rounded-l-md ${addPlayerMode == 'new' && 'bg-indigo-500 text-white'}`} onClick={() => setAddPlayerMode('new')}>
              Nuevo
            </div>
            <div className={`flex items-center justify-center cursor-pointer border border-gray-300 py-1 rounded-r-md ${addPlayerMode == 'select' && 'bg-indigo-500 text-white'}`} onClick={() => setAddPlayerMode('select')}>
              Seleccionar
            </div>
          </div>
          {
            addPlayerMode === 'new' ? (
              <Form 
                fields={playerForm}
                onSubmit={(values) => handleAddPlayer({...values, number: Number(values.number)})}
                submitLabel="Agregar Jugador"
                actionsRender={() => (
                  <button
                    type="button"
                    className="button border-gray-300 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500"
                    onClick={() => closeModal('addPlayer')}
                  >
                    Cancelar
                  </button>
                )}
              />
            ) : (
              <ChoosePlayer 
                dataTeam={{
                  team_id: modalState.currentData?.id,
                  folder_id: match?.folder_id
                }}
                handleAddPlayer={handleAddPlayer}
                closeModal={() => closeModal('addPlayer')}
              />
            )
          }
        </div>
      </Modal>

      {/* Modal Eliminar Jugador */}
      <Modal
        isOpen={modalState.deletePlayer} // Cambiar a true para abrir el modal
        onClose={() => closeModal('deletePlayer')} // Función para cerrar el modal
        title="Eliminar Jugador"
      >
        <div>
          <p>¿Estás seguro de que deseas eliminar al jugador seleccionado?</p>
          <div className='flex justify-end space-x-2 mt-4 pb-3'>
            <button 
              onClick={() => closeModal('deletePlayer')}
              className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
            >
              Cancelar
            </button>
            <button 
              onClick={handleDeletePlayer}
              className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal para Agregar Canastas */}
      <Modal
        isOpen={modalState.addPoint} // Cambiar a true para abrir el modal
        onClose={() => closeModal('addPoint')} // Función para cerrar el modal
        title="Agregar Canasta"
      >
        <div>
          <p>Selecciona el tipo de canasta:</p>
          <div className='grid grid-cols-3 gap-4 mt-4'>
            {
              typesPoints.map((type, index) => (
                <button 
                  key={index} 
                  className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                  onClick={() => handleAddPoint(type)}
                >
                  {type.name} {type.value} Pts
                </button>
              ))
            }
          </div>
        </div>
      </Modal>

      {/* Modal para Agregar Faltas */}
      <Modal
        isOpen={modalState.addFoul} // Cambiar a true para abrir el modal
        onClose={() => closeModal('addFoul')} // Función para cerrar el modal
        title="Agregar Falta"
      >
        <div>
          <p>Selecciona el tipo de falta:</p>
          <div className='grid grid-cols-2 gap-4 mt-4'>
            {
              typesFouls.map((foul, index) => (
                <button 
                  key={index} 
                  className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
                  onClick={() => handleAddFoul(foul)} // Aquí deberías implementar la lógica para agregar la falta
                >
                  {foul}
                </button>
              ))
            }
          </div>
        </div>
      </Modal>

      {/* Modal para Agregar Tiempo Fuera */}
      <Modal
        isOpen={modalState.addTimeout} // Cambiar a true para abrir el modal
        onClose={() => closeModal('addTimeout')} // Función para cerrar el modal
        title="Agregar Tiempo Fuera"
      >
        <Form 
          fields={timeoutForm}
          onSubmit={(values) => handleAddTimeout(values)}
          submitLabel="Agregar Tiempo Fuera"
          actionsRender={() => (
            <button
              type="button"
              className="button border-gray-300 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500"
              onClick={() => closeModal('addTimeout')}
            >
              Cancelar
            </button>
          )}
        />
      </Modal>

      {/* Modal para Eliminar Evento */}
      <Modal
        isOpen={modalState.deleteEvent} 
        onClose={() => closeModal('deleteEvent')} 
        title={ modalState.currentData?.modalTitle || "" }
      >
        <div className=''>
        <p className="text-sm text-gray-600 mb-4">
          Selecciona la causa de la eliminación. Si no corresponde, escribe la causa.
        </p>
        <div className="space-y-2 mb-4">
          {predefinedCauses.map((c) => (
            <label key={c} className="w-max flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="delete-cause"
                value={c}
                checked={cause === c}
                onChange={() => { setCause(c); setCustomCause(""); }}
                className="accent-indigo-600"
              />
              <span>{c}</span>
            </label>
          ))}
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="delete-cause"
              value="Otra"
              checked={cause === "Otra"}
              onChange={() => setCause("Otra")}
              className="accent-indigo-600"
            />
            <span>Otra</span>
          </label>
          {isCustom && (
            <input
              type="text"
              placeholder="Escribe la causa..."
              value={customCause}
              onChange={e => setCustomCause(e.target.value)}
              className="block w-full border rounded px-3 py-2 mt-2 border-indigo-300 focus:border-indigo-600 outline-none"
            />
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {closeModal('deleteEvent'); setCustomCause("");}}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
            type="button"
          >
            Cancelar
          </button>
          <button
            onClick={handleDeleteEvent}
            disabled={!cause || (isCustom && !customCause)}
            className={`px-4 py-2 rounded text-white font-semibold transition ${
              cause && (!isCustom || (isCustom && customCause))
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            type="button"
          >
            Eliminar
          </button>
        </div>
        </div>
      </Modal>

      {/* Modal para Cambiar de Cuarto */}
      <Modal
        isOpen={modalState.nextQuarter} // Cambiar a true para abrir el modal
        onClose={() => closeModal('nextQuarter')} // Función para cerrar el modal
        title="Cambiar de Cuarto"
      >
        <div>
          {
            currentQuarter === 4 ? (
              <p className='text-red-600'>¿Estás seguro de que deseas agregar tiempo extra?</p>
            ) : (
              <p>¿Estás seguro de que deseas cambiar al siguiente cuarto?</p>
            )
          }
          <div className='flex justify-end space-x-2 mt-4 pb-3'>
            <button 
              onClick={() => closeModal('nextQuarter')}
              className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
            >
              Cancelar
            </button>
            <button 
              onClick={nextPeriod}
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
              Cambiar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal para Terminar Partido */}
      <Modal
        isOpen={modalState.finishMatch} // Cambiar a true para abrir el modal
        onClose={() => closeModal('finishMatch')} // Función para cerrar el modal
        title="Terminar Partido"
      >
        <div>
          <p>¿Estás seguro de que deseas terminar el partido?</p>
          <div className='flex justify-end space-x-2 mt-4 pb-3'>
            <button 
              onClick={() => closeModal('finishMatch')}
              className='button bg-gray-300 rounded hover:bg-gray-400'
            >
              Cancelar
            </button>
            <button
              className='button bg-green-600 text-white rounded hover:bg-green-700'
              onClick={handleFinishMatch}
            >
              Terminar Partido
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal para Validar Contraseña */}
      <Modal
        isOpen={modalState.validatePassword} // Cambiar a true para abrir el modal
        onClose={() => closeModal('validatePassword')} // Función para cerrar el modal
        title="Validar Contraseña"
      >
        <Form 
          fields={passwordForm}
          onSubmit={({password_crew_chief}) => validatePassword(password_crew_chief)}
          submitLabel='Validar'
          actionsRender={() => (
            <button
              type='button'
              onClick={() => closeModal('validatePassword')}
              className='button bg-gray-300 rounded hover:bg-gray-400'
            >
              Cancelar
            </button>
          )}
          closeModal={() => closeModal('validatePassword')}
        />
      </Modal>

      {/* Modal para Activar Últimos 4 Minutos */}
      <Modal
        isOpen={modalState.activateLastFourMinutes} // Cambiar a true para abrir el modal
        onClose={() => closeModal('activateLastFourMinutes')} // Función para cerrar el modal
        title="Activar Últimos 4 Minutos"
      >
        <div>
          <p>¿Estás seguro de que deseas activar los últimos 4 minutos?</p>
          <div className='flex justify-end space-x-2 mt-4 pb-3'>
            <button
              onClick={() => closeModal('activateLastFourMinutes')}
              className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
            >
              Cancelar
            </button>
            <button
              onClick={handleActivateLastFourMinutes}
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
              Activar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalState.changeParticipationPlayer}
        onClose={() => closeModal('changeParticipationPlayer')}
        title="Cambiar Participación del Jugador"
      >
        <div>
          <p>Selecciona el tipo de falta:</p>
          <div className='grid grid-cols-3 gap-4 mt-4'>
            {
              Object.values(typesParticipation).map((participation, index) => (
                <button
                  key={index}
                  className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
                  onClick={() => handleChangeParticipation(participation.value)} // Aquí deberías implementar la lógica para cambiar la participación
                >
                  {participation.label}
                </button>
              ))
            }
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default LiveGameTracker;