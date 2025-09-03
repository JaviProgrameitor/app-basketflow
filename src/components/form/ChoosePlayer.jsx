
import React, { useEffect, useState } from 'react';
import Input from './Input.jsx';

const ChoosePlayer = ({ 
  dataTeam = {}, 
  handleAddPlayer = () => {}
}) => {
  const [players, setPlayers] = useState([]);
  const [playerSelected, setPlayerSelected] = useState({});
  const [customNumber, setCustomNumber] = useState('');

  const fetchPlayersByTeam = async (team_id, folder_id) => {
    try {
      const result = await window.electron.getPlayersByTeamIdAndFolderId(team_id, folder_id);
      setPlayers(result);
    } catch (error) {
      console.error('Error al obtener los jugadores:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddPlayer({
      ...playerSelected,
      number: Number(customNumber) ?? null
    })
  }

  useEffect(() => {
    fetchPlayersByTeam(dataTeam.team_id, dataTeam.folder_id);
  }, []);

  return (
    <div className="flex flex-col gap-4 my-4">
      <form onSubmit={handleSubmit}>
        {players.map((player, index) => (
          <label key={index} className={`flex items-center p-2 rounded-md cursor-pointer ${playerSelected.id === player.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
            <input 
              type="radio" 
              name={'player'} 
              required={true} 
              id={player.name} 
              value={player.id} 
              onClick={() => setPlayerSelected(player)} 
            />
            <span className="ml-2">
              {player.name}
            </span>
            <span className="mx-2 text-gray-500">#{player.number}</span>
            {
              playerSelected.id === player.id && (
                <Input
                  type="number"
                  name="number"
                  placeholder="Número de camiseta"
                  value={customNumber}
                  isForm={false}
                  setValue={setCustomNumber}
                />
              )
            }
          </label>
        ))}
        <button 
          type="submit" 
          className="w-full mt-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          
        >
          Seleccionar Jugador
        </button>
      </form>
    </div>
  );
}

export default ChoosePlayer;