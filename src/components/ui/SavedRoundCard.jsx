
import React from "react";

import Input from "../form/Input.jsx";

const SavedRoundCard = ({ 
  round, 
  roundIdx, 
  updateSavedMatch = () => { }, 
  publishSavedMatch = () => { }, 
  deleteSavedMatch = () => { } 
}) => {

  // UI helpers
  const primaryBtn =
    "button inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50";
  const dangerBtn =
    "button inline-flex items-center px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50";
  const card = "bg-white shadow rounded-lg border border-gray-100";
  return (
    <div className={`${card} p-4`}>
      <h3 className="text-sm font-semibold text-gray-800">
        Jornada {roundIdx + 1}
      </h3>
      <div className="mt-3 divide-y divide-gray-100 border rounded-md">
        {round.map((m) => (
          <div
            key={m.id}
            className="p-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"
          >
            <div className="text-sm font-medium text-gray-800">
              {m.home_team_name || `#${m.home_team_id}`}{" "}
              <span className="text-gray-500">vs</span>{" "}
              {m.away_team_name || `#${m.away_team_id}`}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 flex-1">
              <Input
                type="date"
                name={'date'}
                value={m.date}
                setValue={(v) => updateSavedMatch({ ...m, date: v })}
                inputclassName='px-0 py-0 text-sm'
              />
              <Input
                type="time"
                name={'time_start'}
                value={m.time_start}
                setValue={(v) => updateSavedMatch({ ...m, time_start: v })}
                inputclassName='px-0 py-0 text-sm'
              />
              <Input
                type="text"
                name={'location'}
                value={m.location}
                setValue={(v) => updateSavedMatch({ ...m, location: v })}
                placeholder="Lugar"
                inputclassName='px-0 py-0 text-sm'
              />
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded ${m.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
              >
                {m.published ? "Publicado" : "Borrador"}
              </span>
              {!m.published && (
                <button
                  className={primaryBtn}
                  disabled={!m.date || !m.time_start || !m.location}
                  onClick={() => publishSavedMatch(m)}
                >
                  Publicar
                </button>
              )}
              <button
                className={dangerBtn}
                onClick={() => deleteSavedMatch(m.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SavedRoundCard;