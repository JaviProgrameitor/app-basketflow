
import React from "react";
import Input from "../form/Input.jsx";

const DraftRoundCard = ({ 
  round, 
  roundIdx, 
  saveSingleDraft = () => {}, 
  updateMatchDraft = () => {},
  saveSingleRoundDraft = () => {},
}) => {
  // UI helpers
  const secondaryBtn =
    "button inline-flex items-center px-3 py-1.5 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50";
  const subtleBtn =
    "button inline-flex items-center px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50";
  const card = "bg-white shadow rounded-lg border border-gray-100";
  return (
    <div className={`${card} p-4`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">
          Jornada {roundIdx + 1}
        </h3>
        <button
          className={subtleBtn}
          onClick={() => saveSingleRoundDraft(round, roundIdx + 1)}
        >
          Guardar jornada
        </button>
      </div>

      <div className="mt-3 divide-y divide-gray-100 border rounded-md">
        {round.map((m, matchIdx) => (
          <div
            key={`${roundIdx}-${matchIdx}`}
            className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="text-sm font-medium text-gray-800">
              {m.home_team_name || "—"}{" "}
              <span className="text-gray-500">vs</span>{" "}
              {m.away_team_name || "—"}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
              <Input
                type="date"
                name={'date'}
                value={m.date}
                setValue={(v) => updateMatchDraft(roundIdx, matchIdx, "date", v)}
                placeholder="Fecha"
                inputclassName='px-0 py-0 text-sm'
              />
              <Input
                type="time"
                name={'time_start'}
                value={m.time_start}
                setValue={(v) => updateMatchDraft(roundIdx, matchIdx, "time_start", v)}
                placeholder="Hora inicio"
                inputclassName='px-0 py-0 text-sm'
              />
              <Input
                type="text"
                name={'location'}
                value={m.location}
                setValue={(v) => updateMatchDraft(roundIdx, matchIdx, "location", v)}
                placeholder="Lugar"
                inputclassName='px-0 py-0 text-sm'
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                className={secondaryBtn}
                onClick={() => saveSingleDraft(m)}
              >
                Guardar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

export default DraftRoundCard;