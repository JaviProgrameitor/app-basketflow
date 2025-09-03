
import React, { useEffect, useState } from 'react';
import Input from '../components/form/Input.jsx';
import { Link, useNavigate, useParams } from 'react-router';
import { FaArrowCircleLeft } from 'react-icons/fa';

const FinishMatch = () => {
  const navigate = useNavigate();

  const { match_id } = useParams();
  const [match, setMatch] = useState({});
  const [homeTeam, setHomeTeam] = useState({});
  const [awayTeam, setAwayTeam] = useState({});
  const [timeEnd, setTimeEnd] = useState('');

  const handleFinishMatch = async () => {

    const matchData = {
      ...match,
      time_end: timeEnd,
      status: 'completed'
    };

    try {
      const result = await window.electron.updateMatch(matchData);
      navigate(`/matches/${match.folder_id}`);
    } catch (error) {
      console.error('Error al finalizar el partido:', error);
    }
  }

  const fetchMatch = async () => {
    try {
      const result = await window.electron.getMatchById(match_id);
      console.log('Partido:', result);
      setMatch(result);
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

  useEffect(() => {
    fetchMatch();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4 relative">
      <Link to={`/matches/${match.folder_id}`} className="absolute top-6 left-8 flex items-center hover:text-indigo-600 lg:top-8 lg:text-xl">
        <FaArrowCircleLeft className="h-5 w-5 mr-2" />
        Ir a Partidos
      </Link>
      <h1 className="text-2xl font-bold mb-4 text-center text-balance">{homeTeam.name} VS {awayTeam.name}</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md overflow-auto">
        {/* Aquí puedes agregar el formulario de configuración del juego */}
        <form>
          <Input
            name='time_end'
            title="Hora de Finalización"
            type="time"
            placeholder={"Hora de finalización del partido"}
            value={timeEnd}
            setValue={setTimeEnd}
          />
          <div className="mt-4">
            <button
              type="button"
              onClick={handleFinishMatch}
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Finalizar Partido
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FinishMatch;