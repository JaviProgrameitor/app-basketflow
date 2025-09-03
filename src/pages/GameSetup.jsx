
import React, { useEffect, useState } from 'react';
import { data, Link, useNavigate, useParams } from 'react-router';
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { useBcrypt } from '../hooks';

import { FaUsers, FaTrophy, FaRegClock, FaClipboard } from "react-icons/fa";
import Input from '../components/form/Input.jsx';

const GameSetup = () => {

  const navigate = useNavigate();

  const { hashPassword } = useBcrypt();

  const { match_id, folder_id } = useParams();
  const [ match, setMatch ] = useState({});
  const [ homeTeam, setHomeTeam ] = useState("");
  const [ awayTeam, setAwayTeam ] = useState("");
  const [ dataForm, setDataForm ] = useState({
    number_game: '',
    referee_main: '',
    referee1: '',
    referee2: '',
    anotator: '',
    assistant_anotator: '',
    timekeeper: '',
    clock_operator: '',
    password_crew_chief: ''
  });

  const handleUpdateMatch = async (e) => {
    e.preventDefault();
    const password_crew_chief= await hashPassword(dataForm.password_crew_chief)
    const matchData = {
      ...match,
      ...dataForm,
      password_crew_chief,
      status: 'playing'
    };

    try {
      const result = window.electron.updateMatch(matchData);
      navigate(`/game-tracker/${matchData.id}`);
    } catch (error) {
      console.error('Error al actualizar el partido:', error);
    }
  }

  const handleOnChange = (value, name) => {
    setDataForm({
      ...dataForm,
      [name]: value
    });
  }

  const fetchMatch = async () => {
    try {
      const result = await window.electron.getMatchById(match_id);
      console.log('Partido obtenido:', result);
      setMatch(result);
      setHomeTeam(!result.home_team_custom_name ? result.home_team_name : result.home_team_custom_name);
      setAwayTeam(!result.away_team_custom_name ? result.away_team_name : result.away_team_custom_name);
    } catch (error) {
      console.error('Error al obtener el partido:', error);
    }
  }

  useEffect(()  => {
    fetchMatch();
  }, [])

  return (
    <div className="h-screen bg-gradient-to-br overflow-y-auto overflow-x-hidden from-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className='flex'>
            <Link to={`/matches/${folder_id}`} className="inline-flex items-center gap-2">
              <FaArrowAltCircleLeft className="size-7 hover:text-indigo-800 inline" />
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-indigo-900">Configuración del Partido</h1>
          <p className="text-indigo-600">
            Completa los datos para finalizar la configuración del encuentro
          </p>
        </div>

        {/* Teams Display */}
        <div className="rounded-lg shadow bg-white border border-indigo-200">
          <div className="rounded-t-lg px-6 py-4 bg-indigo-600 text-white">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <FaUsers className="h-5 w-5" />
              Equipos Enfrentados
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center gap-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2" style={{ backgroundColor: match.home_team_primary_color }}>
                  {homeTeam[0] || ''}
                </div>
                <h3 className="font-semibold text-lg text-indigo-900">{homeTeam}</h3>
              </div>
              <div className="text-2xl font-bold text-indigo-600">VS</div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2" style={{ backgroundColor: match.away_team_primary_color }}>
                  {awayTeam[0] || ''}
                </div>
                <h3 className="font-semibold text-lg text-indigo-900">{awayTeam}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="rounded-lg shadow bg-white border border-indigo-200">
          <div className="rounded-t-lg px-6 py-4 bg-indigo-600 text-white">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <FaTrophy className="h-5 w-5" />
              Información del Partido
            </h2>
            <p className="text-sm opacity-90 text-indigo-100">
              Ingresa los detalles del torneo y el encuentro
            </p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                title="Número de Partido"
                name="gameNumber"
                type="number"
                placeholder="Ingrese el número del partido"
                value={dataForm.number_game}
                setValue={(value) => handleOnChange(value, 'number_game')}
                min={1}
              />
            </div>
          </div>
        </div>

        {/* Officials Form */}
        <div className="rounded-lg shadow bg-white border border-indigo-200">
          <div className="rounded-t-lg px-6 py-4 bg-indigo-600 text-white">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <FaClipboard className="h-5 w-5" />
              Oficiales del Partido
            </h2>
            <p className="text-sm opacity-90 text-indigo-100">
              Asigna los árbitros y personal técnico
            </p>
          </div>
          <div className="p-6 space-y-6">
            {/* Referees Section */}
            <div>
              <h3 className="text-lg font-semibold text-indigo-900 mb-4">Árbitros</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input 
                  title="Árbitro Principal"
                  name="mainReferee"
                  type="text"
                  placeholder="Ingrese el árbitro principal"
                  value={dataForm.referee_main}
                  setValue={(value) => handleOnChange(value, 'referee_main')}
                />
                <Input 
                  title="Árbitro 1"
                  name="referee1"
                  type="text"
                  placeholder="Ingrese el árbitro 1"
                  value={dataForm.referee1}
                  setValue={(value) => handleOnChange(value, 'referee1')}
                />
                <Input 
                  title="Árbitro 2"
                  name="referee2"
                  type="text"
                  placeholder="Ingrese el árbitro 2"
                  value={dataForm.referee2}
                  setValue={(value) => handleOnChange(value, 'referee2')}
                />
              </div>
            </div>

            <hr className="my-4 border-t bg-indigo-200" />

            {/* Technical Staff Section */}
            <div>
              <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                <FaRegClock className="h-5 w-5" />
                Personal Técnico
              </h3>
              {/* Campo de contraseña del Crew Chief */}
              <Input
                title="Contraseña del Crew Chief"
                name="crewChiefPassword"
                type="password"
                containerClassName="mb-4"
                placeholder="Ingrese la contraseña del Crew Chief"
                value={dataForm.password_crew_chief}
                setValue={(value) => handleOnChange(value, 'password_crew_chief')}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  title="Anotador"
                  name="scorer"
                  type="text"
                  placeholder="Ingrese el nombre del anotador"
                  value={dataForm.anotator}
                  setValue={(value) => handleOnChange(value, 'anotator')}
                />
                <Input
                  title="Anotador Asistente"
                  name="assistantScorer"
                  type="text"
                  placeholder="Ingrese el nombre del anotador asistente"
                  value={dataForm.assistant_anotator}
                  setValue={(value) => handleOnChange(value, 'assistant_anotator')}
                />
                <Input
                  title="Cronometrista"
                  name="timekeeper"
                  type="text"
                  placeholder="Ingrese el nombre del cronometrista"
                  value={dataForm.timekeeper}
                  setValue={(value) => handleOnChange(value, 'timekeeper')}
                />
                <Input
                  title="Operador de Reloj de Tiro"
                  name="shotClockOperator"
                  type="text"
                  placeholder="Ingrese el nombre del operador de reloj de tiro"
                  value={dataForm.clock_operator}
                  setValue={(value) => handleOnChange(value, 'clock_operator')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            className="rounded px-5 py-2 font-medium border border-indigo-300 text-indigo-700 hover:bg-indigo-50 bg-transparent transition"
          >
            Guardar como Borrador
          </button>
          <button
            type="button"
            onClick={handleUpdateMatch}
            disabled={!dataForm.number_game || !dataForm.referee_main || !dataForm.anotator || !dataForm.password_crew_chief}
            className="rounded px-8 py-2 font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            Finalizar Configuración
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameSetup;