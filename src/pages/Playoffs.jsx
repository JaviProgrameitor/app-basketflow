import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Toaster, toast } from 'sonner'
import { matchStates } from '../data/match';
import { seriesStates } from '../data/series';
import dayjs from 'dayjs';

import HeaderView from '../components/ui/HeaderView.jsx';

// Componente Playoffs
// Props:
// - folderId (requerido): ID del torneo/carpeta
export default function Playoffs() {
  const { folder_id } = useParams();

  const [loading, setLoading] = useState(false);
  const [series, setSeries] = useState([]);
  const [matchesBySeries, setMatchesBySeries] = useState({});
  const [newMatchForm, setNewMatchForm] = useState({}); // { [seriesId]: { date, time_start, location } }

  const primaryBtn =
    'inline-flex items-center button bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50';
  const secondaryBtn =
    'inline-flex items-center button border border-indigo-600 text-indigo-600 hover:bg-indigo-50';
  const card =
    'bg-white shadow rounded-lg p-4 border border-gray-100';
  const label = 'block text-sm font-medium text-gray-700 mb-1';
  const input =
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm';

  const loadSeries = async () => {
    const data = await window.electron.getSeriesByFolder(folder_id);
    console.log('Series obtenidas:', data);
    setSeries(data);
    const map = {};
    for (const s of data) {
      map[s.id] = await window.electron.getMatchesBySeries(s.id);
    }
    setMatchesBySeries(map);
  };

  useEffect(() => {
    try {
      setLoading(true);
      loadSeries();
    } catch (e) {
      toast.error(e.message || 'Error al cargar los playoffs');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder_id]);

  const handleGenerateSemifinals = async () => {
    try {
      setLoading(true);
      const result = await window.electron.ensureSemifinals(folder_id);
      if (!result.ok) throw new Error(result.message);
      loadSeries();
      toast.success('Semifinales generadas correctamente.');
    } catch (e) {
      toast.error(e.message || 'No se pudieron generar semifinales');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFinal = async () => {
    try {
      setLoading(true);
      const result = await window.electron.ensureFinal(folder_id);
      if (!result.ok) throw new Error(result.message);
      loadSeries();
      toast.success('Final generada correctamente.');
    } catch (e) {
      toast.error(e.message || 'No se pudo generar la final (verifica que ambas semifinales tengan ganador).');
    } finally {
      setLoading(false);
    }
  };

  const handleRecalcSeries = async (seriesId) => {
    try {
      setLoading(true);
      await window.electron.updateSeriesFromMatches(seriesId);
      loadSeries();
      toast.success('Serie recalculada.');
    } catch (e) {
      toast.error(e.message || 'No se pudo recalcular la serie');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatch = async (s) => {
    const values = newMatchForm[s.id] || {};
    try {
      setLoading(true);
      await window.electron.createMatchForSeries(s.id, {
        date: values.date || null,
        time_start: values.time_start || null,
        location: values.location || ''
      });
      loadSeries();
      toast.success('Partido agregado a la serie.');
      setNewMatchForm(prev => ({ ...prev, [s.id]: { date: '', time_start: '', location: '' } }));
    } catch (e) {
      toast.error(e.message || 'No se pudo crear el partido');
    } finally {
      setLoading(false);
    }
  };

  const nextGameNumber = (s) => {
    const list = matchesBySeries[s.id] || [];
    const existing = list.map(m => m.game_in_series || 0);
    const max = existing.length ? Math.max(...existing) : 0;
    return max + 1;
  };

  const teamLabel = (s, side) => {
    // Fallback robusto en UI por si no llega alias
    if (side === 'home') return s.home_team_name || `Equipo ${s.home_team_id}`;
    return s.away_team_name || `Equipo ${s.away_team_id}`;
  };

  const titleByRound = (round, bracket) => {
    if (round === 1) return `Semifinal${bracket ? ` • Llave ${bracket}` : ''}`;
    if (round === 2) return 'Final';
    return `Ronda ${round}${bracket ? ` • Llave ${bracket}` : ''}`;
  };

  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      <Toaster position="top-center" richColors />
      <HeaderView title="Playoffs" back={`/league-ranking/${folder_id}`}>
        <button className={primaryBtn} onClick={handleGenerateSemifinals} disabled={loading}>
          Generar Semifinales (Top 4)
        </button>
        <button className={secondaryBtn} onClick={handleGenerateFinal} disabled={loading}>
          Generar Final
        </button>
      </HeaderView>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className='grid lg:grid-cols-2 gap-6'>
          {series.length === 0 && (
            <div className="text-gray-600">No hay series creadas aún para este torneo.</div>
          )}

          {series.map((s) => {
            const matches = matchesBySeries[s.id] || [];
            const needToWin = Math.floor((s.best_of || 3) / 2) + 1;
            const completedWinsInfo = `(${s.wins_home} - ${s.wins_away}) • Mejor de ${s.best_of}, avanza quien gane ${needToWin}`;

            return (
              <div key={s.id} className={card}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {titleByRound(s.round, s.bracket)}
                    </h2>
                    <p className="text-sm text-gray-500">{completedWinsInfo}</p>
                    <p className="mt-1 text-sm">
                      <span className="font-medium text-gray-700">{teamLabel(s, 'home')}</span>
                      <span className="mx-2 text-gray-500">vs</span>
                      <span className="font-medium text-gray-700">{teamLabel(s, 'away')}</span>
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                      Estado: <span className="font-medium">{seriesStates[s.status]?.label}</span>
                      {s.winner_team_id ? (
                        <span className="ml-2 text-indigo-600 font-medium">
                          Ganador: {s.winner_team_id === s.home_team_id ? teamLabel(s, 'home') : teamLabel(s, 'away')}
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button className={secondaryBtn} onClick={() => handleRecalcSeries(s.id)} disabled={loading}>
                      Recalcular serie
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Partidos de la serie</h3>
                  <ul className="divide-y divide-gray-100 border rounded-md">
                    {matches.length === 0 ? (
                      <li className="p-3 text-gray-500">Aún no hay partidos creados.</li>
                    ) : (
                      matches.map((m) => (
                        <li key={m.id} className="p-3 flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-medium">Juego {m.game_in_series}</span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-gray-600">
                              {dayjs(m.date).format('DD/MM/YYYY') || 'Sin fecha'} {m.time_start ? `• ${m.time_start}` : ''}
                            </span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-gray-600">{m.location || 'Sin sede'}</span>
                          </div>
                          <div className="text-sm">
                            {m.status === 'completed' ? (
                              <span className="font-semibold text-gray-800">
                                {m.home_score} - {m.away_score}
                              </span>
                            ) : (
                              <span className="text-gray-500">{matchStates[m.status]?.label}</span>
                            )}
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {/* Formulario agregar partido */}
                {(!s.winner_team_id) ? (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Agregar siguiente partido (Juego {nextGameNumber(s)})
                    </h4>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className={label}>Fecha</label>
                        <input
                          type="date"
                          className={input}
                          value={(newMatchForm[s.id]?.date) || ''}
                          onChange={(e) =>
                            setNewMatchForm((prev) => ({
                              ...prev,
                              [s.id]: { ...(prev[s.id] || {}), date: e.target.value }
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className={label}>Hora de inicio</label>
                        <input
                          type="time"
                          className={input}
                          value={(newMatchForm[s.id]?.time_start) || ''}
                          onChange={(e) =>
                            setNewMatchForm((prev) => ({
                              ...prev,
                              [s.id]: { ...(prev[s.id] || {}), time_start: e.target.value }
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className={label}>Sede</label>
                        <input
                          type="text"
                          placeholder="Gimnasio..."
                          className={input}
                          value={(newMatchForm[s.id]?.location) || ''}
                          onChange={(e) =>
                            setNewMatchForm((prev) => ({
                              ...prev,
                              [s.id]: { ...(prev[s.id] || {}), location: e.target.value }
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <button
                        className={primaryBtn}
                        onClick={() => handleCreateMatch(s)}
                        disabled={loading || !newMatchForm[s.id]?.date || !newMatchForm[s.id]?.time_start || !newMatchForm[s.id]?.location}
                      >
                        Agregar partido
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}