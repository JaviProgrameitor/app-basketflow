import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";

import { generateRoundRobin } from "../helpers/match.js";
import { mixingArr, groupBy } from "../helpers/array.js";
import { Toaster, toast } from 'sonner'

import HeaderView from "../components/ui/HeaderView.jsx";
import ManageSavedSchedule from "../components/ui/ManageSavedSchedule.jsx";
import GenerateSchedule from "../components/ui/GenerateSchedule.jsx";

export default function LeagueScheduleGenerator() {
  const { folder_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [tab, setTab] = useState("generate"); // generate | template
  const [schedule, setSchedule] = useState([]); // generado en memoria (por rondas)
  const [savedSchedule, setSavedSchedule] = useState([]); // generado en BD (por rondas)

  // Carga equipos (usa tu IPC que ya hace COALESCE de custom_name/name)
  const fetchTeams = async () => {
    const rows = await window.electron.getFoldersTeamsByFolderId(folder_id);
    setTeams(rows || []);
  };

  // Carga partidos generados guardados (generated_matches)
  const fetchGeneratedMatches = async () => {
    const rows = await window.electron.getGeneratedMatchesByFolderId(folder_id);
    // Agrupa por ronda (tu helper produce arrays indexados por round-1)
    const grouped = groupBy(rows || [], "round");
    console.log("Partidos generados guardados:", grouped);
    setSavedSchedule(grouped);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        Promise.all([
          fetchTeams(),
          fetchGeneratedMatches(),
        ])
      } catch (e) {
        toast.error(e.message || "Error inicializando");
      } finally {
        setLoading(false);
      }
    })();
  }, [folder_id]);

  // Generar round-robin sin asignar fecha/hora/sede
  const handleGenerate = () => {
    try {
      if (teams.length < 2) {
        toast.error("Se requieren al menos 2 equipos.");
        return;
      }
      // Tu función de RR espera [{ id, name }, ...]
      const seed = teams.map((t) => ({ id: t.id, name: t.name }));
      const rr = generateRoundRobin(mixingArr(seed));
      console.log("Calendario generado (sin fecha/hora/sede):", rr);

      // Normaliza: asegura date/time/location vacíos y round asignado por índice
      const normalized = rr.map((round, idx) =>
        round.map((m) => ({
          home_team_id: m.home_team_id ?? m.home?.id ?? m.home ?? null,
          away_team_id: m.away_team_id ?? m.away?.id ?? m.away ?? null,
          home_team_name: m.home_team_name ?? "",
          away_team_name: m.away_team_name ?? "",
          date: "", // el usuario lo definirá
          time_start: "", // el usuario lo definirá
          location: "", // el usuario lo definirá
          round: idx + 1,
          published: 0,
        }))
      );

      console.log("Calendario normalizado:", normalized);
      setSchedule(normalized);
      setTab("generate");
      toast.success("Calendario generado. Completa fechas/horarios/sedes y guarda.");
    } catch (e) {
      toast.error(e.message || "Error generando calendario");
    }
  };

  // Cambia un campo (fecha/hora/sede) en el calendario generado en memoria
  const updateMatchDraft = (roundIdx, matchIdx, field, value) => {
    setSchedule((prev) => {
      const next = prev.map((r) => r.slice());
      next[roundIdx][matchIdx] = { ...next[roundIdx][matchIdx], [field]: value };
      return next;
    });
  };

  // Guardar TODOS los partidos generados a generated_matches
  const saveAllDraft = async () => {
    try {
      if ((schedule || []).length === 0) {
        toast.error("No hay calendario generado para guardar.");
        return;
      }
      const payload = [];
      schedule.forEach((round, roundIdx) => {
        round.forEach((m) => {
          if (!m?.home_team_id || !m?.away_team_id) return;
          payload.push({
            folder_id: folder_id,
            home_team_id: m.home_team_id,
            away_team_id: m.away_team_id,
            date: m.date || null,
            time_start: m.time_start || null,
            location: m.location || null,
            round: Number(m.round || roundIdx + 1),
            // published lo maneja tu tabla con default 0
          });
        });
      });

      if (payload.length === 0) {
        toast.error("No hay partidos válidos para guardar.");
        return;
      }

      setLoading(true);
      await window.electron.addGeneratedMatches(payload);
      await fetchGeneratedMatches();
      setTab("template");
      toast.success("Partidos guardados en plantilla.");
    } catch (e) {
      toast.error(e.message || "Error guardando partidos generados");
    } finally {
      setLoading(false);
    }
  };

  // Guardar solo un partido (wrapping a addGeneratedMatches)
  const saveSingleDraft = async (m) => {
    try {
      if (!m?.home_team_id || !m?.away_team_id) return;
      const payload = [
        {
          folder_id: folder_id,
          home_team_id: m.home_team_id,
          away_team_id: m.away_team_id,
          date: m.date || null,
          time_start: m.time_start || null,
          location: m.location || null,
          round: Number(m.round || 1),
        },
      ];
      setLoading(true);
      await window.electron.addGeneratedMatches(payload);
      await fetchGeneratedMatches();
      toast.success("Partido agregado a la plantilla.");
    } catch (e) {
      toast.error(e.message || "Error al guardar el partido");
    } finally {
      setLoading(false);
    }
  };

  const saveSingleRoundDraft = (round, roundIdx) => {
    // Guardar solo esta jornada
    const payload = round
      .filter((m) => m.home_team_id && m.away_team_id)
      .map((m) => ({
        folder_id: folder_id,
        home_team_id: m.home_team_id,
        away_team_id: m.away_team_id,
        date: m.date || null,
        time_start: m.time_start || null,
        location: m.location || null,
        round: Number(m.round || roundIdx),
      }));
    if (payload.length) {
      window.electron
        .addGeneratedMatches(payload)
        .then(fetchGeneratedMatches)
        .then(() =>
          toast.success(`Jornada ${roundIdx} guardada en plantilla.`)
        )
        .catch((e) =>
          toast.error(e.message || `Error guardando jornada ${roundIdx}`)
        );
    } else toast.error(`Error guardando jornada ${roundIdx}`)
  }

  // Eliminar todos los generados
  const deleteAllGenerated = async () => {
    try {
      setLoading(true);
      await window.electron.deleteAllGeneratedMatchesByFolderId(folder_id);
      await fetchGeneratedMatches();
      toast.success("Plantilla vaciada.");
    } catch (e) {
      toast.error(e.message || "Error al eliminar plantilla");
    } finally {
      setLoading(false);
    }
  };

  // Actualiza un partido ya guardado (solo metadata fecha/hora/sede/round)
  const updateSavedMatch = async (match) => {
    try {
      setLoading(true);
      await window.electron.updateGeneratedMatch({
        id: match.id,
        folder_id: folder_id,
        home_team_id: match.home_team_id,
        away_team_id: match.away_team_id,
        date: match.date || null,
        time_start: match.time_start || null,
        location: match.location || null,
        round: Number(match.round || 1),
        published: match.published ?? 0,
      });
      await fetchGeneratedMatches();
      toast.success("Partido actualizado.");
    } catch (e) {
      toast.error(e.message || "Error actualizando el partido");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar partido guardado
  const deleteSavedMatch = async (matchId) => {
    try {
      setLoading(true);
      await window.electron.deleteGeneratedMatch(matchId);
      await fetchGeneratedMatches();
      toast.success("Partido eliminado.");
    } catch (e) {
      toast.error(e.message || "Error eliminando el partido");
    } finally {
      setLoading(false);
    }
  };

  // Publicar un partido de plantilla: lo marca publicado y lo inserta en matches
  const publishSavedMatch = async (m) => {
    try {
      // Validación básica
      const missing = [];
      if (!m.date) missing.push("fecha");
      if (!m.time_start) missing.push("hora");
      if (!m.location) missing.push("sede");
      if (missing.length) {
        toast.error("Completa antes: " + missing.join(", ") + " para poder publicar.");
        return;
      }

      setLoading(true);
      // Marca como publicado en plantilla
      await window.electron.publishGeneratedMatch(m.id);

      // Inserta en matches (tipo liga)
      await window.electron.addMatch({
        home_team_id: m.home_team_id,
        away_team_id: m.away_team_id,
        folder_id: folder_id,
        number_game: null,
        date: m.date,
        time_start: m.time_start,
        time_end: null,
        location: m.location,
        referee_main: null,
        referee1: null,
        referee2: null,
        anotator: null,
        assistant_anotator: null,
        timekeeper: null,
        clock_operator: null,
        status: "scheduled",
        period: 1,
        pending_sync: 0,
        updated_at: new Date().toISOString(),
        deleted: 0,
        password_crew_chief: "",
        last_four_minutes: 0,
        match_type: "league",
        round: m.round,
        series_id: null,
        game_in_series: null,
        home_score: 0,
        away_score: 0,
        winner_team_id: null,
      });

      await fetchGeneratedMatches();
      toast.success("Partido publicado a la liga.");
    } catch (e) {
      toast.error(e.message || "Error publicando el partido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Toaster position="top-center" richColors />
      <HeaderView title="Generador de Calendario de Liga" back={`/matches/${folder_id}`}>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Equipos:{" "}
            <span className="font-medium text-gray-800">{teams.length}</span>
          </span>
          <span className="h-4 w-px bg-gray-300" />
          <span className="text-sm text-gray-500">
            Jornadas guardadas:{" "}
            <span className="font-medium text-gray-800">
              {savedSchedule.filter(Boolean).length}
            </span>
          </span>
        </div>
      </HeaderView>

      <div className="flex-1 p-6 overflow-y-auto">
        {
          tab === "generate" ? (
            <GenerateSchedule
              setTab={setTab}
              loading={loading}
              teams={teams}
              handleGenerate={handleGenerate}
              saveAllDraft={saveAllDraft}
              schedule={schedule}
              saveSingleDraft={saveSingleDraft}
              updateMatchDraft={updateMatchDraft}
              saveSingleRoundDraft={saveSingleRoundDraft}
            />
          ) : (
            <ManageSavedSchedule
              setTab={setTab}
              loading={loading}
              deleteAllGenerated={deleteAllGenerated}
              deleteSavedMatch={deleteSavedMatch}
              fetchGeneratedMatches={fetchGeneratedMatches}
              savedSchedule={savedSchedule}
              publishSavedMatch={publishSavedMatch}
              updateSavedMatch={updateSavedMatch}
            />
          )
        }
      </div>
    </div>
  );
}