
import React from 'react';
import Input from './Input.jsx';

const MatchForm = ({newMatch, handleOnChange, handleAddMatch, closeModals, teams}) => {
  return (
    <React.Fragment>
      <div className="px-6">
        <Input
          name='date'
          title="Fecha"
          type="date"
          placeholder={"Fecha del partido"}
          value={newMatch.date}
          setValue={handleOnChange}
        />
        <Input
          name='time_start'
          title="Hora"
          type="time"
          placeholder={"Hora del partido"}
          value={newMatch.time_start}
          setValue={handleOnChange}
        />
        <Input
          name='location'
          title="Ubicación"
          type="text"
          placeholder={"Ubicación del partido"}
          value={newMatch.location}
          setValue={handleOnChange}
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="match-home" className="block text-sm font-medium text-gray-700">
              Equipo Local
            </label>
            <select
              id="match-home"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newMatch.home_team_id}
              onChange={(e) => handleOnChange(parseInt(e.target.value), 'home_team_id')}
            >
              <option value="">Seleccionar equipo</option>
              {teams.map(team => (
                <option key={team.team_id} value={team.team_id}>{!team.custom_name ? team.name : team.custom_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="match-away" className="block text-sm font-medium text-gray-700">
              Equipo Visitante
            </label>
            <select
              id="match-away"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newMatch.away_team_id}
              onChange={(e) => handleOnChange(parseInt(e.target.value), 'away_team_id')}
            >
              <option value="">Seleccionar equipo</option>
              {teams.map(team => (
                <option key={team.team_id} value={team.team_id}>{!team.custom_name ? team.name : team.custom_name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="px-6 py-3 flex justify-end rounded-b-lg">
        <button
          type="button"
          className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={closeModals}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          onClick={handleAddMatch}
          disabled={!newMatch.date || !newMatch.time_start || !newMatch.location || !newMatch.home_team_id || !newMatch.away_team_id || newMatch.home_team_id === newMatch.away_team_id}
        >
          Programar Partido
        </button>
      </div>
    </React.Fragment>
  )
}

export default MatchForm;